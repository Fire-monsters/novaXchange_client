/**
 * src/api/settings.js
 * ─────────────────────────────────────────────────────────────────────
 * Public, unauthenticated store-settings reads (currently just the
 * bundle-deals popup config). Admin writes live in api/catalog.js
 * alongside the other admin/* endpoints, since those need the admin
 * token + 401 handling that a public storefront call shouldn't have.
 * ─────────────────────────────────────────────────────────────────────
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001'

export async function getBundleDeals() {
  const res = await fetch(`${BASE}/settings/bundle-deals`)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}
