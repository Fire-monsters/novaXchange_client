/**
 * src/data/bundles.js
 * ─────────────────────────────────────────────────────────────────────
 * Fallback bundle-deal data for BundleDealsPopup.jsx. Used whenever the
 * backend has no admin-saved settings document yet (GET /settings/
 * bundle-deals returns enabled:false, bundles:[]) — so the popup keeps
 * working exactly as it does today until an admin visits the new
 * settings page and saves their own configuration.
 *
 * Field names match the backend's BundleDeal model exactly (snake_case,
 * `_ugx` price suffix) so the popup can render either source with no
 * mapping step in between.
 * ─────────────────────────────────────────────────────────────────────
 */

export const DEFAULT_BUNDLES = [
  {
    id: 'productivity',
    tag: 'Productivity Combo',
    headline: 'The Full Setup',
    subline: 'Everything your desk needs. Nothing it doesn\'t.',
    emoji: '⚡',
    accent_color: '#6C2BD9',   // violet
    accent_text: '#FFE033',    // yellow
    bg_color: '#EDE6FF',       // violet-pale
    items: [
      { name: 'Wireless Mouse', detail: 'Logitech M185' },
      { name: 'Mechanical Keyboard', detail: 'Redragon K552' },
      { name: 'Laptop Stand', detail: 'Adjustable aluminium' },
      { name: 'USB-C Hub', detail: 'UGREEN 7-in-1' },
    ],
    freebie: 'Desktop Mat (worth UGX 25,000)',
    original_price_ugx: 385_000,
    bundle_price_ugx: 320_000,
    wa_message: "Hi novaXchange! I'm interested in the Productivity Combo bundle (mouse + keyboard + stand + hub). Can you confirm availability?",
  },
  {
    id: 'student-starter',
    tag: 'Student Starter',
    headline: 'Campus-Ready Kit',
    subline: 'Plug in. Show up. Stand out.',
    emoji: '🎒',
    accent_color: '#F5C800',   // yellow
    accent_text: '#120D1E',    // ink
    bg_color: '#FFFBE0',
    items: [
      { name: 'Budget Laptop', detail: 'HP 250 G9' },
      { name: 'Wireless Mouse', detail: 'Logitech M185' },
      { name: 'Laptop Bag', detail: 'Kingsons 15.6"' },
      { name: '65W GaN Charger', detail: 'UGREEN compact' },
    ],
    freebie: 'Free Mouse Trackpad (worth UGX 18,000)',
    original_price_ugx: 1_346_000,
    bundle_price_ugx: 1_199_000,
    wa_message: "Hi novaXchange! I'm interested in the Student Starter bundle (HP laptop + mouse + bag + charger). Can you confirm availability?",
  },
  {
    id: 'creator',
    tag: 'Creator Bundle',
    headline: 'Built for Builders',
    subline: 'Code, design, edit — without slowing down.',
    emoji: '🎨',
    accent_color: '#FF6B2B',   // orange
    accent_text: '#FFFFFF',
    bg_color: '#FFF0E8',
    items: [
      { name: 'Mid-range Laptop', detail: 'Dell Inspiron 15' },
      { name: 'MX Master 3 Mouse', detail: 'Logitech premium' },
      { name: 'USB-C Hub', detail: 'UGREEN 7-in-1' },
      { name: 'Laptop Stand', detail: 'Adjustable aluminium' },
    ],
    freebie: 'Free novaBoost Service (worth UGX 30,000)',
    original_price_ugx: 2_208_000,
    bundle_price_ugx: 1_999_000,
    wa_message: "Hi novaXchange! I'm interested in the Creator Bundle (Dell + MX Master + hub + stand). Can you confirm availability?",
  },
]
