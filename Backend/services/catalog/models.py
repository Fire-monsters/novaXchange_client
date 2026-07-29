"""
models.py — Pydantic schemas for catalog service
─────────────────────────────────────────────────
Mirrors the shape of src/data/accessories.js exactly.
When the frontend reads from the API it gets the same field names
it already expects from the mock data — no mapping needed.

Three model pairs per resource:
    ProductCreate  → what the client sends (POST / PATCH body)
    ProductInDB    → what's stored in MongoDB (adds _id, timestamps)
    ProductOut     → what the API returns (converts ObjectId → string)
"""

from datetime import datetime
from typing import Optional
from bson import ObjectId  # type: ignore
from pydantic import BaseModel, Field, field_validator  # type: ignore


# ── ObjectId serialisation helper ────────────────────────────────────────────

class PyObjectId(str):
    """Lets Pydantic v2 handle MongoDB ObjectId as a plain string in JSON."""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        if ObjectId.is_valid(str(v)):
            return str(v)
        raise ValueError(f"Invalid ObjectId: {v}")


# ── Category ─────────────────────────────────────────────────────────────────

class CategoryCreate(BaseModel):
    id: str               # e.g. "mouse" — used as filter key in frontend
    label: str            # e.g. "Mice" — shown in UI


class CategoryOut(CategoryCreate):
    pass                  # same shape, no extra fields needed yet


# ── Product ───────────────────────────────────────────────────────────────────

class SpecsDict(BaseModel):
    """
    Flexible key-value specs.
    Laptops: cpu, ram, storage, display, battery, os
    Accessories: connectivity, dpi, battery, etc.
    Stored as a plain dict — no fixed schema needed.
    """
    model_config = {"extra": "allow"}


class ProductCreate(BaseModel):
    """
    Sent by the admin upload form.
    Images are handled separately as UploadFile — not part of this model.
    """
    name:                str
    slug:                str                  # auto-generated from name, editable
    category:            str                  # "laptop" | "mouse" | "keyboard" | ...
    tier:                str                  # "premium" | "mid-range" | "budget"
    price_ugx:           int
    original_price_ugx:  Optional[int] = None # None → no strikethrough on frontend
    stock:               int
    tags:                list[str] = []       # ["Quick Sale", "Great Value", ...]
    short_description:   str                  # shown on product cards
    description:         str                  # shown in product detail modal
    specs:               dict[str, str] = {}  # key-value pairs
    active:              bool = True          # False = draft, won't show in store

    @field_validator("slug")
    @classmethod
    def slugify(cls, v: str) -> str:
        import re
        return re.sub(r"[^a-z0-9-]", "", v.lower().replace(" ", "-"))

    @field_validator("tier")
    @classmethod
    def valid_tier(cls, v: str) -> str:
        allowed = {"premium", "mid-range", "budget"}
        if v not in allowed:
            raise ValueError(f"tier must be one of {allowed}")
        return v

    @field_validator("price_ugx", "stock")
    @classmethod
    def positive(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Must be >= 0")
        return v


class ProductUpdate(BaseModel):
    """
    PATCH body — every field optional.
    Only provided fields are updated in MongoDB ($set).
    """
    name:                Optional[str]        = None
    slug:                Optional[str]        = None
    category:            Optional[str]        = None
    tier:                Optional[str]        = None
    price_ugx:           Optional[int]        = None
    original_price_ugx:  Optional[int]        = None
    stock:               Optional[int]        = None
    tags:                Optional[list[str]]  = None
    short_description:   Optional[str]        = None
    description:         Optional[str]        = None
    specs:               Optional[dict[str, str]] = None
    active:              Optional[bool]       = None
    # images handled separately via /products/:id/images endpoints


class ProductInDB(ProductCreate):
    """Stored in MongoDB — adds id and timestamps."""
    id:         str = Field(alias="_id")
    images:     list[str] = []   # R2 CDN URLs — populated after image upload
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True}


class ProductOut(BaseModel):
    """
    API response shape.
    Exactly matches the mock data in src/data/accessories.js
    so the frontend needs zero changes when switching from mock to real data.
    """
    id:                  str
    slug:                str
    name:                str
    category:            str
    tier:                str
    price_ugx:           int
    original_price_ugx:  Optional[int]
    stock:               int
    tags:                list[str]
    images:              list[str]
    short_description:   str
    description:         str
    specs:               dict[str, str]
    active:              bool
    created_at:          datetime
    updated_at:          datetime

    @classmethod
    def from_db(cls, doc: dict) -> "ProductOut":
        """Convert raw MongoDB document to API response."""
        doc["id"] = str(doc.pop("_id"))
        return cls(**doc)


# ── Bulk action payload ───────────────────────────────────────────────────────

class BulkActionPayload(BaseModel):
    ids:    list[str]
    action: str   # "activate" | "deactivate" | "delete"

    @field_validator("action")
    @classmethod
    def valid_action(cls, v: str) -> str:
        allowed = {"activate", "deactivate", "delete"}
        if v not in allowed:
            raise ValueError(f"action must be one of {allowed}")
        return v


# ── Stock-only patch (inline edit in ProductsTable) ───────────────────────────

class StockPatch(BaseModel):
    stock: int

    @field_validator("stock")
    @classmethod
    def non_negative(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Stock cannot be negative")
        return v


# ── Paginated list response ───────────────────────────────────────────────────

class ProductListOut(BaseModel):
    items:   list[ProductOut]
    total:   int
    page:    int
    limit:   int
    pages:   int


# ── Customer accounts ──────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email:    str
    password: str
    name:     str
    whatsapp: Optional[str] = None

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()


class UserLogin(BaseModel):
    email:    str
    password: str


class GoogleAuthIn(BaseModel):
    access_token: str  # Supabase session access_token, verified server-side


class UserUpdate(BaseModel):
    name:              Optional[str] = None
    whatsapp:          Optional[str] = None
    delivery_address:  Optional[str] = None


class UserOut(BaseModel):
    id:                str
    email:             str
    name:              str
    whatsapp:          Optional[str] = None
    delivery_address:  Optional[str] = None
    auth_provider:     str = "password"
    created_at:        datetime
    updated_at:        datetime

    @classmethod
    def from_db(cls, doc: dict) -> "UserOut":
        """Convert raw MongoDB document to API response — never leaks password_hash."""
        doc = dict(doc)
        doc["id"] = str(doc.pop("_id"))
        doc.pop("password_hash", None)
        doc.pop("google_sub", None)
        return cls(**doc)


class CustomerTokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    expires_in:   int


class UserListOut(BaseModel):
    items:  list[UserOut]
    total:  int
    page:   int
    limit:  int
    pages:  int


# ── Orders ───────────────────────────────────────────────────────────────────

ORDER_STATUSES = {"pending", "confirmed", "packed", "shipped", "delivered", "cancelled"}


class OrderItemIn(BaseModel):
    product_id: str
    quantity:   int

    @field_validator("quantity")
    @classmethod
    def positive(cls, v: int) -> int:
        if v < 1:
            raise ValueError("quantity must be >= 1")
        return v


class CustomerInfo(BaseModel):
    name:      str
    whatsapp:  str
    email:     str
    address:   str
    notes:     Optional[str] = None
    user_id:   Optional[str] = None


class OrderCreate(BaseModel):
    customer: CustomerInfo
    items:    list[OrderItemIn]

    @field_validator("items")
    @classmethod
    def non_empty(cls, v: list) -> list:
        if not v:
            raise ValueError("Cart cannot be empty")
        return v


class OrderStatusPatch(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def valid_status(cls, v: str) -> str:
        if v not in ORDER_STATUSES:
            raise ValueError(f"status must be one of {ORDER_STATUSES}")
        return v


class OrderItemOut(BaseModel):
    product_id:    str
    slug:          str
    name:          str
    price_ugx:     int
    quantity:      int
    subtotal_ugx:  int


class OrderStatusEvent(BaseModel):
    status: str
    at:     datetime
    by:     str


class OrderOut(BaseModel):
    id:              str
    order_number:    str
    customer:        CustomerInfo
    items:           list[OrderItemOut]
    total_ugx:       int
    status:          str
    status_history:  list[OrderStatusEvent]
    created_at:      datetime
    updated_at:      datetime

    @classmethod
    def from_db(cls, doc: dict) -> "OrderOut":
        doc = dict(doc)
        doc["id"] = str(doc.pop("_id"))
        doc.pop("stock_decremented", None)
        return cls(**doc)


class OrderListOut(BaseModel):
    items:  list[OrderOut]
    total:  int
    page:   int
    limit:  int
    pages:  int


# ── Store settings — bundle deals popup ───────────────────────────────────────

class BundleItemSpec(BaseModel):
    name:   str
    detail: str


class BundleDeal(BaseModel):
    id:                  str
    tag:                 str
    headline:            str
    subline:             str
    emoji:               str
    accent_color:        str
    accent_text:         str
    bg_color:            str
    items:               list[BundleItemSpec]
    freebie:             str
    original_price_ugx:  int
    bundle_price_ugx:    int
    wa_message:          str


class BundleDealsSettings(BaseModel):
    """Admin-editable config for BundleDealsPopup. If no document has been
    saved yet, the frontend falls back to its own hardcoded defaults —
    this model's own defaults (disabled, no bundles) only describe the
    "nothing configured yet" API response, not what the popup shows."""
    enabled:        bool = False
    countdown_secs: int = 5
    bundles:        list[BundleDeal] = []