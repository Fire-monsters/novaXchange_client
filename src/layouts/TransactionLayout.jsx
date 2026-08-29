/**
 * TransactionLayout.jsx
 * ──────────────────────────────────────────────────────────────────
 * Minimal chrome for "I am completing a transaction" pages — a back
 * button and the logo only, no full navbar/footer. Used for
 * checkout, order status, and the auth pages (login/register/
 * google-callback). Contrast with PublicLayout, used for browsing.
 * ──────────────────────────────────────────────────────────────────
 */

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

export function TransactionLayout({ children }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b-2 border-ink px-4 sm:px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-lg border-2 border-ink flex items-center justify-center text-ink-soft hover:bg-light-gray transition flex-shrink-0"
          aria-label="Go back"
        >
          <FiArrowLeft size={16} />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow to-violet rounded-full shadow-md flex items-center justify-center">
            <span className="text-ink font-bold text-sm">N</span>
          </div>
          <span className="font-bricolage font-extrabold text-xl tracking-tight">
            nova<span className="text-violet">X</span>change
          </span>
        </Link>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
