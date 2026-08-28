/**
 * PublicLayout.jsx
 * ──────────────────────────────────────────────────────────────────
 * Chrome for "browsing" pages — full Navbar + Footer. Wraps Home,
 * Accessories, and the logged-in Account page (profile management
 * reads as browsing, not a linear transaction). Contrast with
 * TransactionLayout, used for checkout/auth/order-status pages.
 * ──────────────────────────────────────────────────────────────────
 */

import React from 'react'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import { useHashScroll } from '../hooks/useHashScroll'

export function PublicLayout({ children }) {
  useHashScroll()
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
