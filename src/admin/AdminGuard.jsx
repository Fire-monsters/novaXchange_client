/**
 * AdminGuard.jsx — JWT route protection
 * Redirects to /admin/login if no valid token in localStorage.
 */
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getToken, getAdminMe, clearToken } from '../api/catalog'

export function AdminGuard({ children }) {
  const [state, setState] = useState('checking') // checking | ok | redirect

  useEffect(() => {
    if (!getToken()) { setState('redirect'); return }
    getAdminMe()
      .then(() => setState('ok'))
      .catch(() => { clearToken(); setState('redirect') })
  }, [])

  if (state === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="w-8 h-8 border-4 border-violet border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (state === 'redirect') return <Navigate to="/admin/login" replace />
  return children
}