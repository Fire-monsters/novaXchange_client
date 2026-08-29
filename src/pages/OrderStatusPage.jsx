/**
 * OrderStatusPage.jsx
 * ──────────────────────────────────────────────────────────────────
 * Route: /orders/:orderNumber
 * Guest-safe order tracking. Order numbers are sequential/enumerable,
 * so viewing requires the email or WhatsApp number used at checkout —
 * passed as ?contact= right after placing an order, or entered
 * manually if the page is opened cold (e.g. a bookmarked link).
 * ──────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'

import OrderStatusBadge from '../components/ui/OrderStatusBadge'
import { getOrder } from '../api/orders'

export default function OrderStatusPage() {
  const { orderNumber }        = useParams()
  const [searchParams]         = useSearchParams()
  const [contact, setContact]  = useState(searchParams.get('contact') || '')
  const [order, setOrder]      = useState(null)
  const [error, setError]      = useState('')
  const [loading, setLoading]  = useState(false)

  const lookup = (c) => {
    setLoading(true)
    setError('')
    getOrder(orderNumber, c)
      .then(setOrder)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const c = searchParams.get('contact')
    if (c) lookup(c)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (contact.trim()) lookup(contact.trim())
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-16">
        <h1 className="font-bricolage font-black text-2xl text-ink mb-1">Order {orderNumber}</h1>
        <p className="text-gray text-sm mb-6">Track your order status below</p>

        {!order && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] space-y-3"
          >
            <label className="text-sm font-semibold text-ink-soft">
              Enter the email or WhatsApp number used at checkout
            </label>
            <input
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="you@example.com or 07XXXXXXXX"
              className="w-full px-3 py-2.5 border-2 border-ink/20 rounded-lg text-sm bg-white
                         focus:outline-none focus:border-violet transition-colors text-ink"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet text-yellow font-bricolage font-bold py-3 rounded-xl
                         border-2 border-ink shadow-[3px_3px_0_#120D1E] disabled:opacity-60"
            >
              {loading ? 'Looking up…' : 'View order'}
            </button>
          </form>
        )}

        {order && (
            <div className="space-y-4">
              <OrderStatusBadge status={order.status} />

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

              <div className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] text-sm text-ink-soft space-y-1">
                <p><strong className="text-ink">Delivering to:</strong> {order.customer.address}</p>
                {order.customer.landmark && (
                  <p><strong className="text-ink">Point of reference:</strong> {order.customer.landmark}</p>
                )}
                {order.customer.recipient_name && (
                  <p><strong className="text-ink">Recipient:</strong> {order.customer.recipient_name}</p>
                )}
                <p><strong className="text-ink">Contact:</strong> {order.customer.whatsapp}</p>
              </div>

              <Link to="/accessories" className="block text-center text-violet text-sm font-medium hover:underline">
                Continue shopping
              </Link>
            </div>
        )}
      </div>
  )
}
