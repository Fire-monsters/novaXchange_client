/**
 * OrderDetail.jsx
 * ──────────────────────────────────────────────────────────────────
 * Full order view for admin: line items, customer/delivery info,
 * status history, and the status-change action.
 * ──────────────────────────────────────────────────────────────────
 */
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiMessageCircle } from 'react-icons/fi'
import { getOrderAdmin, updateOrderStatus } from '../../api/catalog'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'

// No WhatsApp API is configured — this opens a pre-filled wa.me chat that
// the admin sends themselves, same normalization Backend/.../whatsapp.py uses.
function waLink(raw, text) {
  const digits = (raw || '').replace(/\D/g, '')
  const number = digits.startsWith('256') ? digits : digits.startsWith('0') ? `256${digits.slice(1)}` : digits
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

const ALLOWED_TRANSITIONS = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['packed', 'cancelled'],
  packed:    ['shipped', 'cancelled'],
  shipped:   ['delivered'],
  delivered: [],
  cancelled: [],
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const load = () => {
    setLoading(true)
    getOrderAdmin(id).then(setOrder).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const handleStatusChange = async (next) => {
    if (!window.confirm(`Change order ${order.order_number} to "${next}"?`)) return
    setUpdating(true)
    try {
      const updated = await updateOrderStatus(order.id, next)
      setOrder(updated)
    } catch (err) {
      alert(`Failed to update status: ${err.message}`)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-violet border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return <p className="text-gray text-sm">Order not found.</p>
  }

  const options = ALLOWED_TRANSITIONS[order.status] || []

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/orders')}
          className="w-9 h-9 rounded-lg border-2 border-ink flex items-center justify-center text-ink-soft hover:bg-light-gray transition"
        >
          <FiArrowLeft size={16} />
        </button>
        <div>
          <h1 className="font-bricolage font-black text-2xl text-ink">{order.order_number}</h1>
          <p className="text-gray text-sm">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <div className="ml-auto">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Status actions */}
      {options.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-ink p-4 shadow-[3px_3px_0_#120D1E] flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-ink-soft">Move to:</span>
          {options.map(s => (
            <button
              key={s}
              disabled={updating}
              onClick={() => handleStatusChange(s)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border-2 border-ink capitalize
                         bg-off-white hover:bg-violet hover:text-yellow transition disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] space-y-3">
        <h2 className="font-bricolage font-bold text-base text-ink border-b border-ink/10 pb-2">Items</h2>
        {order.items.map(item => (
          <div key={item.product_id} className="flex justify-between text-sm gap-2">
            <span className="text-ink-soft">{item.name} × {item.quantity}</span>
            <span className="font-semibold text-ink">UGX {item.subtotal_ugx.toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between font-bricolage font-bold text-lg border-t-2 border-ink pt-3">
          <span>Total</span>
          <span className="text-violet">UGX {order.total_ugx.toLocaleString()}</span>
        </div>
      </div>

      {/* Customer */}
      <div className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] space-y-2 text-sm">
        <h2 className="font-bricolage font-bold text-base text-ink border-b border-ink/10 pb-2 mb-1">
          Customer & delivery
        </h2>
        <p><strong className="text-ink">Name:</strong> <span className="text-ink-soft">{order.customer.name}</span></p>
        <p className="flex items-center gap-2 flex-wrap">
          <strong className="text-ink">WhatsApp:</strong> <span className="text-ink-soft">{order.customer.whatsapp}</span>
          <a
            href={waLink(order.customer.whatsapp, `Hi ${order.customer.name}, this is novaXchange regarding your order ${order.order_number}.`)}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline"
          >
            <FiMessageCircle size={12} /> Message on WhatsApp
          </a>
        </p>
        <p><strong className="text-ink">Email:</strong> <span className="text-ink-soft">{order.customer.email}</span></p>
        <p><strong className="text-ink">Address:</strong> <span className="text-ink-soft">{order.customer.address}</span></p>
        {order.customer.landmark && (
          <p><strong className="text-ink">Point of reference:</strong> <span className="text-ink-soft">{order.customer.landmark}</span></p>
        )}
        {order.customer.recipient_name && (
          <p><strong className="text-ink">Recipient:</strong> <span className="text-ink-soft">{order.customer.recipient_name}</span></p>
        )}
        {order.customer.notes && (
          <p><strong className="text-ink">Notes:</strong> <span className="text-ink-soft">{order.customer.notes}</span></p>
        )}
      </div>

      {/* Status history */}
      <div className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E]">
        <h2 className="font-bricolage font-bold text-base text-ink border-b border-ink/10 pb-2 mb-3">
          Status history
        </h2>
        <div className="space-y-2">
          {order.status_history.map((event, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="capitalize font-semibold text-ink">{event.status}</span>
              <span className="text-gray text-xs">
                {new Date(event.at).toLocaleString()} · {event.by}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
