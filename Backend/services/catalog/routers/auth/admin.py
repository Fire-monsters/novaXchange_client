"""
routers/admin_auth.py
──────────────────────────────────────────────────────────────────
Admin authentication with email verification support.
──────────────────────────────────────────────────────────────────
"""

import json
import secrets
import smtplib
from datetime import datetime, timedelta
from email.message import EmailMessage
from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status  # type: ignore
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer  # type: ignore
from jose import JWTError, jwt  # type: ignore
from passlib.context import CryptContext  # type: ignore
from pydantic import BaseModel  # type: ignore

from catalog.config import get_settings

settings = get_settings()
router = APIRouter(prefix="/admin", tags=["admin-auth"])
bearer = HTTPBearer()
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


def create_access_token(data: dict) -> str:
    payload = {
        **data,
        "exp": datetime.utcnow() + timedelta(minutes=settings.jwt_expire_minutes),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e


def get_admin_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
) -> dict:
    payload = decode_token(credentials.credentials)
    if payload.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return payload


def _accounts_path() -> Path:
    raw_path = getattr(settings, "admin_accounts_file", None) or "./data/admin_accounts.json"
    path = Path(raw_path).expanduser()
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def _load_accounts() -> dict[str, dict[str, Any]]:
    path = _accounts_path()
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text())
    except json.JSONDecodeError:
        return {}


def _save_accounts(accounts: dict[str, dict[str, Any]]) -> None:
    path = _accounts_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(accounts, indent=2))


def _build_verification_url(token: str) -> str:
    return f"{settings.base_url.rstrip('/')}/admin/verify?token={token}"


def _send_verification_email(email: str, token: str) -> str:
    verification_url = _build_verification_url(token)
    smtp_host = getattr(settings, "smtp_host", "")
    smtp_username = getattr(settings, "smtp_username", "")
    smtp_password = getattr(settings, "smtp_password", "")
    smtp_from_email = getattr(settings, "smtp_from_email", "") or smtp_username

    if not smtp_host or not smtp_username or not smtp_password:
        return verification_url

    message = EmailMessage()
    message["Subject"] = "Verify your novaXchange admin account"
    message["From"] = smtp_from_email
    message["To"] = email
    message.set_content(
        "Hello,\n\n"
        "Please verify your admin account by visiting the link below:\n\n"
        f"{verification_url}\n\n"
        "If you did not request this, you can ignore this email."
    )

    try:
        with smtplib.SMTP(smtp_host, int(getattr(settings, "smtp_port", 587)), timeout=10) as server:
            if getattr(settings, "smtp_use_tls", True):
                server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(message)
    except Exception:
        return verification_url

    return verification_url


def _bootstrap_default_account() -> dict[str, Any] | None:
    accounts = _load_accounts()
    email = settings.admin_email.lower().strip()

    password_hash = getattr(settings, "admin_password_hash", "") or ""
    if not password_hash or password_hash == "$2b$12$placeholder_replace_this_with_real_hash":
        raw_password = getattr(settings, "admin_password", "") or ""
        if raw_password:
            password_hash = pwd_ctx.hash(raw_password)

    if not password_hash or password_hash == "$2b$12$placeholder_replace_this_with_real_hash":
        return None

    if email in accounts:
        account = accounts[email]
        account["password_hash"] = password_hash
        account["verified"] = True
        account["verification_token"] = None
        account["updated_at"] = datetime.utcnow().isoformat()
        _save_accounts(accounts)
        return account

    now = datetime.utcnow().isoformat()
    accounts[email] = {
        "email": email,
        "password_hash": password_hash,
        "verified": True,
        "verification_token": None,
        "created_at": now,
        "updated_at": now,
    }
    _save_accounts(accounts)
    return accounts[email]


_bootstrap_default_account()


def register_admin_account(email: str, password: str, send_email: bool = True) -> dict[str, Any]:
    normalized_email = email.lower().strip()
    accounts = _load_accounts()
    account = accounts.get(normalized_email)

    if account and account.get("verified"):
        return account

    if account and account.get("verification_token") is None and account.get("verified") is False:
        token = secrets.token_urlsafe(32)
        now = datetime.utcnow().isoformat()
        account["verification_token"] = token
        account["updated_at"] = now
        _save_accounts(accounts)

        if send_email:
            _send_verification_email(normalized_email, token)

        return account

    token = secrets.token_urlsafe(32)
    now = datetime.utcnow().isoformat()
    account = {
        "email": normalized_email,
        "password_hash": pwd_ctx.hash(password),
        "verified": False,
        "verification_token": token,
        "created_at": account.get("created_at") if account else now,
        "updated_at": now,
    }

    accounts[normalized_email] = account
    _save_accounts(accounts)

    if send_email:
        _send_verification_email(normalized_email, token)

    return account


def verify_admin_account(token: str) -> dict[str, Any]:
    accounts = _load_accounts()
    for account in accounts.values():
        if account.get("verification_token") == token:
            account["verified"] = True
            account["verified_at"] = datetime.utcnow().isoformat()
            account["verification_token"] = None
            _save_accounts(accounts)
            return account

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Verification token not found")


def authenticate_admin(email: str, password: str) -> dict[str, Any]:
    normalized_email = email.lower().strip()
    default_email = settings.admin_email.lower().strip()

    account = _load_accounts().get(normalized_email)
    if not account or normalized_email == default_email:
        account = _bootstrap_default_account()
        if account and account.get("email", "").lower() != normalized_email:
            account = None

    if not account:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not pwd_ctx.verify(password, account["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not account.get("verified"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Please verify your email before continuing")

    return {"sub": normalized_email, "role": "admin", "email": normalized_email}


@router.post("/request-verification")
async def request_verification(body: LoginRequest):
    account = register_admin_account(body.email, body.password, send_email=True)
    verification_token = account.get("verification_token")
    verification_url = _build_verification_url(verification_token) if verification_token else f"{settings.base_url.rstrip('/')}/admin/verify"
    return {
        "message": "A verification link has been sent to your inbox.",
        "requires_verification": True,
        "verification_url": verification_url,
    }


@router.get("/verify")
async def verify_account(token: str | None = Query(default=None)):
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing verification token")

    account = verify_admin_account(token)
    return {
        "message": "Email verified successfully. You can now sign in.",
        "email": account["email"],
    }


@router.post("/login", response_model=TokenResponse)
async def admin_login(body: LoginRequest):
    payload = authenticate_admin(body.email, body.password)
    token = create_access_token(payload)
    return TokenResponse(access_token=token, expires_in=settings.jwt_expire_minutes * 60)


@router.get("/me")
async def me(admin: dict = Depends(get_admin_user)):
    return {"email": admin["email"], "role": admin["role"]}