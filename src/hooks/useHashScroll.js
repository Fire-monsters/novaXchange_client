import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to the element matching the current URL hash, smoothly.
 * Needed because react-router doesn't do this on its own — a plain
 * navigate('/#solutions') lands on '/' but leaves scroll position
 * untouched, so cross-page section links (see Navbar.jsx) rely on
 * this to actually reach the section once the route change lands.
 */
export function useHashScroll() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const el = document.getElementById(id)
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth' })
    })
  }, [location.pathname, location.hash])
}
