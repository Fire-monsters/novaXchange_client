/**
 * CheckoutPage.jsx
 * ──────────────────────────────────────────────────────────────────
 * Route: /checkout
 * Replaces the old WhatsApp-only checkout. Collects customer details,
 * submits the cart to the server-authoritative orders endpoint (price
 * and stock are re-validated from MongoDB, never trusted from here),
 * then navigates to the order status page. Guest checkout is the
 * default — no login required at any step.
 * ──────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiShoppingBag, FiCheck } from 'react-icons/fi'

import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import { useCart } from '../context/CartContext'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import { createOrder } from '../api/orders'

const Field = ({ label, required, children, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-ink-soft">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
)

const inputCls = `w-full px-3 py-2.5 border-2 border-ink/20 rounded-lg text-sm bg-white
  focus:outline-none focus:border-violet transition-colors text-ink`

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalUGX, clearCart } = useCart()
  const { user } = useCustomerAuth()

  const [form, setForm] = useState({
    name: '', whatsapp: '', email: '', address: '', notes: '',
  })
  const [errors, setErrors]           = useState({})
  const [submitting, setSubmitting]   = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Prefill from the logged-in customer's saved profile — guest checkout
  // (no user) is unaffected and starts from a blank form as before.
  useEffect(() => {
    if (!user) return
    setForm(f => ({
      ...f,
      name: f.name || user.name || '',
      whatsapp: f.whatsapp || user.whatsapp || '',
      email: f.email || user.email || '',
      address: f.address || user.delivery_address || '',
    }))
  }, [user])

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name = 'Name is required'
    if (!form.whatsapp.trim()) e.whatsapp = 'WhatsApp number is required'
    if (!form.email.trim())    e.email = 'Email is required'
    if (!form.address.trim())  e.address = 'Delivery address is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0 || !validate()) return

    setSubmitting(true)
    setSubmitError('')
    try {
      const order = await createOrder({
        customer: {
          name: form.name.trim(),
          whatsapp: form.whatsapp.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          notes: form.notes.trim() || null,
        },
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
      })
      clearCart()
      navigate(`/orders/${order.order_number}?contact=${encodeURIComponent(form.email.trim())}`)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-off-white">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 pt-32 pb-20 text-center">
          <FiShoppingBag size={40} className="mx-auto mb-4 text-gray/40" />
          <h1 className="font-bricolage font-black text-2xl text-ink mb-2">Your cart is empty</h1>
          <p className="text-gray mb-6">Add some products before checking out.</p>
          <Link to="/accessories" className="inline-block bg-violet text-yellow font-bricolage font-bold
                                              px-6 py-3 rounded-xl border-2 border-ink shadow-[3px_3px_0_#120D1E]">
            Browse products
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-lg border-2 border-ink flex items-center justify-center text-ink-soft hover:bg-light-gray transition"
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-bricolage font-black text-2xl text-ink">Checkout</h1>
            <p className="text-gray text-sm">Cash on delivery — pay when your order arrives</p>
          </div>
        </div>

        {!user && (
          <p className="text-sm text-gray mb-5">
            Checking out as a guest.{' '}
            <Link to="/account/login" className="text-violet font-semibold hover:underline">
              Sign in
            </Link>{' '}
            to prefill your details — an account is never required.
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] space-y-4"
          >
            <Field label="Full name" required error={errors.name}>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className={`${inputCls} ${errors.name ? 'border-red-400' : ''}`}
              />
            </Field>

            <Field label="WhatsApp number" required error={errors.whatsapp}>
              <input
                value={form.whatsapp}
                onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                placeholder="07XXXXXXXX"
                className={`${inputCls} ${errors.whatsapp ? 'border-red-400' : ''}`}
              />
            </Field>

            <Field label="Email" required error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className={`${inputCls} ${errors.email ? 'border-red-400' : ''}`}
              />
            </Field>

            <Field label="Delivery address" required error={errors.address}>
              <input
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="e.g. Kampala, Makerere"
                className={`${inputCls} ${errors.address ? 'border-red-400' : ''}`}
              />
            </Field>

            <Field label="Delivery notes (optional)">
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3}
                placeholder="Landmark, preferred time, etc."
                className={`${inputCls} resize-y`}
              />
            </Field>

            {submitError && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {submitError}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ x: -1, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-violet text-yellow
                         font-bricolage font-bold py-4 rounded-xl border-2 border-ink
                         shadow-[4px_4px_0_#120D1E] hover:shadow-[5px_5px_0_#120D1E] transition-all
                         disabled:opacity-60"
            >
              {submitting ? 'Placing order…' : `Place order — UGX ${totalUGX.toLocaleString()}`}
            </motion.button>
          </form>

          {/* Order summary */}
          <div className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] h-fit space-y-3">
            <h2 className="font-bricolage font-bold text-base text-ink border-b border-ink/10 pb-2">
              Order summary
            </h2>
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm gap-2">
                <span className="text-ink-soft line-clamp-1">{item.name} × {item.quantity}</span>
                <span className="font-semibold text-ink flex-shrink-0">
                  UGX {(item.price_ugx * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bricolage font-bold text-lg border-t-2 border-ink pt-3">
              <span>Total</span>
              <span className="text-violet">UGX {totalUGX.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray flex items-start gap-1.5 pt-2">
              <FiCheck size={12} className="flex-shrink-0 mt-0.5 text-green-500" />
              Cash on Delivery — no payment needed now
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
