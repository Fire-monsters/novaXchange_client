/**
 * CartContext.jsx
 * ──────────────────────────────────────────────────────
 * Lightweight cart state — no backend yet.
 * Persists to sessionStorage so the cart survives a page refresh
 * but clears when the browser tab is closed (no stale carts).
 *
 * When Auth service is built, merge this into the user session
 * and persist to MongoDB instead.
 *
 * Usage anywhere in the tree:
 *   import { useCart } from '@/context/CartContext'
 *   const { items, addItem, removeItem, totalCount } = useCart()
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'nxc_cart'

function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD': {
      const existing = state.find(i => i.id === action.product.id)
      if (existing) {
        return state.map(i =>
          i.id === action.product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...state, { ...action.product, quantity: 1 }]
    }

    case 'REMOVE':
      return state.filter(i => i.id !== action.id)

    case 'INCREMENT':
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i
      )

    case 'DECREMENT':
      return state.map(i =>
        i.id === action.id
          ? { ...i, quantity: Math.max(1, i.quantity - 1) }
          : i
      ).filter(i => i.quantity > 0)

    case 'CLEAR':
      return []

    case 'HYDRATE':
      return action.items

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem    = (product) => dispatch({ type: 'ADD', product })
  const removeItem = (id)      => dispatch({ type: 'REMOVE', id })
  const increment  = (id)      => dispatch({ type: 'INCREMENT', id })
  const decrement  = (id)      => dispatch({ type: 'DECREMENT', id })
  const clearCart  = ()        => dispatch({ type: 'CLEAR' })

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalUGX   = items.reduce((sum, i) => sum + i.price_ugx * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, increment, decrement, clearCart,
      totalCount, totalUGX,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}