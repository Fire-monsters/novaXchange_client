from types import SimpleNamespace

from fastapi import FastAPI  # pyright: ignore[reportMissingImports]
from fastapi.testclient import TestClient  # pyright: ignore[reportMissingImports]
from passlib.context import CryptContext  # pyright: ignore[reportMissingModuleSource, reportMissingImports]

from catalog.routers.auth import admin as admin_auth


def test_request_verification_and_login_flow(monkeypatch):
    pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
    password_hash = pwd_ctx.hash("secret123")

    temp_accounts_path = "/tmp/novaxchange-admin-accounts-test.json"
    monkeypatch.setattr(
        admin_auth,
        "settings",
        SimpleNamespace(
            admin_email="admin@example.com",
            admin_password_hash=password_hash,
            jwt_secret="test-secret",
            jwt_algorithm="HS256",
            jwt_expire_minutes=60,
            base_url="http://localhost:3001",
            admin_accounts_file=temp_accounts_path,
            smtp_host="",
            smtp_port=587,
            smtp_username="",
            smtp_password="",
            smtp_from_email="no-reply@novaxchange.xyz",
            smtp_use_tls=True,
        ),
    )
    if Path(temp_accounts_path).exists():
        Path(temp_accounts_path).unlink()

    app = FastAPI()
    app.include_router(admin_auth.router)
    client = TestClient(app)

    response = client.post(
        "/admin/request-verification",
        json={"email": "admin@example.com", "password": "secret123"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "verification_url" in payload

    token = payload["verification_url"].split("token=")[-1]
    verify_response = client.get(f"/admin/verify?token={token}")
    assert verify_response.status_code == 200

    login_response = client.post(
        "/admin/login",
        json={"email": "admin@example.com", "password": "secret123"},
    )
    assert login_response.status_code == 200
    assert login_response.json()["access_token"]


import importlib
import sys
from pathlib import Path

import pytest  # pyright: ignore[reportMissingImports]


@pytest.fixture
def admin_auth_module():
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    module = importlib.import_module("catalog.routers.auth.admin")
    return module


def test_register_verify_and_login_flow(tmp_path, admin_auth_module):
    admin_auth_module.settings.admin_accounts_file = str(tmp_path / "admin_accounts.json")
    account = admin_auth_module.register_admin_account(
        email="admin@example.com",
        password="SuperSecure123!",
        send_email=False,
    )

    assert account["verified"] is False
    assert account["email"] == "admin@example.com"
    assert account["verification_token"]

    verified_account = admin_auth_module.verify_admin_account(account["verification_token"])
    assert verified_account["verified"] is True

    token_payload = admin_auth_module.authenticate_admin(
        email="admin@example.com",
        password="SuperSecure123!",
    )
    assert token_payload["role"] == "admin"
    assert token_payload["email"] == "admin@example.com"


def test_bootstrap_default_admin_from_password(tmp_path, admin_auth_module):
    admin_auth_module.settings.admin_accounts_file = str(tmp_path / "admin_accounts.json")
    admin_auth_module.settings.admin_email = "fixed-admin@example.com"
    admin_auth_module.settings.admin_password = "SuperSecure123!"
    admin_auth_module.settings.admin_password_hash = ""

    account = admin_auth_module._bootstrap_default_account()

    assert account["email"] == "fixed-admin@example.com"
    assert account["verified"] is True
    assert account["verification_token"] is None

    token_payload = admin_auth_module.authenticate_admin(
        email="fixed-admin@example.com",
        password="SuperSecure123!",
    )
    assert token_payload["role"] == "admin"
    assert token_payload["email"] == "fixed-admin@example.com"


def test_existing_unverified_default_admin_is_marked_verified(tmp_path, admin_auth_module):
    admin_auth_module.settings.admin_accounts_file = str(tmp_path / "admin_accounts.json")
    admin_auth_module.settings.admin_email = "fixed-admin@example.com"
    admin_auth_module.settings.admin_password = "SuperSecure123!"
    admin_auth_module.settings.admin_password_hash = ""

    admin_auth_module._save_accounts({
        "fixed-admin@example.com": {
            "email": "fixed-admin@example.com",
            "password_hash": admin_auth_module.pwd_ctx.hash("old-password"),
            "verified": False,
            "verification_token": "abc123",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-01T00:00:00",
        }
    })

    account = admin_auth_module.authenticate_admin(
        email="fixed-admin@example.com",
        password="SuperSecure123!",
    )

    assert account["email"] == "fixed-admin@example.com"
    assert account["role"] == "admin"
