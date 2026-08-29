/**
 * OrderSuccessPage.jsx
 * ──────────────────────────────────────────────────────────────────
 * Route: /orders/:orderNumber/success
 * Landed on right after CheckoutPage places an order — the order data
 * comes in via router state (no extra lookup round-trip needed, since
 * CheckoutPage already has it from createOrder()'s response). If
 * someone opens this URL directly (refresh, bookmark) with no state,
 * fall back to the guest order-lookup page instead of rendering a
 * broken success screen.
 * ──────────────────────────────────────────────────────────────────
 */

import React from 'react'
import { useParams, useLocation, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiMail, FiPackage } from 'react-icons/fi'

export default function OrderSuccessPage() {
  const { orderNumber } = useParams()
  const location = useLocation()
  const order   = location.state?.order
  const contact = location.state?.contact

  if (!order) {
    return <Navigate to={`/orders/${orderNumber}`} replace />
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-12 pb-20 text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <FiCheckCircle size={56} className="mx-auto mb-4 text-green-500" />
      </motion.div>

      <h1 className="font-bricolage font-black text-2xl text-ink mb-1">Order placed successfully</h1>
      <p className="text-gray text-sm mb-6">Thank you for your order — we'll get it ready for delivery.</p>

      <div className="bg-white rounded-xl border-2 border-ink p-5 shadow-[4px_4px_0_#120D1E] text-left space-y-4">
        <div className="text-center border-b border-ink/10 pb-4">
          <p className="text-gray text-xs uppercase tracking-widest font-semibold mb-1">Order number</p>
          <p className="font-bricolage font-black text-xl text-violet">{order.order_number}</p>
        </div>

        <div className="space-y-1.5 text-sm">
          {order.items.map(item => (
            <div key={item.product_id} className="flex justify-between gap-2">
              <span className="text-ink-soft line-clamp-1">{item.name} × {item.quantity}</span>
              <span className="font-semibold text-ink flex-shrink-0">UGX {item.subtotal_ugx.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between font-bricolage font-bold border-t-2 border-ink pt-2 mt-2">
            <span>Total</span>
            <span className="text-violet">UGX {order.total_ugx.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-off-white rounded-lg p-3 text-sm text-ink-soft space-y-1">
          <p><strong className="text-ink">Delivering to:</strong> {order.customer.address}</p>
          {order.customer.landmark && <p><strong className="text-ink">Point of reference:</strong> {order.customer.landmark}</p>}
          <p><strong className="text-ink">Contact:</strong> {order.customer.whatsapp}</p>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-gray justify-center pt-1">
          <FiMail size={12} /> Check your email for your order details
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Link
          to={`/orders/${order.order_number}${contact ? `?contact=${encodeURIComponent(contact)}` : ''}`}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-ink font-semibold
                     py-3 rounded-xl border-2 border-ink shadow-[3px_3px_0_#120D1E] hover:border-violet hover:text-violet transition"
        >
          <FiPackage size={15} /> View order status
        </Link>
        <Link
          to="/accessories"
          className="flex-1 flex items-center justify-center gap-2 bg-violet text-yellow font-bricolage font-bold
                     py-3 rounded-xl border-2 border-ink shadow-[3px_3px_0_#120D1E] hover:shadow-[4px_4px_0_#120D1E] transition"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
