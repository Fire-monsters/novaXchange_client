/**
 * src/api/catalog.js
 * ─────────────────────────────────────────────────────────────────────
 * Thin API client for the catalog service.
 * Reads VITE_API_URL from .env — defaults to localhost in dev.
 *
 * Add to your .env:
 *   VITE_API_URL=http://localhost:8001        (dev)
 *   VITE_API_URL=https://novaxchange.xyz/api/catalog  (production)
 *
 * All admin methods attach the JWT stored in localStorage automatically.
 * ─────────────────────────────────────────────────────────────────────
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001'
const TOKEN_KEY = 'nxc_admin_token'

// ── Token helpers ────────────────────────────────────────────────────────────

export const saveToken  = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = ()      => localStorage.removeItem(TOKEN_KEY)
export const getToken   = ()      => localStorage.getItem(TOKEN_KEY)
export const isLoggedIn = ()      => !!getToken()

// ── Base fetch wrapper ───────────────────────────────────────────────────────

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
    window.location.href = '/admin/login'
    throw new Error('Session expired')
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return null
  return res.json()
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const adminLogin = (email, password) =>
  request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const getAdminMe = () => request('/admin/me')

// ── Products (public) ─────────────────────────────────────────────────────────

export const getProducts = (params = {}) => {
  const q = new URLSearchParams()
  if (params.search)   q.set('search', params.search)
  if (params.category) q.set('category', params.category)
  if (params.tier)     q.set('tier', params.tier)
  if (params.active !== undefined) q.set('active', params.active)
  if (params.page)     q.set('page', params.page)
  if (params.limit)    q.set('limit', params.limit)
  return request(`/products?${q}`)
}

export const getProduct = (slug) => request(`/products/${slug}`)

// ── Products (admin) ─────────────────────────────────────────────────────────

/**
 * Create a product with images.
 * formData must be a FormData instance with all fields + File[] under 'images'.
 * onProgress(percent) called as upload progresses via XMLHttpRequest.
 */
export const createProduct = (formData, onProgress) =>
  uploadWithProgress(`${BASE}/admin/products`, formData, onProgress, 'POST')

export const updateProduct = (id, body) =>
  request(`/admin/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })

export const patchStock = (id, stock) =>
  request(`/admin/products/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ stock }),
  })

export const deleteProduct = (id, hard = false) =>
  request(`/admin/products/${id}?hard=${hard}`, { method: 'DELETE' })

export const bulkAction = (ids, action) =>
  request('/admin/products/bulk', {
    method: 'POST',
    body: JSON.stringify({ ids, action }),
  })

export const addProductImages = (id, formData, onProgress) =>
  uploadWithProgress(`${BASE}/admin/products/${id}/images`, formData, onProgress, 'POST')

export const removeProductImage = (id, filename) =>
  request(`/admin/products/${id}/images/${filename}`, { method: 'DELETE' })

// ── Categories ────────────────────────────────────────────────────────────────

export const getCategories = () => request('/categories')

export const createCategory = (body) =>
  request('/admin/categories', { method: 'POST', body: JSON.stringify(body) })

export const deleteCategory = (id) =>
  request(`/admin/categories/${id}`, { method: 'DELETE' })

// ── Dashboard stats ───────────────────────────────────────────────────────────

export const getDashboardStats = async () => {
  const [allProducts, activeProducts, draftProducts] = await Promise.all([
    getProducts({ active: false, limit: 1 }),
    getProducts({ active: true,  limit: 1 }),
    getProducts({ active: false, limit: 100 }),
  ])
  const lowStock = (activeProducts.items || []).filter(p => p.stock <= 5)
  return {
    totalProducts: allProducts.total,
    activeProducts: activeProducts.total,
    draftProducts: draftProducts.items?.filter(p => !p.active).length || 0,
    lowStockProducts: lowStock,
  }
}

// ── XHR upload with progress ──────────────────────────────────────────────────

function uploadWithProgress(url, formData, onProgress, method = 'POST') {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)

    const token = getToken()
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    })

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)) }
        catch { resolve(null) }
      } else {
        try {
          const err = JSON.parse(xhr.responseText)
          reject(new Error(err.detail || `Upload failed: ${xhr.status}`))
        } catch {
          reject(new Error(`Upload failed: ${xhr.status}`))
        }
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(formData)
  })
}
