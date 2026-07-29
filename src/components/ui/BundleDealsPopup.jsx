/**
 * BundleDealsPopup.jsx
 * ─────────────────────────────────────────────────────────────────────
 * Interstitial splash that appears on first visit per session.
 * Shows combo bundle deals with a countdown auto-dismiss.
 *
 * Content is admin-editable (see src/admin/pages/BundleSettings.jsx →
 * PUT /admin/settings/bundle-deals). This component reads the current
 * config via GET /settings/bundle-deals and falls back to
 * DEFAULT_BUNDLES (src/data/bundles.js — the deals that used to be
 * hardcoded here) whenever nothing has been saved yet, so shipping
 * this doesn't silently hide the popup for existing visitors.
 *
 * Usage: import and drop into HomePage in App.jsx:
 *   import BundleDealsPopup from './components/ui/BundleDealsPopup'
 *   // inside <HomePage> return, anywhere after <Navbar />:
 *   <BundleDealsPopup />
 * ─────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { getBundleDeals } from '../../api/settings'
import { DEFAULT_BUNDLES } from '../../data/bundles'

const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || '256779543595'
const SESSION_KEY = 'nxc_bundle_seen'
const DEFAULT_COUNTDOWN_SECS = 5 // used until settings load (or if they fail to)

// ── Countdown ring SVG ────────────────────────────────────────────────────────
const CountdownRing = ({ seconds, total }) => {
  const r = 14
  const circumference = 2 * Math.PI * r
  const progress = (seconds / total) * circumference

  return (
    <svg width="36" height="36" className="rotate-[-90deg]">
      {/* Track */}
      <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
      {/* Progress */}
      <circle
        cx="18" cy="18" r={r}
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2.5"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
const BundleDealsPopup = () => {
  const [settings, setSettings]         = useState(null)   // null until GET resolves
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const [visible, setVisible]     = useState(false)
  const [index, setIndex]         = useState(0)
  const [countdown, setCountdown] = useState(DEFAULT_COUNTDOWN_SECS)
  const [paused, setPaused]       = useState(false)
  const timerRef                  = useRef(null)

  // A saved doc with an empty bundle list is indistinguishable from "nothing
  // configured yet" (both come back as bundles:[]) — treat empty as "use the
  // fallback," so the popup can only ever be truly hidden by an admin who
  // explicitly disabled it while some bundles were still saved.
  const hasSavedBundles = (settings?.bundles?.length ?? 0) > 0
  const bundles         = hasSavedBundles ? settings.bundles : DEFAULT_BUNDLES
  const popupEnabled    = hasSavedBundles ? settings.enabled : true
  const countdownTotal  = settings?.countdown_secs || DEFAULT_COUNTDOWN_SECS

  // Load admin-configured settings once on mount
  useEffect(() => {
    let cancelled = false
    getBundleDeals()
      .then(data => { if (!cancelled) setSettings(data) })
      .catch(() => { if (!cancelled) setSettings(null) }) // fall back to defaults
      .finally(() => { if (!cancelled) setSettingsLoaded(true) })
    return () => { cancelled = true }
  }, [])

  // Show once per session — only once settings have resolved and are enabled
  useEffect(() => {
    if (!settingsLoaded || !popupEnabled) return
    const seen = sessionStorage.getItem(SESSION_KEY)
    if (seen) return
    // Small delay so the page finishes loading first
    const t = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [settingsLoaded, popupEnabled])

  // Reset the countdown to the current total whenever it (or the bundle) changes
  useEffect(() => {
    setCountdown(countdownTotal)
  }, [countdownTotal])

  // Countdown timer — pauses on hover
  useEffect(() => {
    if (!visible || paused) return
    if (countdown <= 0) { dismiss(); return }

    timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [visible, countdown, paused])

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, '1')
    setVisible(false)
  }

  const prev = () => {
    setIndex(i => (i - 1 + bundles.length) % bundles.length)
    setCountdown(countdownTotal)
  }

  const next = () => {
    setIndex(i => (i + 1) % bundles.length)
    setCountdown(countdownTotal)
  }

  const handleCta = () => {
    const msg = encodeURIComponent(bundle.wa_message)
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
    dismiss()
  }

  if (bundles.length === 0) return null

  const bundle = bundles[Math.min(index, bundles.length - 1)]
  const saving = bundle.original_price_ugx - bundle.bundle_price_ugx
  const savingPct = Math.round((saving / bundle.original_price_ugx) * 100)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[500] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-ink/75 backdrop-blur-md"
            onClick={dismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-md bg-white border-2 border-ink
              rounded-3xl shadow-[10px_10px_0_#120D1E] overflow-hidden"
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >

            {/* ── Header band ── */}
            <div
              className="relative p-5 pb-4 overflow-hidden"
              style={{ background: bundle.accent_color }}
            >
              {/* Decorative blobs */}
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-black/10" />

              {/* Top row: close + countdown */}
              <div className="relative z-10 flex items-center justify-between mb-3">
                <div
                  className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                  style={{
                    color: bundle.accent_text,
                    borderColor: `${bundle.accent_text}40`,
                    background: 'rgba(0,0,0,0.15)',
                  }}
                >
                  🔥 Limited Bundle Deal
                </div>

                <div className="flex items-center gap-2">
                  {/* Countdown ring + number */}
                  <div className="relative flex items-center justify-center">
                    <CountdownRing seconds={countdown} total={countdownTotal} />
                    <span
                      className="absolute text-[10px] font-black"
                      style={{ color: bundle.accent_text }}
                    >
                      {countdown}
                    </span>
                  </div>

                  {/* Close */}
                  <button
                    onClick={dismiss}
                    className="w-8 h-8 rounded-full flex items-center justify-center
                      bg-black/20 hover:bg-black/35 border border-white/20 transition-colors"
                    style={{ color: bundle.accent_text }}
                    aria-label="Close"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              </div>

              {/* Headline */}
              <div className="relative z-10">
                <p className="text-2xl mb-1">{bundle.emoji}</p>
                <div
                  className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-75"
                  style={{ color: bundle.accent_text }}
                >
                  {bundle.tag}
                </div>
                <h2
                  className="font-bricolage font-black text-2xl leading-tight"
                  style={{ color: bundle.accent_text }}
                >
                  {bundle.headline}
                </h2>
                <p
                  className="text-sm mt-0.5 opacity-80"
                  style={{ color: bundle.accent_text }}
                >
                  {bundle.subline}
                </p>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="p-5">

              {/* Saving badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 border-2 border-ink"
                style={{ background: bundle.bg_color }}
              >
                <span className="text-xs font-black text-ink">
                  Save UGX {saving.toLocaleString()}
                </span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  -{savingPct}%
                </span>
              </div>

              {/* What's in the bundle */}
              <p className="font-bricolage font-bold text-xs uppercase tracking-widest text-gray mb-2">
                What's in the box
              </p>
              <ul className="space-y-1.5 mb-3">
                {bundle.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: bundle.accent_color }}
                    />
                    <span className="font-semibold text-ink">{item.name}</span>
                    <span className="text-gray text-xs">— {item.detail}</span>
                  </li>
                ))}
              </ul>

              {/* Freebie */}
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-4">
                <span className="text-green-500 text-base">🎁</span>
                <span className="text-green-700 text-xs font-semibold">
                  + FREE: {bundle.freebie}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-bricolage font-black text-2xl text-violet">
                  UGX {bundle.bundle_price_ugx.toLocaleString()}
                </span>
                <span className="text-gray text-sm line-through">
                  {bundle.original_price_ugx.toLocaleString()}
                </span>
              </div>

              {/* CTA */}
              <button
                onClick={handleCta}
                className="w-full flex items-center justify-center gap-2 font-bricolage font-bold
                  py-3.5 rounded-2xl border-2 border-ink text-sm
                  shadow-[4px_4px_0_#120D1E] hover:shadow-[6px_6px_0_#120D1E]
                  hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                style={{
                  background: bundle.accent_color,
                  color: bundle.accent_text,
                }}
              >
                <FaWhatsapp size={16} />
                Grab this deal on WhatsApp
                <FiArrowRight size={14} />
              </button>

              <p className="text-center text-gray text-xs mt-2 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                We reply within 30 mins · Campus delivery available
              </p>
            </div>

            {/* ── Bundle navigation (dots + arrows) ── */}
            {bundles.length > 1 && (
              <div className="flex items-center justify-between px-5 pb-4">
                {/* Prev */}
                <button
                  onClick={prev}
                  className="w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center
                    bg-off-white hover:bg-violet hover:text-yellow hover:border-violet transition-colors"
                  aria-label="Previous bundle"
                >
                  <FiChevronLeft size={15} />
                </button>

                {/* Dots */}
                <div className="flex items-center gap-1.5">
                  {bundles.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setIndex(i); setCountdown(countdownTotal) }}
                      className="rounded-full transition-all border border-ink/20"
                      style={{
                        width:  i === index ? 20 : 8,
                        height: 8,
                        background: i === index ? bundle.accent_color : '#D1C9E8',
                      }}
                      aria-label={`Bundle ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Next */}
                <button
                  onClick={next}
                  className="w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center
                    bg-off-white hover:bg-violet hover:text-yellow hover:border-violet transition-colors"
                  aria-label="Next bundle"
                >
                  <FiChevronRight size={15} />
                </button>
              </div>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BundleDealsPopup
