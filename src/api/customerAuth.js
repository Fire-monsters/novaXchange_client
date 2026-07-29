/**
 * src/api/customerAuth.js
 * ─────────────────────────────────────────────────────────────────────
 * Customer registration/login/profile — built on the shared customer
 * httpClient (its own 'nxc_customer_token' key, redirects to
 * /account/login on 401). Completely independent from the admin
 * client in src/api/catalog.js.
 * ─────────────────────────────────────────────────────────────────────
 */

import { customerHttp } from './httpClient'

const { request, saveToken, clearToken, getToken, isLoggedIn } = customerHttp

export { saveToken, clearToken, getToken, isLoggedIn }

export const register = (body) =>
  request('/account/register', { method: 'POST', body: JSON.stringify(body) })

export const login = (email, password) =>
  request('/account/login', { method: 'POST', body: JSON.stringify({ email, password }) })

// Bridges a verified Supabase Google session into our own customer_jwt.
export const loginWithGoogleToken = (accessToken) =>
  request('/account/google', { method: 'POST', body: JSON.stringify({ access_token: accessToken }) })

export const getMe = () => request('/account/me')

export const updateMe = (body) =>
  request('/account/me', { method: 'PATCH', body: JSON.stringify(body) })
