"""
routers/orders.py — COD order lifecycle
─────────────────────────────────────────────────────────────────────────────
Public:
  POST /orders                     create order (guest or logged-in customer)
  GET  /orders/{order_number}      guest/customer lookup (requires ?contact=)

Customer (JWT required):
  GET  /account/orders             current customer's own orders

Admin (JWT required):
  GET    /admin/orders
  GET    /admin/orders/{order_id}
  PATCH  /admin/orders/{order_id}/status
─────────────────────────────────────────────────────────────────────────────
Prices and stock are always re-read from MongoDB at order-creation time —
the client-submitted cart only supplies product_id + quantity, never a
price. Stock is reserved (decremented) the moment an order is placed, not
on later admin confirmation, and restored exactly once if cancelled.
─────────────────────────────────────────────────────────────────────────────
"""

import logging
import math
from datetime import datetime

from bson import ObjectId  # pyright: ignore[reportMissingImports]
from fastapi import APIRouter, Depends, HTTPException, Query, status  # type: ignore
from pymongo import ReturnDocument  # type: ignore

from catalog.database import get_db
from catalog.notifications.emailer import (
    send_admin_new_order_alert,
    send_order_confirmation_email,
    send_order_status_email,
)
from catalog.models import OrderCreate, OrderListOut, OrderOut, OrderStatusPatch
from catalog.routers.auth.admin import get_admin_user
from catalog.routers.auth.customer import get_current_customer, get_optional_customer

router = APIRouter(tags=["orders"])
logger = logging.getLogger("catalog.orders")

ALLOWED_TRANSITIONS = {
    "pending":   {"confirmed", "cancelled"},
    "confirmed": {"packed", "cancelled"},
    "packed":    {"shipped", "cancelled"},
    "shipped":   {"delivered"},   # no cancel after dispatch — a post-dispatch
                                   # refusal is a return, out of scope here
    "delivered": set(),
    "cancelled": set(),
}


async def next_order_number(db) -> str:
    """Atomic, single-document counter — no multi-document transaction
    needed (the local Mongo is a standalone instance, no replica set)."""
    today = datetime.utcnow().strftime("%Y%m%d")
    doc = await db.order_counters.find_one_and_update(
        {"_id": today},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return f"NXC-{today}-{doc['seq']:04d}"


async def _reserve_stock(db, items_in: list) -> list[dict]:
    """
    Validates + atomically decrements stock for every cart line item.
    Returns order-ready item dicts with server-fetched price/name/slug —
    the client never supplies a price. Raises 422 (nothing mutated) if any
    product is missing/inactive/out of stock, or 409 (with the partial
    decrements from this request rolled back) if a concurrent checkout wins
    a stock race.
    """
    merged: dict[str, int] = {}
    for item in items_in:
        merged[item.product_id] = merged.get(item.product_id, 0) + item.quantity

    invalid_ids = [pid for pid in merged if not ObjectId.is_valid(pid)]
    if invalid_ids:
        raise HTTPException(422, f"Invalid product id(s): {', '.join(invalid_ids)}")

    object_ids = [ObjectId(pid) for pid in merged]
    docs = await db.products.find({"_id": {"$in": object_ids}}).to_list(None)
    by_id = {str(d["_id"]): d for d in docs}

    problems = []
    for pid, qty in merged.items():
        product = by_id.get(pid)
        if not product:
            problems.append(f"Product {pid} no longer exists")
        elif not product.get("active", True):
            problems.append(f"'{product['name']}' is no longer available")
        elif product["stock"] < qty:
            problems.append(f"Only {product['stock']} left of '{product['name']}'")
    if problems:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "; ".join(problems))

    decremented: list[tuple] = []
    order_items = []
    try:
        for pid, qty in merged.items():
            oid = ObjectId(pid)
            result = await db.products.update_one(
                {"_id": oid, "active": True, "stock": {"$gte": qty}},
                {"$inc": {"stock": -qty}},
            )
            if result.modified_count == 0:
                product = by_id[pid]
                raise HTTPException(
                    status.HTTP_409_CONFLICT,
                    f"Stock for '{product['name']}' changed, please review your cart",
                )
            decremented.append((oid, qty))
            product = by_id[pid]
            order_items.append({
                "product_id": pid,
                "slug": product["slug"],
                "name": product["name"],
                "price_ugx": product["price_ugx"],
                "quantity": qty,
                "subtotal_ugx": product["price_ugx"] * qty,
            })
    except Exception:
        for oid, qty in decremented:
            await db.products.update_one({"_id": oid}, {"$inc": {"stock": qty}})
        raise

    return order_items


# ─────────────────────────────────────────────────────────────────────────────
#  Public / customer endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/orders", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(
    body: OrderCreate,
    customer: dict | None = Depends(get_optional_customer),
    db=Depends(get_db),
):
    """Guest checkout is the default path — no login required. If a valid
    customer token is present, the order is linked to that account."""
    order_items = await _reserve_stock(db, body.items)
    total_ugx = sum(i["subtotal_ugx"] for i in order_items)

    customer_info = body.customer.model_dump()
    if customer is not None:
        customer_info["user_id"] = customer["sub"]

    order_number = await next_order_number(db)
    now = datetime.utcnow()
    doc = {
        "order_number": order_number,
        "customer": customer_info,
        "items": order_items,
        "total_ugx": total_ugx,
        "status": "pending",
        "stock_decremented": True,
        "status_history": [{"status": "pending", "at": now, "by": "system"}],
        "created_at": now,
        "updated_at": now,
    }
    result = await db.orders.insert_one(doc)
    created = await db.orders.find_one({"_id": result.inserted_id})

    # Best-effort notifications — never let an email failure turn a
    # successful order into an error response.
    try:
        send_order_confirmation_email(created)
    except Exception as e:
        logger.error("Order confirmation email failed for %s: %s", order_number, e)
    try:
        send_admin_new_order_alert(created)
    except Exception as e:
        logger.error("Admin new-order alert failed for %s: %s", order_number, e)

    return OrderOut.from_db(created)


@router.get("/orders/{order_number}", response_model=OrderOut)
async def get_order(
    order_number: str,
    contact: str = Query(..., description="Email or WhatsApp number used at checkout"),
    db=Depends(get_db),
):
    """Guest-safe order lookup. Order numbers are sequential/enumerable, so
    a matching contact is required — otherwise this would leak order
    existence/contents to anyone who can guess a number."""
    order = await db.orders.find_one({"order_number": order_number})
    if not order:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")

    contact_norm = contact.strip().lower()
    match = (
        order["customer"]["email"].strip().lower() == contact_norm
        or order["customer"]["whatsapp"].strip().lower() == contact_norm
    )
    if not match:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")

    return OrderOut.from_db(order)


@router.get("/account/orders", response_model=list[OrderOut])
async def my_orders(
    customer=Depends(get_current_customer),
    db=Depends(get_db),
):
    docs = await db.orders.find({"customer.user_id": customer["sub"]}).sort("created_at", -1).to_list(None)
    return [OrderOut.from_db(d) for d in docs]


# ─────────────────────────────────────────────────────────────────────────────
#  Admin endpoints
# ─────────────────────────────────────────────────────────────────────────────

async def _get_order_by_id(order_id: str, db) -> dict:
    if not ObjectId.is_valid(order_id):
        raise HTTPException(422, "Invalid order ID format")
    doc = await db.orders.find_one({"_id": ObjectId(order_id)})
    if not doc:
        raise HTTPException(404, "Order not found")
    return doc


@router.get("/admin/orders", response_model=OrderListOut)
async def list_orders(
    status_filter: str | None = Query(None, alias="status"),
    search: str = Query(""),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    query: dict = {}
    if status_filter:
        query["status"] = status_filter
    if search.strip():
        q = search.strip()
        query["$or"] = [
            {"order_number": {"$regex": q, "$options": "i"}},
            {"customer.name": {"$regex": q, "$options": "i"}},
            {"customer.whatsapp": {"$regex": q, "$options": "i"}},
            {"customer.email": {"$regex": q, "$options": "i"}},
        ]

    skip = (page - 1) * limit
    total = await db.orders.count_documents(query)
    pages = math.ceil(total / limit) if total else 1
    cursor = db.orders.find(query).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(limit)

    return OrderListOut(
        items=[OrderOut.from_db(d) for d in docs],
        total=total, page=page, limit=limit, pages=pages,
    )


@router.get("/admin/orders/{order_id}", response_model=OrderOut)
async def get_order_admin(order_id: str, admin=Depends(get_admin_user), db=Depends(get_db)):
    doc = await _get_order_by_id(order_id, db)
    return OrderOut.from_db(doc)


@router.patch("/admin/orders/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: str,
    body: OrderStatusPatch,
    admin=Depends(get_admin_user),
    db=Depends(get_db),
):
    doc = await _get_order_by_id(order_id, db)
    current, new_status = doc["status"], body.status

    if new_status == current:
        return OrderOut.from_db(doc)

    if new_status not in ALLOWED_TRANSITIONS.get(current, set()):
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            f"Cannot transition order from '{current}' to '{new_status}'",
        )

    now = datetime.utcnow()
    update_fields = {"status": new_status, "updated_at": now}

    if new_status == "cancelled" and doc.get("stock_decremented"):
        for item in doc["items"]:
            if ObjectId.is_valid(item["product_id"]):
                try:
                    await db.products.update_one(
                        {"_id": ObjectId(item["product_id"])},
                        {"$inc": {"stock": item["quantity"]}},
                    )
                except Exception as e:
                    logger.warning("Could not restore stock for product %s: %s", item["product_id"], e)
        update_fields["stock_decremented"] = False

    await db.orders.update_one(
        {"_id": doc["_id"]},
        {
            "$set": update_fields,
            "$push": {"status_history": {"status": new_status, "at": now, "by": admin["email"]}},
        },
    )
    updated = await db.orders.find_one({"_id": doc["_id"]})

    try:
        send_order_status_email(updated, new_status)
    except Exception as e:
        logger.error("Order status email failed for %s (%s): %s", updated["order_number"], new_status, e)

    return OrderOut.from_db(updated)
