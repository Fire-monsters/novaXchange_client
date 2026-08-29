/**
 * ScrollToTopButton.jsx
 * ─────────────────────────────────────────────
 * A floating "back to top" arrow that appears once the user
 * scrolls past 400px and smoothly scrolls back to the top.
 *
 * Usage: import and render it once in App.jsx, e.g.:
 *   import ScrollToTopButton from './components/ui/ScrollToTopButton'
 *   // inside <CartProvider> after your routes:
 *   <ScrollToTopButton />
 * ─────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowUp } from 'react-icons/fi'

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-24 right-6 z-50
            w-11 h-11 rounded-full bg-violet text-yellow
            border-2 border-ink shadow-[3px_3px_0_#120D1E]
            flex items-center justify-center
            hover:shadow-[5px_5px_0_#120D1E] hover:-translate-y-0.5 hover:-translate-x-0.5
            transition-all duration-200"
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiArrowUp size={18} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ScrollToTopButton