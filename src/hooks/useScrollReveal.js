import { useEffect } from 'react'

/**
 * Bidirectional scroll reveal.
 *
 * Elements with the `.reveal` class animate IN when they enter the viewport
 * and animate OUT (reset) when they leave — so scrolling back up re-triggers
 * the entrance animation.
 *
 * The CSS transition is already defined in index.css:
 *   .reveal          { opacity: 0; transform: translateY(30px); transition: … }
 *   .reveal.visible  { opacity: 1; transform: translateY(0); }
 */
export const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          } else {
            // Remove 'visible' so the animation replays on re-entry
            entry.target.classList.remove('visible')
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])
}