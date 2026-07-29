"""
routers/customer_auth.py
──────────────────────────────────────────────────────────────────
Customer registration/login — deliberately independent from
routers/admin_auth.py: own CryptContext instance, own JWT secret
(settings.customer_jwt_secret), own token dependency. A customer
token can never be accepted by admin_auth.get_admin_user (and vice
versa) because JWT signature verification fails hard on a secret
mismatch — that's the isolation boundary Phase 1 asked for.

Accounts live in MongoDB (db.users), not the admin's flat JSON file
— admin credentials and customer credentials are never colocated.

No email-verification gate (unlike admin) — a deliberate
friction-reduction choice for v1; a welcome email is sent instead.
──────────────────────────────────────────────────────────────────
"""

import logging
import math
from datetime import datetime, timedelta

import httpx  # type: ignore
from bson import ObjectId  # pyright: ignore[reportMissingImports]
from fastapi import APIRouter, Depends, HTTPException, Query, status  # type: ignore
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer  # type: ignore
from jose import JWTError, jwt  # type: ignore
from passlib.context import CryptContext  # type: ignore

from catalog.config import get_settings
from catalog.database import get_db
from catalog.emailer import send_welcome_email
from catalog.models import (
    CustomerTokenResponse, GoogleAuthIn, UserCreate, UserListOut, UserLogin, UserOut, UserUpdate,
)
from catalog.routers.admin_auth import get_admin_user

settings = get_settings()
router = APIRouter(prefix="/account", tags=["customer-auth"])
# Separate, unprefixed router for admin-facing customer management — kept in
# this file since it's the same `users` collection, but registered under
# /admin/* (not /account/admin/*) to match the rest of the codebase's
# admin route convention.
admin_router = APIRouter(tags=["customer-auth"])
logger = logging.getLogger("catalog.customer_auth")

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
customer_bearer = HTTPBearer()
# auto_error=False — used where identifying a logged-in customer is optional
# (e.g. guest checkout), so a missing/invalid token must not raise on its own.
optional_customer_bearer = HTTPBearer(auto_error=False)


# ── Token helpers ─────────────────────────────────────────────────────────────

def create_customer_token(data: dict) -> str:
    payload = {
        **data,
        "exp": datetime.utcnow() + timedelta(minutes=settings.customer_jwt_expire_minutes),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.customer_jwt_secret, algorithm=settings.jwt_algorithm)


def decode_customer_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.customer_jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e


def get_current_customer(
    credentials: HTTPAuthorizationCredentials = Depends(customer_bearer),
) -> dict:
    payload = decode_customer_token(credentials.credentials)
    if payload.get("role") != "customer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Customer access required")
    return payload


def get_optional_customer(
    credentials: HTTPAuthorizationCredentials = Depends(optional_customer_bearer),
) -> dict | None:
    """Returns the customer JWT payload if a valid customer token was sent,
    otherwise None — never raises, so guest checkout is unaffected by a
    missing, expired, or malformed token."""
    if credentials is None:
        return None
    try:
        payload = decode_customer_token(credentials.credentials)
    except HTTPException:
        return None
    if payload.get("role") != "customer":
        return None
    return payload


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _get_user_by_id(user_id: str, db) -> dict:
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid session")
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Account no longer exists")
    return user


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/register", response_model=CustomerTokenResponse, status_code=status.HTTP_201_CREATED)
async def register(body: UserCreate, db=Depends(get_db)):
    if await db.users.find_one({"email": body.email}):
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")

    now = datetime.utcnow()
    doc = {
        "email": body.email,
        "password_hash": pwd_ctx.hash(body.password),
        "name": body.name,
        "whatsapp": body.whatsapp,
        "delivery_address": None,
        "auth_provider": "password",
        "created_at": now,
        "updated_at": now,
    }
    result = await db.users.insert_one(doc)
    created = await db.users.find_one({"_id": result.inserted_id})

    try:
        send_welcome_email(created)
    except Exception as e:
        logger.error("Welcome email failed for %s: %s", created["email"], e)

    token = create_customer_token({
        "sub": str(created["_id"]), "role": "customer", "email": created["email"],
    })
    return CustomerTokenResponse(access_token=token, expires_in=settings.customer_jwt_expire_minutes * 60)


@router.post("/login", response_model=CustomerTokenResponse)
async def login(body: UserLogin, db=Depends(get_db)):
    user = await db.users.find_one({"email": body.email.strip().lower()})
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    if not user.get("password_hash"):
        # Google-only account — no password to check against.
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "This account uses Google sign-in — continue with Google instead",
        )
    if not pwd_ctx.verify(body.password, user["password_hash"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")

    token = create_customer_token({
        "sub": str(user["_id"]), "role": "customer", "email": user["email"],
    })
    return CustomerTokenResponse(access_token=token, expires_in=settings.customer_jwt_expire_minutes * 60)


@router.post("/google", response_model=CustomerTokenResponse)
async def google_auth(body: GoogleAuthIn, db=Depends(get_db)):
    """Bridges a Supabase Google session into our own customer_jwt.

    Supabase only brokers the Google OAuth handshake — we never trust the
    client's claimed profile. The access_token is independently verified by
    asking Supabase's own auth server who it belongs to; email/id come from
    that response, never from the request body.
    """
    if not settings.supabase_url or not settings.supabase_anon_key:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Google sign-in is not configured")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{settings.supabase_url}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {body.access_token}",
                    "apikey": settings.supabase_anon_key,
                },
            )
    except httpx.HTTPError as e:
        logger.error("Supabase verification request failed: %s", e)
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, "Could not verify Google session") from e

    if resp.status_code != 200:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired Google session")

    profile = resp.json()
    email = (profile.get("email") or "").strip().lower()
    if not email:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Google account has no email")

    google_sub = profile.get("id")
    metadata = profile.get("user_metadata") or {}
    name = metadata.get("full_name") or metadata.get("name") or email.split("@")[0]

    now = datetime.utcnow()
    user = await db.users.find_one({"email": email})
    if user is None:
        doc = {
            "email": email,
            "password_hash": None,
            "name": name,
            "whatsapp": None,
            "delivery_address": None,
            "auth_provider": "google",
            "google_sub": google_sub,
            "created_at": now,
            "updated_at": now,
        }
        result = await db.users.insert_one(doc)
        user = await db.users.find_one({"_id": result.inserted_id})
        try:
            send_welcome_email(user)
        except Exception as e:
            logger.error("Welcome email failed for %s: %s", user["email"], e)
    elif not user.get("google_sub"):
        # An email/password account already exists with this (Google-verified)
        # email — link the two rather than error, matching standard
        # "Sign in with Google" behavior.
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"google_sub": google_sub, "updated_at": now}},
        )

    token = create_customer_token({
        "sub": str(user["_id"]), "role": "customer", "email": user["email"],
    })
    return CustomerTokenResponse(access_token=token, expires_in=settings.customer_jwt_expire_minutes * 60)


@router.get("/me", response_model=UserOut)
async def me(customer=Depends(get_current_customer), db=Depends(get_db)):
    user = await _get_user_by_id(customer["sub"], db)
    return UserOut.from_db(user)


@router.patch("/me", response_model=UserOut)
async def update_me(
    body: UserUpdate,
    customer=Depends(get_current_customer),
    db=Depends(get_db),
):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if updates:
        updates["updated_at"] = datetime.utcnow()
        await db.users.update_one({"_id": ObjectId(customer["sub"])}, {"$set": updates})
    user = await _get_user_by_id(customer["sub"], db)
    return UserOut.from_db(user)


# ── Admin ─────────────────────────────────────────────────────────────────────

@admin_router.get("/admin/customers", response_model=UserListOut)
async def list_customers(
    search: str = Query(""),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    query: dict = {}
    if search.strip():
        q = search.strip()
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"email": {"$regex": q, "$options": "i"}},
            {"whatsapp": {"$regex": q, "$options": "i"}},
        ]

    skip = (page - 1) * limit
    total = await db.users.count_documents(query)
    pages = math.ceil(total / limit) if total else 1
    cursor = db.users.find(query).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(limit)

    return UserListOut(
        items=[UserOut.from_db(d) for d in docs],
        total=total, page=page, limit=limit, pages=pages,
    )
