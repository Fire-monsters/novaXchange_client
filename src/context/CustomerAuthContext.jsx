/**
 * CustomerAuthContext.jsx
 * ──────────────────────────────────────────────────────────────────
 * Customer session state — separate from admin auth entirely (own
 * token key, own backend routes). Hydrates the profile on mount if a
 * token is already stored, so a page refresh doesn't log the user out.
 * ──────────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as customerAuth from '../api/customerAuth'

const CustomerAuthContext = createContext(null)

export function CustomerAuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!customerAuth.getToken()) { setLoading(false); return }
    customerAuth.getMe()
      .then(setUser)
      .catch(() => customerAuth.clearToken())
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await customerAuth.login(email, password)
    customerAuth.saveToken(res.access_token)
    const profile = await customerAuth.getMe()
    setUser(profile)
    return profile
  }, [])

  const register = useCallback(async (body) => {
    const res = await customerAuth.register(body)
    customerAuth.saveToken(res.access_token)
    const profile = await customerAuth.getMe()
    setUser(profile)
    return profile
  }, [])

  const loginWithGoogle = useCallback(async (accessToken) => {
    const res = await customerAuth.loginWithGoogleToken(accessToken)
    customerAuth.saveToken(res.access_token)
    const profile = await customerAuth.getMe()
    setUser(profile)
    return profile
  }, [])

  const updateProfile = useCallback(async (body) => {
    const profile = await customerAuth.updateMe(body)
    setUser(profile)
    return profile
  }, [])

  const logout = useCallback(() => {
    customerAuth.clearToken()
    setUser(null)
  }, [])

  return (
    <CustomerAuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, updateProfile, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext)
  if (!ctx) throw new Error('useCustomerAuth must be used inside <CustomerAuthProvider>')
  return ctx
}
