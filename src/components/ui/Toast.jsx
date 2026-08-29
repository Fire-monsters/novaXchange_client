/**
 * Toast.jsx
 * ──────────────────────────────────────────────────────────────────
 * Small, auto-dismissing, screen-centered banner (with a dim backdrop) —
 * used instead of a second interrupting modal after "Add to cart" (per
 * the UX doc: a toast doesn't break shopping flow the way another
 * popup would). Centered rather than pinned to a corner so it's never
 * missed on a small screen.
 * ──────────────────────────────────────────────────────────────────
 */

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

export default function Toast({ open, onClose, duration = 4000, children }) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [open, duration, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[400] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 w-[92vw] max-w-sm"
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          >
            <div className="relative bg-white border-2 border-ink rounded-2xl shadow-[6px_6px_0_#120D1E] p-5 pr-9">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray hover:text-ink transition"
                aria-label="Dismiss"
              >
                <FiX size={15} />
              </button>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
