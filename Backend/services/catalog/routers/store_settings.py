"""
routers/store_settings.py
──────────────────────────────────────────────────────────────────
Admin-editable store configuration — currently just the bundle-deals
popup. Stored as a single document (_id: "bundle_deals") rather than
one document per setting, since there's only one settings area today;
add more _id keys here if more settings areas show up later.

The public GET returns enabled=False/bundles=[] when nothing has been
saved yet — BundleDealsPopup.jsx treats that as "no admin override",
not "hide the popup", and falls back to its own hardcoded defaults so
shipping this doesn't silently disable the popup for existing visitors.
──────────────────────────────────────────────────────────────────
"""

from fastapi import APIRouter, Depends  # type: ignore

from catalog.database import get_db
from catalog.models import BundleDealsSettings
from catalog.routers.admin_auth import get_admin_user

router = APIRouter(tags=["store-settings"])
admin_router = APIRouter(prefix="/admin", tags=["store-settings"])

SETTINGS_ID = "bundle_deals"


@router.get("/settings/bundle-deals", response_model=BundleDealsSettings)
async def get_bundle_deals(db=Depends(get_db)):
    doc = await db.settings.find_one({"_id": SETTINGS_ID})
    if not doc:
        return BundleDealsSettings()
    doc.pop("_id", None)
    return BundleDealsSettings(**doc)


@admin_router.put("/settings/bundle-deals", response_model=BundleDealsSettings)
async def update_bundle_deals(
    body: BundleDealsSettings,
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    await db.settings.update_one(
        {"_id": SETTINGS_ID}, {"$set": body.model_dump()}, upsert=True,
    )
    return body
