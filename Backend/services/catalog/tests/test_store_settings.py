import uuid
from types import SimpleNamespace

import pymongo  # pyright: ignore[reportMissingImports]
import pytest  # pyright: ignore[reportMissingImports]
from fastapi import FastAPI  # pyright: ignore[reportMissingImports]
from fastapi.testclient import TestClient  # pyright: ignore[reportMissingImports]
from motor.motor_asyncio import AsyncIOMotorClient  # pyright: ignore[reportMissingImports]

from catalog.database import get_db
from catalog.routers.auth import admin as admin_auth
from catalog.routers.products import store_settings

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
def admin_settings(monkeypatch):
    settings = SimpleNamespace(
        admin_email="admin@example.com",
        jwt_secret="test-admin-secret",
        jwt_algorithm="HS256",
        jwt_expire_minutes=60,
    )
    monkeypatch.setattr(admin_auth, "settings", settings)
    return settings


@pytest.fixture
def client(test_db, admin_settings):
    app = FastAPI()
    app.include_router(admin_auth.router)
    app.include_router(store_settings.router)
    app.include_router(store_settings.admin_router)
    app.dependency_overrides[get_db] = lambda: test_db
    with TestClient(app) as c:
        yield c


def _admin_token():
    return admin_auth.create_access_token({
        "sub": "admin@example.com", "role": "admin", "email": "admin@example.com",
    })


SAMPLE_PAYLOAD = {
    "enabled": True,
    "countdown_secs": 8,
    "bundles": [
        {
            "id": "test-combo",
            "tag": "Test Combo",
            "headline": "Headline",
            "subline": "Subline",
            "emoji": "⚡",
            "accent_color": "#6C2BD9",
            "accent_text": "#FFE033",
            "bg_color": "#EDE6FF",
            "items": [{"name": "Mouse", "detail": "Logitech M185"}],
            "freebie": "Free mat",
            "original_price_ugx": 100_000,
            "bundle_price_ugx": 80_000,
            "wa_message": "Hi!",
        }
    ],
}


def test_get_bundle_deals_defaults_to_disabled_when_unset(client):
    response = client.get("/settings/bundle-deals")
    assert response.status_code == 200
    body = response.json()
    assert body["enabled"] is False
    assert body["bundles"] == []


def test_admin_can_update_and_public_get_reflects_it(client):
    put_response = client.put(
        "/admin/settings/bundle-deals",
        headers={"Authorization": f"Bearer {_admin_token()}"},
        json=SAMPLE_PAYLOAD,
    )
    assert put_response.status_code == 200

    get_response = client.get("/settings/bundle-deals")
    assert get_response.status_code == 200
    body = get_response.json()
    assert body["enabled"] is True
    assert body["countdown_secs"] == 8
    assert body["bundles"][0]["id"] == "test-combo"


def test_update_bundle_deals_requires_admin_token(client):
    response = client.put("/admin/settings/bundle-deals", json=SAMPLE_PAYLOAD)
    assert response.status_code in (401, 403)
