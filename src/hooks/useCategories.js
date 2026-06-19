import { useState, useEffect } from 'react'
import { getCategories } from '../api/catalog'
import { CATEGORIES as MOCK_CATEGORIES } from '../data/accessories'

/**
 * Fetches categories from /categories.
 * Falls back to the static mock list if the API is unreachable.
 * Always prepends an "All" pill — neither source includes it.
 */
export function useCategories() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES)

  useEffect(() => {
    let cancelled = false

    getCategories()
      .then(res => {
        if (cancelled || !res || res.length === 0) return
        setCategories([{ id: 'all', label: 'All' }, ...res])
      })
      .catch(() => {
        // keep MOCK_CATEGORIES (already includes "All")
      })

    return () => { cancelled = true }
  }, [])

  return categories
}