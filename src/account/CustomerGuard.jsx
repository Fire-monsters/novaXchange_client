/**
 * CustomerGuard.jsx — route protection for customer-only pages
 * Same shape as src/admin/AdminGuard.jsx, but reads customer session
 * state from CustomerAuthContext and redirects to /account/login.
 */
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useCustomerAuth } from '../context/CustomerAuthContext'

export function CustomerGuard({ children }) {
  const { user, loading } = useCustomerAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="w-8 h-8 border-4 border-violet border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/account/login" replace />
  return children
}
