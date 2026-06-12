"""
routers/categories.py — category management
────────────────────────────────────────────
Categories drive the filter pills in both the store and admin table.
Stored in a separate MongoDB collection so admin can add/rename without
a code deploy.

Seeded on first startup if the collection is empty.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from catalog.database import get_db
from catalog.models import CategoryCreate, CategoryOut
from catalog.routers.admin_auth import get_admin_user

router = APIRouter(tags=["categories"])

DEFAULT_CATEGORIES = [
    {"id": "laptop",   "label": "Laptops"},
    {"id": "mouse",    "label": "Mice"},
    {"id": "keyboard", "label": "Keyboards"},
    {"id": "charger",  "label": "Chargers"},
    {"id": "hub",      "label": "USB Hubs"},
    {"id": "bag",      "label": "Laptop Bags"},
]


@router.get("/categories", response_model=list[CategoryOut])
async def list_categories(db=Depends(get_db)):
    """Public endpoint — used by store filter pills and admin upload form."""
    count = await db.categories.count_documents({})
    if count == 0:
        await db.categories.insert_many(DEFAULT_CATEGORIES)
    docs = await db.categories.find({}).sort("label", 1).to_list(None)
    return [CategoryOut(**d) for d in docs]


@router.post(
    "/admin/categories",
    response_model=CategoryOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_category(
    body:  CategoryCreate,
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    if await db.categories.find_one({"id": body.id}):
        raise HTTPException(409, f"Category '{body.id}' already exists")
    await db.categories.insert_one(body.model_dump())
    return CategoryOut(**body.model_dump())


@router.patch("/admin/categories/{category_id}", response_model=CategoryOut)
async def update_category(
    category_id: str,
    body: CategoryCreate,
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    doc = await db.categories.find_one({"id": category_id})
    if not doc:
        raise HTTPException(404, "Category not found")
    await db.categories.update_one({"id": category_id}, {"$set": body.model_dump()})
    return CategoryOut(**body.model_dump())


@router.delete("/admin/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: str,
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    doc = await db.categories.find_one({"id": category_id})
    if not doc:
        raise HTTPException(404, "Category not found")
    await db.categories.delete_one({"id": category_id})