/**
 * BuyNowContext.jsx
 * ──────────────────────────────────────────────────────────────────
 * Temporary, single-item purchase intent — deliberately separate from
 * CartContext. "Buy it now" never touches the persistent cart; it sets
 * this instead, and CheckoutPage reads from here first (falling back
 * to the cart) so the two flows never mix.
 *
 * Same sessionStorage persistence strategy as CartContext: survives a
 * refresh mid-checkout, clears when the tab closes.
 *
 * Usage anywhere in the tree:
 *   import { useBuyNow } from '@/context/BuyNowContext'
 *   const { buyNowItem, setBuyNow, clearBuyNow } = useBuyNow()
 */

import React, { createContext, useContext, useState, useEffect } from 'react'

const BuyNowContext = createContext(null)

const STORAGE_KEY = 'nxc_buynow'

export function BuyNowProvider({ children }) {
  const [buyNowItem, setBuyNowItem] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (buyNowItem) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(buyNowItem))
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [buyNowItem])

  const setBuyNow  = (product, quantity = 1) => setBuyNowItem({ product, quantity })
  const clearBuyNow = () => setBuyNowItem(null)

  return (
    <BuyNowContext.Provider value={{ buyNowItem, setBuyNow, clearBuyNow }}>
      {children}
    </BuyNowContext.Provider>
  )
}

export function useBuyNow() {
  const ctx = useContext(BuyNowContext)
  if (!ctx) throw new Error('useBuyNow must be used inside <BuyNowProvider>')
  return ctx
}
