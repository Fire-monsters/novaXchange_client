import { useState, useEffect } from 'react'
import { getProducts } from '../api/catalog'
import mockProducts, { CATEGORIES as MOCK_CATEGORIES } from '../data/accessories'

/**
 * Tries the live catalog API first.
 * Falls back to bundled mock data if the API is unreachable
 * or returns zero products (e.g. fresh DB, no uploads yet).
 */
export function useProducts() {
  const [products, setProducts] = useState(mockProducts)
  const [source, setSource]     = useState('mock') // 'mock' | 'api'
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    let cancelled = false

    getProducts({ active: true, limit: 100 })
      .then(res => {
        if (cancelled) return
        if (res.items && res.items.length > 0) {
          setProducts(res.items)
          setSource('api')
        } else {
          // API works but no products uploaded yet — keep mock data as a placeholder catalog
          setProducts(mockProducts)
          setSource('mock')
        }
      })
      .catch(() => {
        if (cancelled) return
        setProducts(mockProducts)
        setSource('mock')
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  return { products, source, loading }
}