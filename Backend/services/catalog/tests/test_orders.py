import uuid
from datetime import datetime
from types import SimpleNamespace

import pymongo  # pyright: ignore[reportMissingImports]
import pytest  # pyright: ignore[reportMissingImports]
from fastapi import FastAPI  # pyright: ignore[reportMissingImports]
from fastapi.testclient import TestClient  # pyright: ignore[reportMissingImports]
from motor.motor_asyncio import AsyncIOMotorClient  # pyright: ignore[reportMissingImports]

from catalog.database import get_db
from catalog.routers.auth import admin as admin_auth, customer as customer_auth
from catalog.routers.orders import orders

MONGO_URI = "mongodb://localhost:27017"


@pytest.fixture
def test_db():
    """Yields the async Motor db used by the app (via dependency override).
    Test bodies that need to seed/inspect data directly use `sync_db()`
    below instead — mixing a synchronous asyncio.run()-style call against
    the Motor client with the TestClient's own event loop (which runs in a
    background thread via anyio's blocking portal) binds the client to two
    different loops and raises "attached to a different loop"."""
    db_name = f"novaxchange_test_{uuid.uuid4().hex[:10]}"
    motor_client = AsyncIOMotorClient(MONGO_URI)
    db = motor_client[db_name]
    yield db
    motor_client.close()
    pymongo.MongoClient(MONGO_URI).drop_database(db_name)


def sync_db(test_db):
    """A plain synchronous pymongo handle to the same test database — safe
    to use from test bodies regardless of which event loop Motor is bound
    to inside the running app."""
    return pymongo.MongoClient(MONGO_URI)[test_db.name]


@pytest.fixture
def app_settings(monkeypatch):
    monkeypatch.setattr(customer_auth, "settings", SimpleNamespace(
        customer_jwt_secret="test-customer-secret",
        jwt_algorithm="HS256",
        customer_jwt_expire_minutes=60,
        admin_email="admin@example.com",
    ))
    monkeypatch.setattr(customer_auth, "send_welcome_email", lambda user: None)
    monkeypatch.setattr(admin_auth, "settings", SimpleNamespace(
        admin_email="admin@example.com",
        jwt_secret="test-admin-secret",
        jwt_algorithm="HS256",
        jwt_expire_minutes=60,
    ))
    # Never hit real SMTP from order creation in tests.
    monkeypatch.setattr(orders, "send_order_confirmation_email", lambda order: None)
    monkeypatch.setattr(orders, "send_admin_new_order_alert", lambda order: None)


@pytest.fixture
def client(test_db, app_settings):
    app = FastAPI()
    app.include_router(admin_auth.router)
    app.include_router(customer_auth.router)
    app.include_router(orders.router)
    app.dependency_overrides[get_db] = lambda: test_db
    with TestClient(app) as c:
        yield c


def admin_token():
    return admin_auth.create_access_token({
        "sub": "admin@example.com", "role": "admin", "email": "admin@example.com",
    })


def customer_token(user_id: str, email: str = "shopper@example.com"):
    return customer_auth.create_customer_token({"sub": user_id, "role": "customer", "email": email})


def seed_product(test_db, **overrides):
    doc = {
        "name": "Test Mouse",
        "slug": "test-mouse",
        "category": "mouse",
        "tier": "budget",
        "price_ugx": 50000,
        "original_price_ugx": None,
        "stock": 10,
        "tags": [],
        "images": [],
        "short_description": "A mouse",
        "description": "A test mouse",
        "specs": {},
        "active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    doc.update(overrides)
    result = sync_db(test_db).products.insert_one(doc)
    return result.inserted_id


def get_product(test_db, pid):
    return sync_db(test_db).products.find_one({"_id": pid})


def _checkout_payload(product_id: str, quantity: int = 1, **customer_overrides):
    customer = {
        "name": "Jane Shopper",
        "whatsapp": "0752000000",
        "email": "shopper@example.com",
        "address": "Kampala, Makerere",
        "notes": None,
    }
    customer.update(customer_overrides)
    return {
        "customer": customer,
        "items": [{"product_id": product_id, "quantity": quantity}],
    }


# ── Happy path ─────────────────────────────────────────────────────────────────

def test_create_order_decrements_stock(client, test_db):
    pid = seed_product(test_db, stock=5, price_ugx=10000)
    response = client.post("/orders", json=_checkout_payload(str(pid), quantity=2))
    assert response.status_code == 201
    body = response.json()
    assert body["order_number"].startswith("NXC-")
    assert body["status"] == "pending"
    assert body["total_ugx"] == 20000
    assert get_product(test_db, pid)["stock"] == 3


def test_create_order_guest_has_no_user_id(client, test_db):
    pid = seed_product(test_db, stock=5)
    response = client.post("/orders", json=_checkout_payload(str(pid)))
    assert response.status_code == 201
    assert response.json()["customer"]["user_id"] is None


def test_create_order_links_logged_in_customer(client, test_db):
    pid = seed_product(test_db, stock=5)
    token = customer_token(user_id="000000000000000000000001")
    response = client.post(
        "/orders",
        json=_checkout_payload(str(pid)),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    assert response.json()["customer"]["user_id"] == "000000000000000000000001"


# ── Stock validation ────────────────────────────────────────────────────────────

def test_insufficient_stock_returns_422_with_no_mutation(client, test_db):
    pid_a = seed_product(test_db, name="A", slug="a", stock=1)
    pid_b = seed_product(test_db, name="B", slug="b", stock=5)

    payload = {
        "customer": {
            "name": "Jane", "whatsapp": "0752000000", "email": "shopper@example.com",
            "address": "Kampala", "notes": None,
        },
        "items": [
            {"product_id": str(pid_a), "quantity": 2},   # insufficient
            {"product_id": str(pid_b), "quantity": 1},   # fine on its own
        ],
    }
    response = client.post("/orders", json=payload)
    assert response.status_code == 422
    assert get_product(test_db, pid_a)["stock"] == 1   # untouched
    assert get_product(test_db, pid_b)["stock"] == 5   # untouched — validated before any mutation


def test_inactive_product_rejected(client, test_db):
    pid = seed_product(test_db, active=False, stock=5)
    response = client.post("/orders", json=_checkout_payload(str(pid)))
    assert response.status_code == 422


def test_invalid_product_id_rejected(client, test_db):
    response = client.post("/orders", json=_checkout_payload("not-a-real-id"))
    assert response.status_code == 422


def test_stock_race_rolls_back_earlier_decrements(test_db, app_settings):
    """Simulates a genuine concurrent race: product A's guarded decrement
    succeeds for real, product B's is forced to report modified_count=0
    (as if another request won the race between validation and write).
    Asserts A's real stock is rolled back and B is left untouched."""
    pid_a = seed_product(test_db, name="A", slug="a", stock=5)
    pid_b = seed_product(test_db, name="B", slug="b", stock=5)

    class RacingCollection:
        def __init__(self, real, losing_id):
            self._real = real
            self._losing_id = losing_id
            self._triggered = False

        def __getattr__(self, name):
            return getattr(self._real, name)

        async def update_one(self, filt, update):
            if not self._triggered and filt.get("_id") == self._losing_id:
                self._triggered = True
                return SimpleNamespace(modified_count=0)
            return await self._real.update_one(filt, update)

    class RacingDB:
        def __init__(self, real_db, losing_id):
            self._real = real_db
            self.products = RacingCollection(real_db.products, losing_id)

        def __getattr__(self, name):
            return getattr(self._real, name)

    racing_db = RacingDB(test_db, pid_b)

    app = FastAPI()
    app.include_router(admin_auth.router)
    app.include_router(customer_auth.router)
    app.include_router(orders.router)
    app.dependency_overrides[get_db] = lambda: racing_db

    payload = {
        "customer": {
            "name": "Jane", "whatsapp": "0752000000", "email": "shopper@example.com",
            "address": "Kampala", "notes": None,
        },
        "items": [
            {"product_id": str(pid_a), "quantity": 1},  # decrements for real
            {"product_id": str(pid_b), "quantity": 1},  # forced race loss
        ],
    }
    with TestClient(app) as client:
        response = client.post("/orders", json=payload)
    assert response.status_code == 409
    assert get_product(test_db, pid_a)["stock"] == 5   # rolled back after B's failure
    assert get_product(test_db, pid_b)["stock"] == 5   # never actually decremented


# ── Guest lookup ────────────────────────────────────────────────────────────────

def test_guest_lookup_wrong_contact_returns_404(client, test_db):
    pid = seed_product(test_db, stock=5)
    order_number = client.post("/orders", json=_checkout_payload(str(pid))).json()["order_number"]
    response = client.get(f"/orders/{order_number}", params={"contact": "someone-else@example.com"})
    assert response.status_code == 404


def test_guest_lookup_correct_contact_returns_order(client, test_db):
    pid = seed_product(test_db, stock=5)
    order_number = client.post("/orders", json=_checkout_payload(str(pid))).json()["order_number"]
    response = client.get(f"/orders/{order_number}", params={"contact": "shopper@example.com"})
    assert response.status_code == 200
    assert response.json()["order_number"] == order_number


# ── Customer order history ──────────────────────────────────────────────────────

def test_my_orders_requires_customer_token(client):
    response = client.get("/account/orders")
    assert response.status_code in (401, 403)


def test_my_orders_lists_own_orders(client, test_db):
    pid = seed_product(test_db, stock=5)
    token = customer_token(user_id="000000000000000000000002")
    client.post("/orders", json=_checkout_payload(str(pid)), headers={"Authorization": f"Bearer {token}"})

    response = client.get("/account/orders", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json()) == 1


# ── Admin endpoints ──────────────────────────────────────────────────────────────

def test_admin_orders_requires_admin_token(client):
    assert client.get("/admin/orders").status_code in (401, 403)
    cust_token = customer_token(user_id="000000000000000000000003")
    response = client.get("/admin/orders", headers={"Authorization": f"Bearer {cust_token}"})
    assert response.status_code in (401, 403)


def test_admin_can_list_and_view_order(client, test_db):
    pid = seed_product(test_db, stock=5)
    client.post("/orders", json=_checkout_payload(str(pid)))

    token = admin_token()
    listed = client.get("/admin/orders", headers={"Authorization": f"Bearer {token}"})
    assert listed.status_code == 200
    assert listed.json()["total"] == 1

    order_id = listed.json()["items"][0]["id"]
    detail = client.get(f"/admin/orders/{order_id}", headers={"Authorization": f"Bearer {token}"})
    assert detail.status_code == 200


# ── Status transitions ───────────────────────────────────────────────────────────

def _create_and_get_id(client, test_db, stock=5):
    pid = seed_product(test_db, stock=stock)
    order_number = client.post("/orders", json=_checkout_payload(str(pid))).json()["order_number"]
    token = admin_token()
    listed = client.get("/admin/orders", headers={"Authorization": f"Bearer {token}"}).json()
    order = next(o for o in listed["items"] if o["order_number"] == order_number)
    return order["id"], pid, token


def test_valid_transition_pending_to_confirmed(client, test_db):
    order_id, _, token = _create_and_get_id(client, test_db)
    response = client.patch(
        f"/admin/orders/{order_id}/status",
        json={"status": "confirmed"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "confirmed"


def test_invalid_transition_pending_to_shipped_rejected(client, test_db):
    order_id, _, token = _create_and_get_id(client, test_db)
    response = client.patch(
        f"/admin/orders/{order_id}/status",
        json={"status": "shipped"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 409


def test_invalid_transition_from_terminal_delivered_rejected(client, test_db):
    order_id, _, token = _create_and_get_id(client, test_db)
    for status_ in ("confirmed", "packed", "shipped", "delivered"):
        r = client.patch(
            f"/admin/orders/{order_id}/status",
            json={"status": status_},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert r.status_code == 200, r.text
    response = client.patch(
        f"/admin/orders/{order_id}/status",
        json={"status": "pending"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 409


def test_cancellation_restores_stock_exactly_once(client, test_db):
    order_id, pid, token = _create_and_get_id(client, test_db, stock=5)
    assert get_product(test_db, pid)["stock"] == 4  # decremented by 1 at order creation

    cancel = client.patch(
        f"/admin/orders/{order_id}/status",
        json={"status": "cancelled"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert cancel.status_code == 200
    assert get_product(test_db, pid)["stock"] == 5  # restored exactly once

    # Re-issuing the same terminal status must be a no-op, not a second restore.
    again = client.patch(
        f"/admin/orders/{order_id}/status",
        json={"status": "cancelled"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert again.status_code == 200
    assert get_product(test_db, pid)["stock"] == 5
