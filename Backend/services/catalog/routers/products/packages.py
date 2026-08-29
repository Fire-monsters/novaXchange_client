"""
routers/packages.py — image slideshow for the homepage Solutions packages
─────────────────────────────────────────────────────────────────────
The four service "packages" (novaUpgrade, novaBoost, novaAccessories,
novaWorkspace) are a fixed set defined in the frontend (Solutions.jsx) —
title, description, features, icon, etc. all stay hardcoded there. This
router only manages the *images* an admin can upload per package, so the
frontend can show a slideshow instead of one static image.

Public:
  GET  /packages/images                                every package's images, keyed by id

Admin (JWT required):
  POST   /admin/packages/{package_id}/images            upload (appends)
  DELETE /admin/packages/{package_id}/images/{filename}  remove one
  PATCH  /admin/packages/{package_id}/images/order       persist a reordered list
─────────────────────────────────────────────────────────────────────
"""

import logging
from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status  # type: ignore

from catalog.database import get_db
from catalog.models import PACKAGE_IDS, PackageImageOrderPatch, PackageImagesOut
from catalog.routers.auth.admin import get_admin_user
from catalog.storage import (
    ImageStorageError, delete_from_r2, delete_package_images, store_package_images,
)

router = APIRouter(tags=["packages"])
logger = logging.getLogger("catalog.packages")

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGES_PER_PACKAGE = 6


def _validate_package_id(package_id: str) -> None:
    if package_id not in PACKAGE_IDS:
        raise HTTPException(422, f"Unknown package id '{package_id}'. Expected one of {sorted(PACKAGE_IDS)}")


def _validate_images(images: list[UploadFile]) -> None:
    for img in images:
        if img.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                422,
                f"File '{img.filename}' has unsupported type '{img.content_type}'. "
                f"Allowed: {', '.join(ALLOWED_IMAGE_TYPES)}",
            )


# ─────────────────────────────────────────────────────────────────────────────
#  Public
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/packages/images", response_model=dict[str, list[str]])
async def list_package_images(db=Depends(get_db)):
    """Every package's images, keyed by package id. Missing/empty means the
    frontend should fall back to its own hardcoded static image."""
    docs = await db.package_images.find({}).to_list(None)
    return {doc["_id"]: doc.get("images", []) for doc in docs}


# ─────────────────────────────────────────────────────────────────────────────
#  Admin
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/admin/packages/{package_id}/images", response_model=PackageImagesOut)
async def add_package_images(
    package_id: str,
    images: list[UploadFile] = File(...),
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    _validate_package_id(package_id)
    doc = await db.package_images.find_one({"_id": package_id})
    existing_count = len(doc.get("images", [])) if doc else 0

    if existing_count + len(images) > MAX_IMAGES_PER_PACKAGE:
        raise HTTPException(
            422,
            f"Package already has {existing_count} images. "
            f"Max {MAX_IMAGES_PER_PACKAGE} per package.",
        )

    _validate_images(images)
    raw_files = [(await f.read(), f.filename) for f in images]
    try:
        results = await store_package_images(raw_files, package_id)
    except ImageStorageError as e:
        logger.error("Adding images to package '%s' failed: %s", package_id, e)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Image upload failed: {e}",
        ) from e
    new_urls = [r["url"] for r in results]

    now = datetime.utcnow()
    await db.package_images.update_one(
        {"_id": package_id},
        {
            "$push": {"images": {"$each": new_urls}},
            "$set":  {"updated_at": now},
            "$setOnInsert": {"created_at": now},
        },
        upsert=True,
    )
    updated = await db.package_images.find_one({"_id": package_id})
    return PackageImagesOut(package_id=package_id, images=updated.get("images", []))


@router.delete(
    "/admin/packages/{package_id}/images/{filename}",
    response_model=PackageImagesOut,
)
async def remove_package_image(
    package_id: str,
    filename: str,
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    _validate_package_id(package_id)
    doc = await db.package_images.find_one({"_id": package_id})
    images = doc.get("images", []) if doc else []
    to_remove = [url for url in images if url.endswith(filename)]
    if not to_remove:
        raise HTTPException(404, f"Image '{filename}' not found on package '{package_id}'")

    try:
        await delete_package_images([filename])
    except ImageStorageError as e:
        logger.error("Removing image '%s' from package '%s' failed: %s", filename, package_id, e)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Could not remove image from storage: {e}",
        ) from e

    await db.package_images.update_one(
        {"_id": package_id},
        {"$pull": {"images": {"$in": to_remove}}, "$set": {"updated_at": datetime.utcnow()}},
    )
    updated = await db.package_images.find_one({"_id": package_id})
    return PackageImagesOut(package_id=package_id, images=updated.get("images", []))


@router.patch("/admin/packages/{package_id}/images/order", response_model=PackageImagesOut)
async def reorder_package_images(
    package_id: str,
    body: PackageImageOrderPatch,
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    _validate_package_id(package_id)
    doc = await db.package_images.find_one({"_id": package_id})
    current = set(doc.get("images", [])) if doc else set()

    if set(body.images) != current:
        raise HTTPException(422, "Reordered list must contain exactly the current set of images")

    await db.package_images.update_one(
        {"_id": package_id},
        {"$set": {"images": body.images, "updated_at": datetime.utcnow()}},
    )
    return PackageImagesOut(package_id=package_id, images=body.images)
