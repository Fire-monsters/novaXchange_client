/**
 * Slideshow.jsx
 * ──────────────────────────────────────────────────────────────────
 * Manual image carousel — main image, dot indicators, prev/next arrows.
 * No autoplay by design (manual navigation is the priority per the UX doc).
 * Falls back gracefully to a single static image with no controls shown.
 * ──────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Slideshow({ images, alt = '', height = 200, className = '' }) {
  const [index, setIndex] = useState(0)
  const list = images && images.length > 0 ? images : []

  if (list.length === 0) return null

  const prev = () => setIndex(i => (i - 1 + list.length) % list.length)
  const next = () => setIndex(i => (i + 1) % list.length)

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={list[index]}
          alt={alt ? `${alt} view ${index + 1}` : ''}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        />
      </AnimatePresence>

      {list.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-ink/50
                      text-white flex items-center justify-center hover:bg-ink transition"
            aria-label="Previous image"
          >
            <FiChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-ink/50
                      text-white flex items-center justify-center hover:bg-ink transition"
            aria-label="Next image"
          >
            <FiChevronRight size={16} />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all ${
                  i === index ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
