import { useState, useEffect } from 'react'
import { getCategories } from '../api/catalog'
import { CATEGORIES as MOCK_CATEGORIES } from '../data/accessories'

/**
 * Tries the live catalog API first.
 * Falls back to bundled mock categories if the API is unreachable
 * or returns none yet — mirrors useProducts.js.
 */
export function useCategories() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES)

  useEffect(() => {
    let cancelled = false

    getCategories()
      .then(res => {
        if (cancelled) return
        if (Array.isArray(res) && res.length > 0) {
          setCategories(res)
        }
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [])

  return categories
}
