/**
 * src/api/httpClient.js
 * ─────────────────────────────────────────────────────────────────────
 * Factory for API clients that need their own token storage + 401
 * redirect target. Same request()/token-handling shape as the admin
 * client in src/api/catalog.js (which is left untouched), but
 * parameterized so the customer-facing token never collides with the
 * admin token.
 * ─────────────────────────────────────────────────────────────────────
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001'

export function createRequest({ tokenKey, redirectTo }) {
  const saveToken  = (token) => localStorage.setItem(tokenKey, token)
  const clearToken = ()      => localStorage.removeItem(tokenKey)
  const getToken   = ()      => localStorage.getItem(tokenKey)
  const isLoggedIn = ()      => !!getToken()

  async function request(path, options = {}) {
    const token = getToken()
    const headers = { ...options.headers }

    if (token) headers['Authorization'] = `Bearer ${token}`
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(`${BASE}${path}`, { ...options, headers })

    if (res.status === 401) {
      clearToken()
      if (redirectTo && window.location.pathname !== redirectTo) {
        window.location.href = redirectTo
      }
      throw new Error('Session expired')
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }))
      throw new Error(err.detail || `Request failed: ${res.status}`)
    }

    if (res.status === 204) return null
    return res.json()
  }

  return { request, saveToken, clearToken, getToken, isLoggedIn }
}

// Shared instance for every customer-facing call (orders + customer auth) —
// defined once here so the token key can't drift between files.
export const customerHttp = createRequest({
  tokenKey: 'nxc_customer_token',
  redirectTo: '/account/login',
})
