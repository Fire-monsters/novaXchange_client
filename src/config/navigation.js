/**
 * navigation.js
 * ──────────────────────────────────────────────────────────────────
 * Central nav config for the public Navbar. Each item is either:
 *   - a "section" on the homepage (scrolled to if already on "/",
 *     otherwise navigated to "/#<sectionId>" and scrolled after landing)
 *   - a "page" (a real route, rendered as a <Link>)
 * ──────────────────────────────────────────────────────────────────
 */

export const NAV_ITEMS = [
  { label: 'About Us', type: 'section', sectionId: 'about' },
  { label: 'Services', type: 'section', sectionId: 'solutions' },
  { label: 'novaAccessories', type: 'section', sectionId: 'lead-capture' },
  { label: 'Trade-In', type: 'section', sectionId: 'lead-capture' },
  { label: 'Contact', type: 'section', sectionId: 'footer' },
]
