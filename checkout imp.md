Here’s a practical engineering plan tailored to your current setup: client-side cart in `CartContext`, WhatsApp checkout in `CartDrawer` on `AccessoriesPage`, and a FastAPI catalog service with MongoDB and stock tracking — but no orders or payments layer yet.

---

## Where you are today

|Layer|Status|
|---|---|
|Cart|Client-only (`sessionStorage`), prices computed in browser|
|Checkout|Opens `wa.me` with a pre-filled cart message|
|Catalog API|Products, stock, admin auth — done|
|Orders / payments|Not built (admin has an Orders nav item, but no route or backend)|

The main shift: checkout must become server-authoritative (prices, stock, order state) with a payment provider handling money collection.

---

## Phase 0 — Decisions before you write code

### 1. Choose a payment provider (Uganda / UGX)

For novaXchange in Uganda, the realistic options are:

|Provider|Strengths|Notes|
|---|---|---|
|Flutterwave|Mobile Money (MTN/Airtel), cards, UGX|Widely used in East Africa|
|Pesapal|Strong in Uganda/Kenya, M-Pesa, cards|Good local support|
|Paystack|Clean API, cards|Mobile Money support varies by country|

Recommendation: Start with one provider that supports MTN Mobile Money + Airtel Money + cards in UGX. Don’t build a multi-provider abstraction on day one.

### 2. Checkout model: guest vs account
Your `CartContext` comment already points at future auth. For v1:

- Guest checkout — name, phone, email, delivery location (you already collect location on `AccessoriesPage)
- Optional account later — merge cart into user session

Guest checkout is faster to ship and fits your current architecture.

### 3. Fulfillment model

Decide what “paid” means operationally:

- Pay → confirm order → manual delivery (likely v1)
- Or pay → auto-reserve stock → dispatch

This drives webhook handling and admin workflows.

### 4. Service boundary

Don’t bolt payments onto the catalog service. Add a separate Orders service (same FastAPI + MongoDB pattern):

Frontend

├── Catalog API (products, categories) ← exists
└── Orders API (checkout, orders, webhooks) ← new

Nginx routes something like:

- `/api/catalog/*` → catalog service
- `/api/orders/*` → orders service

Keeps payment secrets and order logic isolated from product CRUD.

---

## Phase 1 — Data model (MongoDB)

### Orders collection

Each order should store a snapshot of what was bought — not live product references alone.

orders
├── _id
├── order_number          # human-readable, e.g. NXC-20260713-0042
├── status                # pending_payment | paid | failed | cancelled | fulfilled
├── customer
│   ├── name
│   ├── phone
│   ├── email (optional)
│   └── delivery_location
├── items[]               # snapshot at checkout time
│   ├── product_id
│   ├── slug, name
│   ├── quantity
│   ├── unit_price_ugx    # from DB, not client
│   └── line_total_ugx
├── subtotal_ugx
├── delivery_fee_ugx      # optional, v2
├── total_ugx
├── payment
│   ├── provider          # momo and airtel money
│   ├── reference         # your internal ref sent to provider
│   ├── provider_tx_id    # from webhook
│   ├── method            # mobile_money | card
│   └── paid_at
├── stock_reserved        # bool
├── created_at / updated_at
└── idempotency_key       # prevent duplicate orders on retry
### Why snapshot items?

If an admin changes `price_ugx` or deletes a product, historical orders stay correct.

### Optional: `payment_attempts` collection

Useful for debugging failed payments without polluting the main orders collection.

---

## Phase 2 — Backend: Orders service

### Endpoints to design

|Endpoint|Purpose|
|---|---|
|`POST /checkout`|Validate cart, create `pending_payment` order, init payment with provider|
|`GET /orders/:id`|Customer polls status after redirect (or use order number + phone)|
|`POST /webhooks/payments`|Provider confirms payment — source of truth|
|`GET /admin/orders`|Admin list (reuse JWT from catalog or shared auth)|
|`PATCH /admin/orders/:id`|Mark fulfilled, cancel, etc.|

### `POST /checkout` flow (critical path)
![[post checkout.png]]


### Rules you must enforce server-side

1. Never trust client prices — re-fetch `price_ugx` from MongoDB by `product_id`.
2. Validate stock before creating the order (`quantity <= stock`).
3. Reject inactive products.
4. Idempotency — same `idempotency_key` within ~15 minutes returns the existing order, not a duplicate.
5. Webhook signature verification — reject unsigned or tampered webhooks.
6. Amount match — webhook amount must equal `order.total_ugx`.

### Stock strategy (pick one)

|Approach|Pros|Cons|
|---|---|---|
|Decrement on payment success (recommended v1)|Simple, no stale reservations|Rare race if two users buy last item|
|Reserve on checkout, release on timeout|Safer inventory|Needs a cron/timeout job|
For low-volume v1, decrement on successful webhook is usually enough. Add optimistic locking (`stock: { $gte: qty }`) when updating.


## Phase 3 — Payment provider integration
### What you’ll configure in the provider dashboard
- Business account / KYC
- Webhook URL: `https://novaxchange.xyz/api/orders/webhooks/flutterwave` (or similar)
- Redirect URL: `https://novaxchange.xyz/checkout/success?order=...`
- Cancel URL: `https://novaxchange.xyz/checkout/cancelled`
- API keys in server `.env` only — never in the React bundle

### Server env vars (example)
PAYMENT_PROVIDER=momo and airtel money
FLW_SECRET_KEY=...
FLW_WEBHOOK_SECRET=...
ORDERS_PUBLIC_URL=https://novaxchange.xyz

### Two integration patterns
1. Redirect checkout — user leaves your site, pays on provider page, returns to success URL. Easiest v1.
2. Embedded / inline — pay without leaving the site. Better UX, more PCI/compliance work.
Start with redirect.

### Webhook handling (non-negotiable)

- Verify signature
- Find order by `reference`
- If already `paid`, return 200 (idempotent)
- If success: set `paid`, decrement stock, optionally notify (email/WhatsApp to ops)
- If failed: set `failed`, do not touch stock

Never mark an order paid from the frontend redirect alone — users can close the tab or spoof URLs. Webhook (or server-side verify API call) is the truth.

---

## Phase 4 — Frontend changes

### Replace WhatsApp checkout in `CartDrawer`

Current behavior (`handleCheckout` → `wa.me`) becomes a multi-step flow:

1. Cart review (existing drawer)
2. Checkout form — name, phone, email, delivery location (pre-fill from your delivery banner)
3. Pay — call `POST /checkout`, redirect to `payment_url`
4. Success / failure pages — new routes, e.g. `/checkout/success`, `/checkout/cancelled`

### New frontend pieces

|Piece|Responsibility|
|---|---|
|`src/api/orders.js`|`createCheckout()`, `getOrderStatus()`|
|`CheckoutForm`|Customer details + validation|
|`CheckoutSuccessPage`|Poll order status or show confirmation|
|Update `CartDrawer`|"Pay now" instead of "Checkout via WhatsApp"|

### Cart context evolution

- Keep cart in `sessionStorage` for browsing
- On successful payment: `clearCart()`
- Optionally store `pending_order_id` until webhook confirms (for UX on success page)

### Keep WhatsApp as fallback (optional)

A secondary link — “Need help? Chat on WhatsApp” — without making it the payment path.

---

## Phase 5 — Admin: Orders page

You already have `/admin/orders` in nav but no page. Build:

- Table: order #, customer, total, status, date
- Filters: `pending_payment`, `paid`, `fulfilled`
- Detail view: line items, delivery info, payment reference
- Actions: mark fulfilled, cancel (with stock restore if paid)

Wire the route in `App.jsx` and add `getOrders()` to a new admin section of the orders API client.

---

## Phase 6 — Security & compliance

1. Secrets — payment keys only on the orders service
2. HTTPS everywhere in production
3. Rate limit `POST /checkout` (per IP / per phone)
4. Input validation — Pydantic models for customer + line items
5. CORS — orders API allows your frontend origin only
6. Logging — log payment refs and webhook events; never log full card data
7. Receipts — email or SMS after `paid` (v2)

---

## Phase 7 — Testing plan

|Layer|What to test|
|---|---|
|Unit|Price calculation, stock checks, status transitions|
|Integration|Checkout → mock webhook → stock decrement|
|Provider sandbox|Full redirect flow with test Mobile Money / card|
|Edge cases|Empty cart, out-of-stock, double webhook, expired payment link|
|E2E|Add to cart → pay in sandbox → success page → admin sees order|

Use the provider’s sandbox mode until you’re confident.

---

## Phase 8 — Suggested build order

1. Orders service scaffold — FastAPI, MongoDB, health check, CORS
2. Order model + `POST /checkout` — no payment yet; returns mock `payment_url`
3. Frontend checkout form + success page — wired to mock
4. Payment provider init — real redirect URLs
5. Webhooks + stock decrement
6. Admin orders UI
7. Hardening — idempotency, rate limits, emails
8. Deprecate WhatsApp checkout — or keep as support only

Ship in thin vertical slices so you can test end-to-end early.

---

## Architecture diagram (target state)
![[Architecture diagram.png]]

---

## Risks to plan for upfront

|Risk|Mitigation|
|---|---|
|User pays but webhook is delayed|Success page polls order status; show “confirming payment…”|
|Double charge on double-click|Disable pay button + idempotency key|
|Price changed while cart open|Server recalculates at checkout; show diff if needed|
|Last item race|Atomic stock update with `$gte` condition|
|Provider downtime|Clear error + WhatsApp fallback for manual orders|

---

## What you can defer

- User accounts / saved addresses
- Delivery fee calculation
- Refunds (provider dashboard manually at first)
- Invoices / PDF receipts
- Multi-currency

---

## Summary

You’re not just swapping a button — you’re adding an orders + payments pipeline where the server owns money and inventory, and the payment provider owns card/Mobile Money collection. The WhatsApp flow in `CartDrawer` is replaced by: collect customer details → server validates cart → redirect to pay → webhook confirms → clear cart → admin fulfills.

If you want to go deeper next, the highest-leverage follow-ups are: (1) pick Flutterwave vs Pesapal for your case, and (2) lock the exact checkout fields and order statuses for v1. I can help draft those specs or an implementation checklist per file when you’re ready to build.

**Part two**
Here’s an implementation plan that fits your stack: Airtel Money (direct API) for collections, user accounts for customer data, and a path to add MTN MoMo later without rewriting everything.

---

## Strategic framing

You’re building three capabilities that must work together:

|Capability|Purpose|
|---|---|
|Auth service|Register/login users, store profile + delivery details|
|Orders service|Server-side checkout, order lifecycle, stock|
|Payments adapter|Airtel USSD push today; MTN MoMo as a second adapter later|

Your admin auth in `admin_auth.py` is a good template: JWT + bcrypt + MongoDB. Customer auth should follow the same pattern but with `role: customer` and a separate service so admin and store users never share login endpoints.

---

## Part A — Airtel Money integration model

### How Airtel collection works (not a redirect checkout)

Unlike Flutterwave/Pesapal, Airtel’s Collection API uses USSD push:

1. Your server calls Airtel with the customer’s phone (`msisdn`) and amount.
2. The customer gets a prompt on their phone.
3. They enter their Airtel Money PIN on the device.
4. You confirm success by polling transaction status (and/or callbacks if Airtel provides them for your merchant tier).

There is no “leave site → pay on Airtel page → redirect back” flow. The UX is: “Check your phone and approve the payment.”
### Prerequisites (do this before coding)
1. Register at [Airtel Developer Portal](https://developers.airtel.africa/).
2. Create an app with Collection API enabled.
3. Complete KYC / merchant approval for production.
4. Obtain:
- `client_id` / `client_secret`
- RSA keys for request signing (`x-signature`, `x-key`)
- Staging credentials for UAT (`openapiuat.airtel.ug` or `.africa`)
1. Decide whether to use a library like `airtelmoney-py` (handles OAuth, signing, PIN encryption) or implement signing yourself. For v1, use the library.
### Payment adapter pattern (keeps MTN addable later)

payments/
├── base.py # PaymentProvider interface
├── airtel.py # Airtel collection + status enquiry
└── mtn.py # (Phase 2) MTN MoMo collections

Every provider implements the same contract:

|Method|Responsibility|
|---|---|
|`initiate_collection(order, msisdn)`|Trigger USSD push|
|`check_status(provider_tx_id)`|Poll until terminal state|
|`normalize_msisdn(phone)`|`+256752...` → `752...`|
Orders service only talks to the interface — not Airtel directly.
### Airtel checkout flow (end-to-end)
![[Airtel checkout flow (end-to-end).png]]

### Important Airtel-specific rules

1. MSISDN format — Airtel expects Uganda numbers without country code (e.g. `752604392`). Normalize on the server.
2. Amount in UGX — Integer only; server calculates from DB prices.
3. Unique transaction ID — Generate per payment attempt; store in `payment.provider_tx_id`.
4. Request signing — Required for write APIs; never do this from the frontend.
5. Timeouts — USSD push can expire if the user doesn’t respond. Order → `payment_failed` or `payment_expired`; allow retry.
6. Idempotency — Retrying checkout for the same order should not double-charge; use a new `transaction_id` only when explicitly “retry payment.”

### MTN MoMo (phase 2, same architecture)

MTN Mobile Money Uganda has a similar request-to-pay model. When you add it:
- Checkout UI: “Pay with Airtel Money” / “Pay with MTN MoMo”
- Same orders document; `payment.provider` = `airtel` | `mtn`
- Same polling pattern

Build Airtel first; abstract early so MTN is mostly a new adapter file.
## Part B — User accounts architecture

### Why phone-first accounts fit Uganda + Airtel

- Payment requires a mobile number anyway.
- Students often prefer phone over email.
- Profile phone should default to payment `msisdn` when logged in.

Primary identifier: verified phone number  
Secondary: email (optional), name, saved delivery locations

### Auth service vs extending admin auth
![[Auth service vs extending admin auth.png]]

Do not merge customer login into catalog or admin routes.

### Recommended v1 auth method: Phone + OTP

Better for your audience than password-only:

1. User enters phone → `POST /auth/otp/send`
2. User enters 6-digit code → `POST /auth/otp/verify` → JWT
3. First verify creates account; later verifies log in

Password can be added in v2 for users who want it.

SMS provider options: Africa's Talking, Twilio, or your telco. Pick one with Uganda delivery and a sandbox.

### User document (MongoDB `users`)

```
users
├── _id
├── phone                 # normalized, unique, e.g. "256752604392"
├── phone_verified        # true after OTP
├── name
├── email                 # optional
├── default_delivery
│   ├── location          # "Kampala, Makerere"
│   └── notes             # optional landmark
├── saved_addresses[]     # v2: multiple addresses
├── role                  # always "customer"
├── created_at
├── updated_at
└── last_login_at
```

### JWT payload (mirror admin pattern)
```
{
"sub": "<user_id>",
"role": "customer",
"phone": "256752604392",
"exp": ...
}
```

Reuse the same `jwt_secret` across services only if they share verification — or use a dedicated auth service that other services trust via `GET /auth/me`.

### Guest checkout vs logged-in checkout

Support both from day one:

|Mode|Checkout payload|Order document|
|---|---|---|
|Guest|`customer: { name, phone, delivery_location }`|`user_id: null`|
|Logged in|JWT; server fills customer from profile|`user_id: "<id>"`|

Post-purchase: “Create account to track this order” — match by phone if OTP verifies the same number.

### Cart + auth integration

Your `CartContext` comment already points here:

1. Guest: keep `sessionStorage` (current behavior).
2. Logged in: optionally sync cart to server (`user_carts` collection) for cross-device — defer to v2 if you want.
3. On login: merge guest cart into user cart (union by `product_id`, sum quantities).
4. On logout: keep guest cart in session or clear — your choice; merging on login is the important part.

---

## Part C — Service layout

```
Backend/services/
├── catalog/ # exists — products, categories, admin
├── auth/ # NEW — users, OTP, customer JWT
└── orders/ # NEW — checkout, orders, payment adapters
```

Nginx routing:

|Path|Service|
|---|---|
|`/api/catalog/*`|catalog :8001|
|`/api/auth/*`|auth :8002|
|`/api/orders/*`|orders :8003|
All three can share one MongoDB database (`novaxchange`) with different collections.
## Part D — Phased implementation plan

### Phase 0 — Setup (1–2 days, mostly external)

-  Airtel developer account + Collection API app
-  Staging credentials + test MSISDNs
-  SMS provider account for OTP (sandbox)
-  Env vars documented per service
-  Nginx routes planned for `/api/auth` and `/api/orders`

---

### Phase 1 — Auth service (Week 1)

Backend: `Backend/services/auth/`

|Step|Task|Deliverable|
|---|---|---|
|1.1|Scaffold FastAPI app (copy catalog structure)|`main.py`, `config.py`, `database.py`|
|1.2|`users` model + indexes (`phone` unique)|`models.py`|
|1.3|`POST /auth/otp/send` — rate limit, 6-digit code, 5 min TTL in Redis or Mongo `otp_codes`|OTP flow|
|1.4|`POST /auth/otp/verify` — create user if new, return JWT|Registration + login|
|1.5|`GET /auth/me` — return profile|Protected route|
|1.6|`PATCH /auth/me` — update name, email, default_delivery|Profile edit|
|1.7|`get_current_user()` dependency (`role === customer`)|Reusable guard|

Frontend: `src/`

|Step|Task|Deliverable|
|---|---|---|
|1.8|`src/api/auth.js` — `sendOtp`, `verifyOtp`, `getMe`, `updateProfile`|API client|
|1.9|`src/context/AuthContext.jsx` — token in `localStorage` (`nxc_user_token`)|Global auth state|
|1.10|`src/pages/LoginPage.jsx` — phone → OTP → logged in|`/login` route|
|1.11|`src/pages/AccountPage.jsx` — name, delivery location|`/account` route|
|1.12|Navbar: Login / Account link|UI entry point|
|1.13|Wrap app: `<AuthProvider>` inside `<CartProvider>` in `App.jsx`|Provider tree|

Exit criteria: User can verify phone, get JWT, update profile, stay logged in across refresh.

---

### Phase 2 — Orders service without payment (Week 2)

Build order logic before Airtel so you can test checkout with a mock payment.

Backend: `Backend/services/orders/`

|Step|Task|Deliverable|
|---|---|---|
|2.1|Scaffold FastAPI + Mongo|Service running|
|2.2|`orders` + `payment_attempts` models|`models.py`|
|2.3|`POST /checkout` — accept `items[]`, optional JWT|Creates `pending_payment` order|
|2.4|Server-side validation — fetch products from catalog DB (shared Mongo) or internal HTTP call|Price/stock from DB only|
|2.5|Guest vs auth — attach `user_id` from JWT when present|Linked orders|
|2.6|`GET /orders/:id` — owner check (JWT user or guest token)|Status endpoint|
|2.7|`GET /auth/me/orders` or `GET /orders?mine=true`|Order history|
|2.8|Admin routes — `GET /admin/orders`, `PATCH /admin/orders/:id/status`|Reuse admin JWT from catalog|

Frontend

|Step|Task|Deliverable|
|---|---|---|
|2.9|`src/api/orders.js`|API client|
|2.10|`CheckoutPage.jsx` — review cart, customer details (pre-filled if logged in)|`/checkout`|
|2.11|Replace `CartDrawer` WhatsApp button → “Proceed to checkout”|Route to `/checkout`|
|2.12|`CheckoutPendingPage.jsx` — placeholder “Processing payment…”|`/checkout/:orderId`|
|2.13|`OrderHistoryPage.jsx` — list for logged-in users|`/account/orders`|

Exit criteria: Checkout creates a real order in MongoDB; admin can see it; no payment yet.

---

### Phase 3 — Airtel Money integration (Week 3)

|Step|Task|Deliverable|
|---|---|---|
|3.1|`payments/airtel.py` — OAuth, signed collection request, status enquiry|Adapter|
|3.2|`POST /checkout` calls adapter after order creation|USSD push sent|
|3.3|`POST /orders/:id/pay` — retry payment for failed/expired orders|Retry flow|
|3.4|`GET /orders/:id/status` — polls Airtel when `pending_payment`|Status updates|
|3.5|Background job or inline poll with timeout (e.g. 120s)|Auto transition to `paid` / `failed`|
|3.6|On `paid`: atomic stock decrement (`stock: { $gte: qty }`)|Inventory|
|3.7|On `paid`: `clearCart()` on frontend, show success|Complete UX|

Frontend checkout UX for Airtel

1. User confirms order

2. Screen: "We've sent a payment request to 0752 XXX XXX"

3. "Open your phone and enter your Airtel Money PIN"

4. Spinner + poll /orders/:id/status every 3s

5. Success → order confirmation + order number

6. Failed/timeout → "Try again" or "Use different number"

|Step|Task|Deliverable|
|---|---|---|
|3.8|Payment phone field — default to account phone, editable for “pay with another line”|UX|
|3.9|Staging tests with Airtel UAT MSISDNs|Signed off in sandbox|
|3.10|Production keys + go-live checklist|Live payments|

Exit criteria: Real Airtel USSD push → paid order → stock decremented.

---

### Phase 4 — Admin orders + ops (Week 4)

|Step|Task|Deliverable|
|---|---|---|
|4.1|`src/admin/pages/OrdersTable.jsx`|`/admin/orders` route in `App.jsx`|
|4.2|Filters: pending, paid, fulfilled, failed|Admin UI|
|4.3|Order detail: customer, items, Airtel tx ref, delivery|Detail view|
|4.4|Actions: Mark fulfilled, Cancel (restore stock if paid)|Ops workflow|
|4.5|Optional: WhatsApp notify ops on new paid order (internal, not customer checkout)|Alert|

---

### Phase 5 — Hardening + MTN (later)

|Step|Task|
|---|---|
|5.1|Rate limits on OTP and checkout|
|5.2|Idempotency keys on checkout|
|5.3|`payments/mtn.py` + checkout provider selector|
|5.4|Server-side cart sync for logged-in users|
|5.5|Email/SMS order confirmation|
|5.6|Refunds via Airtel disbursement API (manual admin trigger first)|

---

## Part E — Frontend route map (target)

```
/ Home (unchanged)
/accessories Store + cart drawer
/login Phone OTP login
/account Profile (name, delivery)
/account/orders Order history
/checkout Review + pay
/checkout/:orderId Airtel pending / poll screen
/checkout/success Confirmation
/admin/orders New admin page
```

## Part F — Key API contracts (design now, implement in phases)

### `POST /auth/otp/send`

```
{ "phone": "0752604392" }
```
→ `{ "message": "OTP sent", "expires_in": 300 }`

### `POST /auth/otp/verify`

```
{ "phone": "0752604392", "code": "482910" }
```
→ `{ "access_token": "...", "user": { "id", "name", "phone", "default_delivery" } }`

### `POST /orders/checkout`
```
{
"items": [{ "product_id": "...", "quantity": 2 }],
"payment": {
"provider": "airtel",
"msisdn": "0752604392"
},
"delivery_location": "Kampala, Makerere",
"idempotency_key": "uuid"
}
```
Headers: `Authorization: Bearer <customer_jwt>` (optional)
→ `{ "order_id": "...", "order_number": "NXC-...", "status": "pending_payment", "payment_message": "Check your phone..." }`
### `GET /orders/:id/status`
→ `{ "status": "pending_payment" | "paid" | "failed" | "expired", "paid_at": null }`

## Part G — Security checklist

|Area|Rule|
|---|---|
|Airtel secrets|Only in orders service `.env`|
|OTP|6 digits, 5 min expiry, max 3 sends/hour per phone|
|JWT|Separate customer vs admin tokens and storage keys|
|Orders|Users can only read their own orders|
|Guest orders|Return a short-lived `guest_token` or require phone + order_number to view|
|Prices|Always from catalog DB at checkout time|
|MSISDN|Normalize once on server; validate Uganda format|
## Part H — What to build first (recommended order)

If you want the shortest path to a demo:

1. Auth service (OTP + profile) — unlocks pre-filled checkout
2. Orders service (mock payment) — replace WhatsApp button
3. Airtel adapter — real money
4. Admin orders — fulfillment
5. MTN adapter — second payment button

Auth and orders can be developed in parallel if two people work on it; integrate at checkout (Phase 2.5).

---

## Part I — Decisions to lock before implementation

1. OTP SMS provider — Africa's Talking vs Twilio vs other
2. Guest checkout — allow without account, or require login before pay? (Recommend: allow guest, encourage account after)
3. Payment phone — must match account phone, or allow paying from another Airtel line?
4. Order access for guests — `order_number` + phone lookup on success page?
5. Shared Mongo vs HTTP — orders service reads products directly from Mongo (faster) vs calls catalog API (cleaner boundaries). For your scale, shared Mongo read is fine initially.

---

## Summary

- Airtel = USSD push + server polling, not a redirect checkout. Wrap it in a payment adapter from day one.
- User accounts = new auth service, phone + OTP, JWT with `role: customer`, profile holds delivery details.
- Checkout = orders service validates cart server-side, creates order, triggers Airtel, polls until paid, then clears cart.
- MTN = second adapter later, same orders flow.

When you’re ready to implement, a sensible first sprint is Phase 1 (auth) + Phase 2.1–2.8 (orders backend). Say which phase you want to start with and we can break it into file-by-file tasks or start writing the code.