"""
routers/products.py — full CRUD for catalog products
─────────────────────────────────────────────────────────────────────
Public endpoints  (no auth):
  GET  /products            list with search + filter + pagination
  GET  /products/:slug      single product

Admin endpoints  (JWT required):
  POST   /admin/products           create + upload images
  PATCH  /admin/products/:id       update any field
  PATCH  /admin/products/:id/stock stock-only update (inline table edit)
  DELETE /admin/products/:id       soft delete (sets active=False)
  POST   /admin/products/bulk      bulk activate / deactivate / delete
  POST   /admin/products/:id/images  add more images
  DELETE /admin/products/:id/images/:filename  remove one image
─────────────────────────────────────────────────────────────────────
"""

import json
import math
from typing import Optional

from bson import ObjectId
from fastapi import (
    APIRouter, Depends, File, Form, HTTPException,
    Query, UploadFile, status,
)
from datetime import datetime

from catalog.database import get_db
from catalog.models import (
    BulkActionPayload, ProductCreate, ProductListOut,
    ProductOut, ProductUpdate, StockPatch,
)
from catalog.routers.admin_auth import get_admin_user
from catalog.storage import delete_product_images, store_product_images

router = APIRouter(tags=["products"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGES_PER_PRODUCT = 6
MAX_IMAGE_SIZE_MB = 15


# ─────────────────────────────────────────────────────────────────────────────
#  Public endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/products", response_model=ProductListOut)
async def list_products(
    search:   str            = Query("",    description="Search name + description"),
    category: Optional[str] = Query(None,  description="Filter by category slug"),
    tier:     Optional[str] = Query(None,  description="premium | mid-range | budget"),
    active:   bool           = Query(True,  description="False = include drafts (admin only)"),
    page:     int            = Query(1,    ge=1),
    limit:    int            = Query(20,   ge=1, le=100),
    db=Depends(get_db),
):
    """
    Product listing used by both the public store and the admin table.
    Admin panel passes active=False to see drafts.
    """
    query: dict = {}

    # Public store always sees only active products
    query["active"] = active

    if category:
        query["category"] = category

    if tier:
        query["tier"] = tier

    if search.strip():
        query["$text"] = {"$search": search.strip()}

    skip  = (page - 1) * limit
    total = await db.products.count_documents(query)
    pages = math.ceil(total / limit) if total else 1

    cursor = (
        db.products.find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )
    docs = await cursor.to_list(limit)

    return ProductListOut(
        items=[ProductOut.from_db(d) for d in docs],
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )


@router.get("/products/{slug}", response_model=ProductOut)
async def get_product(slug: str, db=Depends(get_db)):
    doc = await db.products.find_one({"slug": slug, "active": True})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductOut.from_db(doc)


# ─────────────────────────────────────────────────────────────────────────────
#  Admin endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.post(
    "/admin/products",
    response_model=ProductOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_product(
    # ── Form fields ──────────────────────────────────────────────────
    # FastAPI can't receive both UploadFile[] and a JSON body in one request.
    # Solution: send complex fields (specs, tags) as JSON strings in form data.
    name:               str            = Form(...),
    slug:               str            = Form(...),
    category:           str            = Form(...),
    tier:               str            = Form(...),
    price_ugx:          int            = Form(...),
    original_price_ugx: Optional[int]  = Form(None),
    stock:              int            = Form(...),
    short_description:  str            = Form(...),
    description:        str            = Form(...),
    specs_json:         str            = Form("{}"),     # JSON string
    tags_json:          str            = Form("[]"),     # JSON string
    active:             bool           = Form(True),
    # ── Files ────────────────────────────────────────────────────────
    images: list[UploadFile] = File(default=[]),
    # ── Auth ─────────────────────────────────────────────────────────
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    # Validate and parse JSON fields
    try:
        specs = json.loads(specs_json)
        tags  = json.loads(tags_json)
    except json.JSONDecodeError as e:
        raise HTTPException(422, f"Invalid JSON in specs/tags: {e}")

    # Build validated product data
    product_data = ProductCreate(
        name=name, slug=slug, category=category, tier=tier,
        price_ugx=price_ugx, original_price_ugx=original_price_ugx,
        stock=stock, short_description=short_description,
        description=description, specs=specs, tags=tags, active=active,
    )

    # Check slug uniqueness
    if await db.products.find_one({"slug": product_data.slug}):
        raise HTTPException(409, f"Slug '{product_data.slug}' already exists")

    # Upload images to R2
    image_urls: list[str] = []
    if images:
        _validate_images(images)
        raw_files = [(await f.read(), f.filename) for f in images]
        results   = await store_product_images(raw_files, product_data.slug)
        image_urls = [r["url"] for r in results]

    # Write to MongoDB
    now = datetime.utcnow()
    doc = {
        **product_data.model_dump(),
        "images":     image_urls,
        "created_at": now,
        "updated_at": now,
    }
    result = await db.products.insert_one(doc)
    created = await db.products.find_one({"_id": result.inserted_id})
    return ProductOut.from_db(created)


@router.patch("/admin/products/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: str,
    body:       ProductUpdate,
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    """Update any product fields. Images managed via separate endpoint."""
    doc = await _get_by_id(product_id, db)

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        return ProductOut.from_db(doc)

    updates["updated_at"] = datetime.utcnow()
    await db.products.update_one(
        {"_id": doc["_id"]},
        {"$set": updates},
    )
    updated = await db.products.find_one({"_id": doc["_id"]})
    return ProductOut.from_db(updated)


@router.patch("/admin/products/{product_id}/stock", response_model=ProductOut)
async def patch_stock(
    product_id: str,
    body:       StockPatch,
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    """Inline stock edit from the admin products table — updates only stock."""
    doc = await _get_by_id(product_id, db)
    await db.products.update_one(
        {"_id": doc["_id"]},
        {"$set": {"stock": body.stock, "updated_at": datetime.utcnow()}},
    )
    updated = await db.products.find_one({"_id": doc["_id"]})
    return ProductOut.from_db(updated)


@router.delete("/admin/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    hard:       bool = Query(False, description="True = permanent delete + remove images from R2"),
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    """
    Soft delete by default (sets active=False, product stays in DB).
    Pass hard=true for permanent removal (also purges images from R2).
    """
    doc = await _get_by_id(product_id, db)

    if hard:
        # Extract filenames from R2 URLs and delete
        filenames = [url.rsplit("/", 1)[-1] for url in doc.get("images", [])]
        if filenames:
            await delete_product_images(filenames)
        await db.products.delete_one({"_id": doc["_id"]})
    else:
        await db.products.update_one(
            {"_id": doc["_id"]},
            {"$set": {"active": False, "updated_at": datetime.utcnow()}},
        )


@router.post("/admin/products/bulk", status_code=status.HTTP_200_OK)
async def bulk_action(
    body: BulkActionPayload,
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    """Activate, deactivate, or delete multiple products at once."""
    object_ids = [ObjectId(i) for i in body.ids if ObjectId.is_valid(i)]
    if not object_ids:
        raise HTTPException(422, "No valid product IDs provided")

    if body.action == "activate":
        result = await db.products.update_many(
            {"_id": {"$in": object_ids}},
            {"$set": {"active": True, "updated_at": datetime.utcnow()}},
        )
        return {"modified": result.modified_count}

    if body.action == "deactivate":
        result = await db.products.update_many(
            {"_id": {"$in": object_ids}},
            {"$set": {"active": False, "updated_at": datetime.utcnow()}},
        )
        return {"modified": result.modified_count}

    if body.action == "delete":
        # Get all images before deleting
        docs = await db.products.find({"_id": {"$in": object_ids}}).to_list(None)
        all_filenames = []
        for doc in docs:
            all_filenames += [url.rsplit("/", 1)[-1] for url in doc.get("images", [])]
        if all_filenames:
            await delete_product_images(all_filenames)
        result = await db.products.delete_many({"_id": {"$in": object_ids}})
        return {"deleted": result.deleted_count}


@router.post("/admin/products/{product_id}/images", response_model=ProductOut)
async def add_images(
    product_id: str,
    images: list[UploadFile] = File(...),
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    """Add images to an existing product (e.g. during edit)."""
    doc = await _get_by_id(product_id, db)
    existing_count = len(doc.get("images", []))

    if existing_count + len(images) > MAX_IMAGES_PER_PRODUCT:
        raise HTTPException(
            422,
            f"Product already has {existing_count} images. "
            f"Max {MAX_IMAGES_PER_PRODUCT} per product.",
        )

    _validate_images(images)
    slug      = doc["slug"]
    raw_files = [(await f.read(), f.filename) for f in images]
    results   = await store_product_images(raw_files, slug)
    new_urls  = [r["url"] for r in results]

    await db.products.update_one(
        {"_id": doc["_id"]},
        {
            "$push":  {"images": {"$each": new_urls}},
            "$set":   {"updated_at": datetime.utcnow()},
        },
    )
    updated = await db.products.find_one({"_id": doc["_id"]})
    return ProductOut.from_db(updated)


@router.delete(
    "/admin/products/{product_id}/images/{filename}",
    response_model=ProductOut,
)
async def remove_image(
    product_id: str,
    filename:   str,
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    """Remove a specific image from a product and delete it from R2."""
    doc = await _get_by_id(product_id, db)

    # Find and remove the URL that ends with this filename
    images     = doc.get("images", [])
    to_remove  = [url for url in images if url.endswith(filename)]
    if not to_remove:
        raise HTTPException(404, f"Image '{filename}' not found on this product")

    from catalog.storage import delete_from_r2
    await delete_from_r2(filename)

    await db.products.update_one(
        {"_id": doc["_id"]},
        {
            "$pull": {"images": {"$in": to_remove}},
            "$set":  {"updated_at": datetime.utcnow()},
        },
    )
    updated = await db.products.find_one({"_id": doc["_id"]})
    return ProductOut.from_db(updated)


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _get_by_id(product_id: str, db) -> dict:
    if not ObjectId.is_valid(product_id):
        raise HTTPException(422, "Invalid product ID format")
    doc = await db.products.find_one({"_id": ObjectId(product_id)})
    if not doc:
        raise HTTPException(404, "Product not found")
    return doc


def _validate_images(images: list[UploadFile]) -> None:
    for img in images:
        if img.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                422,
                f"File '{img.filename}' has unsupported type '{img.content_type}'. "
                f"Allowed: {', '.join(ALLOWED_IMAGE_TYPES)}",
            )