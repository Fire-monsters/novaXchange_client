import { useState, useEffect } from 'react'
import { getPackageImages } from '../api/catalog'

/**
 * Tries the live catalog API first.
 * Falls back to {} on failure — Solutions.jsx then falls through to each
 * package's existing static image, so nothing breaks before an admin
 * uploads anything. Mirrors useProducts.js / useCategories.js.
 */
export function usePackageImages() {
  const [imagesByPackage, setImagesByPackage] = useState({})

  useEffect(() => {
    let cancelled = false

    getPackageImages()
      .then(res => { if (!cancelled) setImagesByPackage(res || {}) })
      .catch(() => {})

    return () => { cancelled = true }
  }, [])

  return imagesByPackage
}
