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
from bson import ObjectId
from pydantic import BaseModel, Field, field_validator


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