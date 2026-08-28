import uuid
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pymongo  # pyright: ignore[reportMissingImports]
import pytest  # pyright: ignore[reportMissingImports]
from fastapi import FastAPI  # pyright: ignore[reportMissingImports]
from fastapi.testclient import TestClient  # pyright: ignore[reportMissingImports]
from motor.motor_asyncio import AsyncIOMotorClient  # pyright: ignore[reportMissingImports]

from catalog.database import get_db
from catalog.routers.auth import admin as admin_auth, customer as customer_auth

MONGO_URI = "mongodb://localhost:27017"


@pytest.fixture
def test_db():
    db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
    motor_client = AsyncIOMotorClient(MONGO_URI)
    db = motor_client[db_name]
    yield db
    motor_client.close()
    pymongo.MongoClient(MONGO_URI).drop_database(db_name)


@pytest.fixture
def customer_settings(monkeypatch):
    settings = SimpleNamespace(
        customer_jwt_secret="test-customer-secret",
        jwt_algorithm="HS256",
        customer_jwt_expire_minutes=60,
        admin_email="admin@example.com",
        supabase_url="https://test.supabase.co",
        supabase_anon_key="test-anon-key",
    )
    monkeypatch.setattr(customer_auth, "settings", settings)
    # Never hit real SMTP in tests — register() calls this by name.
    monkeypatch.setattr(customer_auth, "send_welcome_email", lambda user: None)
    return settings


class _FakeSupabaseResponse:
    def __init__(self, status_code, payload):
        self.status_code = status_code
        self._payload = payload

    def json(self):
        return self._payload


def _mock_supabase_user(monkeypatch, status_code=200, payload=None):
    """Stubs httpx.AsyncClient.get so /account/google never hits the network —
    the async context manager (__aenter__/__aexit__) is real and harmless
    without a call to .get(); only .get() itself needs faking."""
    fake_resp = _FakeSupabaseResponse(status_code, payload or {})
    monkeypatch.setattr(
        customer_auth.httpx.AsyncClient, "get", AsyncMock(return_value=fake_resp),
    )


@pytest.fixture
def client(test_db, customer_settings):
    app = FastAPI()
    app.include_router(customer_auth.router)
    app.dependency_overrides[get_db] = lambda: test_db
    # Must be a context manager — otherwise each request spins up and tears
    # down its own event loop, and Motor's client (bound to the first loop)
    # breaks with "Event loop is closed" on the second request.
    with TestClient(app) as c:
        yield c


def _register(client, email="shopper@example.com", password="Passw0rd!", name="Test Shopper"):
    return client.post(
        "/account/register",
        json={"email": email, "password": password, "name": name, "whatsapp": "0752000000"},
    )


def test_register_creates_account_and_returns_token(client):
    response = _register(client)
    assert response.status_code == 201
    body = response.json()
    assert body["access_token"]
    assert body["token_type"] == "bearer"


def test_register_duplicate_email_returns_409(client):
    _register(client)
    response = _register(client)
    assert response.status_code == 409


def test_login_wrong_password_returns_401(client):
    _register(client)
    response = client.post(
        "/account/login",
        json={"email": "shopper@example.com", "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_login_correct_password_returns_token(client):
    _register(client)
    response = client.post(
        "/account/login",
        json={"email": "shopper@example.com", "password": "Passw0rd!"},
    )
    assert response.status_code == 200
    assert response.json()["access_token"]


def test_me_requires_token(client):
    response = client.get("/account/me")
    assert response.status_code in (401, 403)


def test_me_returns_profile(client):
    token = _register(client).json()["access_token"]
    response = client.get("/account/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "shopper@example.com"
    assert body["name"] == "Test Shopper"
    assert "password_hash" not in body


def test_update_me_updates_profile(client):
    token = _register(client).json()["access_token"]
    response = client.patch(
        "/account/me",
        headers={"Authorization": f"Bearer {token}"},
        json={"delivery_address": "Kampala, Makerere"},
    )
    assert response.status_code == 200
    assert response.json()["delivery_address"] == "Kampala, Makerere"


# ── Google auth (Supabase-verified, additive) ─────────────────────────────────

def test_google_auth_creates_new_user(client, monkeypatch):
    _mock_supabase_user(monkeypatch, payload={
        "id": "google-uid-1", "email": "newgoogle@example.com",
        "user_metadata": {"full_name": "Google User"},
    })
    response = client.post("/account/google", json={"access_token": "fake-token"})
    assert response.status_code == 200
    token = response.json()["access_token"]

    me = client.get("/account/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    body = me.json()
    assert body["email"] == "newgoogle@example.com"
    assert body["name"] == "Google User"
    assert body["whatsapp"] is None
    assert body["auth_provider"] == "google"


def test_google_auth_links_existing_password_account(client, test_db, monkeypatch):
    _register(client, email="link@example.com")

    _mock_supabase_user(monkeypatch, payload={
        "id": "google-uid-link", "email": "link@example.com",
        "user_metadata": {"full_name": "Link User"},
    })
    response = client.post("/account/google", json={"access_token": "fake-token"})
    assert response.status_code == 200

    count = pymongo.MongoClient(MONGO_URI)[test_db.name].users.count_documents(
        {"email": "link@example.com"}
    )
    assert count == 1


def test_password_login_rejected_for_google_only_account(client, monkeypatch):
    _mock_supabase_user(monkeypatch, payload={
        "id": "google-uid-2", "email": "googleonly@example.com",
        "user_metadata": {"name": "Google Only"},
    })
    client.post("/account/google", json={"access_token": "fake-token"})

    response = client.post(
        "/account/login",
        json={"email": "googleonly@example.com", "password": "whatever"},
    )
    assert response.status_code == 401


# ── Cross-auth isolation (the actual proof of the Phase 1 requirement) ────────

def test_admin_token_rejected_by_customer_dependency(test_db, customer_settings, monkeypatch):
    admin_settings = SimpleNamespace(
        admin_email="admin@example.com",
        jwt_secret="test-admin-secret",
        jwt_algorithm="HS256",
        jwt_expire_minutes=60,
    )
    monkeypatch.setattr(admin_auth, "settings", admin_settings)

    app = FastAPI()
    app.include_router(admin_auth.router)
    app.include_router(customer_auth.router)
    app.dependency_overrides[get_db] = lambda: test_db

    admin_token = admin_auth.create_access_token({
        "sub": "admin@example.com", "role": "admin", "email": "admin@example.com",
    })
    with TestClient(app) as client:
        response = client.get("/account/me", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code in (401, 403)


def test_admin_can_list_customers(test_db, customer_settings, monkeypatch):
    admin_settings = SimpleNamespace(
        admin_email="admin@example.com",
        jwt_secret="test-admin-secret",
        jwt_algorithm="HS256",
        jwt_expire_minutes=60,
    )
    monkeypatch.setattr(admin_auth, "settings", admin_settings)

    app = FastAPI()
    app.include_router(admin_auth.router)
    app.include_router(customer_auth.router)
    app.include_router(customer_auth.admin_router)
    app.dependency_overrides[get_db] = lambda: test_db

    admin_tok = admin_auth.create_access_token({
        "sub": "admin@example.com", "role": "admin", "email": "admin@example.com",
    })
    with TestClient(app) as client:
        client.post(
            "/account/register",
            json={"email": "a@example.com", "password": "Passw0rd!", "name": "A"},
        )
        response = client.get("/admin/customers", headers={"Authorization": f"Bearer {admin_tok}"})
    assert response.status_code == 200
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["email"] == "a@example.com"


def test_list_customers_requires_admin_token(test_db, customer_settings):
    app = FastAPI()
    app.include_router(customer_auth.router)
    app.include_router(customer_auth.admin_router)
    app.dependency_overrides[get_db] = lambda: test_db
    with TestClient(app) as client:
        response = client.get("/admin/customers")
    assert response.status_code in (401, 403)


def test_customer_token_rejected_by_admin_dependency(test_db, customer_settings, monkeypatch):
    admin_settings = SimpleNamespace(
        admin_email="admin@example.com",
        jwt_secret="test-admin-secret",
        jwt_algorithm="HS256",
        jwt_expire_minutes=60,
    )
    monkeypatch.setattr(admin_auth, "settings", admin_settings)

    app = FastAPI()
    app.include_router(admin_auth.router)
    app.include_router(customer_auth.router)
    app.dependency_overrides[get_db] = lambda: test_db

    customer_token = customer_auth.create_customer_token({
        "sub": "000000000000000000000000", "role": "customer", "email": "shopper@example.com",
    })
    with TestClient(app) as client:
        response = client.get("/admin/me", headers={"Authorization": f"Bearer {customer_token}"})
    assert response.status_code in (401, 403)
