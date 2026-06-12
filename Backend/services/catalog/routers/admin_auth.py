"""
routers/admin_auth.py
──────────────────────────────────────────────────────────────────
Simple admin authentication — no separate auth service needed yet.

Flow:
  POST /admin/login  →  verify email + password against .env
                     →  return JWT with role: admin

The JWT is then sent as Bearer token on all /admin/* endpoints.

Upgrade path: when the full Auth service (Phase 1) is built,
replace get_admin_user() with a call to the Auth service's
/auth/me endpoint. The JWT format stays the same.
──────────────────────────────────────────────────────────────────
"""

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from catalog.config import get_settings

settings = get_settings()
router   = APIRouter(prefix="/admin", tags=["admin-auth"])
bearer   = HTTPBearer()
pwd_ctx  = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Request / response models ─────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email:    str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    expires_in:   int           # seconds


# ── Token helpers ─────────────────────────────────────────────────────────────

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


# ── Admin guard dependency ────────────────────────────────────────────────────

def get_admin_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
) -> dict:
    """
    FastAPI dependency — inject into any route that requires admin access.

    Usage:
        @router.post("/products")
        async def create(admin = Depends(get_admin_user), ...):
            ...

    Returns the decoded JWT payload on success.
    Raises 401 if token is missing, expired, or not admin-role.
    """
    payload = decode_token(credentials.credentials)
    if payload.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return payload


# ── Login endpoint ────────────────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
async def admin_login(body: LoginRequest):
    """
    Verify admin credentials from .env and return a JWT.

    In .env:
        ADMIN_EMAIL=admin@novaxchange.xyz
        ADMIN_PASSWORD_HASH=$2b$12$...  (bcrypt hash)

    Generate a hash:
        python -c "from passlib.hash import bcrypt; print(bcrypt.hash('yourpassword'))"

    The JWT contains role: admin — checked by get_admin_user() on every
    protected route.
    """
    # Check email
    if body.email.lower() != settings.admin_email.lower():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Check password against bcrypt hash stored in .env
    if not pwd_ctx.verify(body.password, settings.admin_password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token({
        "sub":   body.email,
        "role":  "admin",
        "email": body.email,
    })

    return TokenResponse(
        access_token=token,
        expires_in=settings.jwt_expire_minutes * 60,
    )


@router.get("/me")
async def me(admin: dict = Depends(get_admin_user)):
    """Quick check that the stored token is still valid."""
    return {"email": admin["email"], "role": admin["role"]}