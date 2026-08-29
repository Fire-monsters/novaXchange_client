/**
 * OrdersTable.jsx
 * ──────────────────────────────────────────────────────────────────
 * Admin order list: search, status filter, pagination, inline status
 * change, link to detail view. Mirrors ProductsTable.jsx's shape.
 * ──────────────────────────────────────────────────────────────────
 */
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiSearch, FiChevronLeft, FiChevronRight, FiShoppingCart,
} from 'react-icons/fi'
import { listOrdersAdmin, updateOrderStatus } from '../../api/catalog'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'

const STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled']

// Mirrors ALLOWED_TRANSITIONS in Backend/services/catalog/routers/orders.py —
// keeps the inline status dropdown from ever offering an invalid transition.
const ALLOWED_TRANSITIONS = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['packed', 'cancelled'],
  packed:    ['shipped', 'cancelled'],
  shipped:   ['delivered'],
  delivered: [],
  cancelled: [],
}

const LIMIT = 20

// ── Inline status editor ────────────────────────────────────────────
const StatusCell = ({ order, onSaved }) => {
  const [saving, setSaving] = useState(false)
  const options = ALLOWED_TRANSITIONS[order.status] || []

  const handleChange = async (e) => {
    const next = e.target.value
    if (!next) return
    if (!window.confirm(`Change order ${order.order_number} to "${next}"?`)) return
    setSaving(true)
    try {
      const updated = await updateOrderStatus(order.id, next)
      onSaved(updated)
    } catch (err) {
      alert(`Failed to update status: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (options.length === 0) {
    return <OrderStatusBadge status={order.status} size="sm" />
  }

  return (
    <div className="flex items-center gap-2">
      <OrderStatusBadge status={order.status} size="sm" />
      <select
        value=""
        disabled={saving}
        onChange={handleChange}
        className="text-xs border border-ink/20 rounded-lg px-1.5 py-1 focus:outline-none focus:border-violet disabled:opacity-50"
      >
        <option value="">Move to…</option>
        {options.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  )
}

export default function OrdersTable() {
  const navigate = useNavigate()

  const [items, setItems]     = useState([])
  const [total, setTotal]     = useState(0)
  const [pages, setPages]     = useState(1)
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    const params = { page, limit: LIMIT, search }
    if (status) params.status = status

    listOrdersAdmin(params)
      .then(res => {
        setItems(res.items)
        setTotal(res.total)
        setPages(res.pages)
      })
      .catch(err => {
        console.error(err)
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [page, search, status])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search, status])

  const updateRow = (updated) => {
    setItems(items => items.map(o => o.id === updated.id ? updated : o))
  }

  const filtersActive = search || status

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-bricolage font-black text-2xl text-ink">Orders</h1>
        <p className="text-gray text-sm">{total} total</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border-2 border-ink p-4 shadow-[3px_3px_0_#120D1E]">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search order #, name, phone, email…"
              className="w-full pl-9 pr-3 py-2 border-2 border-ink/15 rounded-lg text-sm
                         focus:outline-none focus:border-violet transition-colors"
            />
          </div>

          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="px-3 py-2 border-2 border-ink/15 rounded-lg text-sm capitalize focus:outline-none focus:border-violet"
          >
            <option value="">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>

          {filtersActive && (
            <button
              onClick={() => { setSearch(''); setStatus('') }}
              className="text-sm text-violet hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border-2 border-ink shadow-[3px_3px_0_#120D1E] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-violet border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <FiShoppingCart size={32} className="text-gray/30" />
            <p className="text-gray text-sm">No orders found</p>
            {filtersActive && (
              <button
                onClick={() => { setSearch(''); setStatus('') }}
                className="text-violet text-sm font-semibold hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink/10 text-left text-xs text-gray uppercase tracking-wide">
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-2 py-3">Customer</th>
                  <th className="px-2 py-3">Total</th>
                  <th className="px-2 py-3">Status</th>
                  <th className="px-2 py-3">Date</th>
                  <th className="px-2 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {items.map(o => (
                  <tr key={o.id} className="hover:bg-light-gray transition">
                    <td className="px-4 py-3 font-mono text-xs text-ink">{o.order_number}</td>
                    <td className="px-2 py-3">
                      <p className="font-semibold text-ink">{o.customer.name}</p>
                      <p className="text-xs text-gray">{o.customer.whatsapp}</p>
                    </td>
                    <td className="px-2 py-3 font-bricolage font-bold text-violet whitespace-nowrap">
                      UGX {o.total_ugx.toLocaleString()}
                    </td>
                    <td className="px-2 py-3">
                      <StatusCell order={o} onSaved={updateRow} />
                    </td>
                    <td className="px-2 py-3 text-ink-soft whitespace-nowrap">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/orders/${o.id}`)}
                        className="text-violet text-xs font-semibold hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-ink/10 text-sm">
            <span className="text-gray">Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg border border-ink/15 flex items-center justify-center disabled:opacity-30 hover:bg-light-gray"
              >
                <FiChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="w-8 h-8 rounded-lg border border-ink/15 flex items-center justify-center disabled:opacity-30 hover:bg-light-gray"
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
