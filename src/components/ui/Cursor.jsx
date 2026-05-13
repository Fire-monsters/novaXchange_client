import React, { useEffect, useRef } from 'react'

/**
 * CustomCursor
 * ─────────────────────────────────────────────────────────
 * Two-layer cursor:
 *   1. A small dot that snaps exactly to the pointer (no lag)
 *   2. A larger ring that follows with a spring-like lerp
 *
 * Grows on hover over any interactive element (a, button, [role=button],
 * input, select, textarea, label).
 *
 * Works on scroll because we update from mousemove (pointer-relative),
 * not scroll position. No scroll listener needed.
 *
 * Usage: drop <CustomCursor /> into App.jsx (inside the root div,
 *         before <Navbar />), then make sure index.css still hides
 *         the native cursor with `cursor: none` on html / body.
 * ─────────────────────────────────────────────────────────
 */
const CustomCursor = () => {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = -100, mouseY = -100 // start off-screen
    let ringX  = -100, ringY  = -100
    let rafId  = null
    let hovered = false

    // ── track pointer ────────────────────────────────────
    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    // ── hover detection ──────────────────────────────────
    const interactiveSelector = 'a, button, [role="button"], input, select, textarea, label'

    const onOver = (e) => {
      if (e.target.closest(interactiveSelector)) {
        hovered = true
        dot.style.transform  = 'translate(-50%,-50%) scale(2)'
        ring.style.transform = 'translate(-50%,-50%) scale(1.7)'
        ring.style.borderColor = 'rgba(255,224,51,0.8)'
      }
    }
    const onOut = (e) => {
      if (e.target.closest(interactiveSelector)) {
        hovered = false
        dot.style.transform  = 'translate(-50%,-50%) scale(1)'
        ring.style.transform = 'translate(-50%,-50%) scale(1)'
        ring.style.borderColor = 'rgba(108,43,217,0.7)'
      }
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout',  onOut)

    // ── RAF loop: dot snaps, ring lerps ─────────────────
    const lerp = (a, b, t) => a + (b - a) * t

    const tick = () => {
      // dot — instant
      dot.style.left = mouseX + 'px'
      dot.style.top  = mouseY + 'px'

      // ring — smooth follow
      ringX = lerp(ringX, mouseX, 0.12)
      ringY = lerp(ringY, mouseY, 0.12)
      ring.style.left = ringX + 'px'
      ring.style.top  = ringY + 'px'

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    // ── hide when cursor leaves window ───────────────────
    const onLeave = () => { dot.style.opacity = '0'; ring.style.opacity = '0' }
    const onEnter = () => { dot.style.opacity = '1'; ring.style.opacity = '1' }
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout',  onOut)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999]"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#FFE033',
          transform: 'translate(-50%,-50%)',
          transition: 'transform 0.15s ease, opacity 0.2s',
          boxShadow: '0 0 6px rgba(255,224,51,0.8)',
          willChange: 'left, top',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9998]"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid rgba(108,43,217,0.7)',
          transform: 'translate(-50%,-50%)',
          transition: 'transform 0.25s ease, border-color 0.25s ease, opacity 0.2s',
          willChange: 'left, top',
        }}
      />
    </>
  )
}

export default CustomCursor