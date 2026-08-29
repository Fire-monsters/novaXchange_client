/**
 * CheckoutPage.jsx
 * ──────────────────────────────────────────────────────────────────
 * Route: /checkout (gated by CustomerGuard — an account is required)
 * Two-step flow within this one route: Delivery details, then Review
 * & place order. Submits to the server-authoritative orders endpoint
 * (price and stock are re-validated from MongoDB, never trusted from
 * here), then navigates to a dedicated success screen with the order
 * already in hand — no extra lookup round-trip.
 * ──────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiCheck, FiArrowLeft, FiMapPin } from 'react-icons/fi'

import { useCart } from '../context/CartContext'
import { useBuyNow } from '../context/BuyNowContext'
import { useCustomerAuth } from '../context/CustomerAuthContext'
import { createOrder } from '../api/orders'

const Field = ({ label, required, hint, children, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-ink-soft">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      {hint && <span className="text-gray font-normal ml-1.5">{hint}</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
)

const inputCls = `w-full px-3 py-2.5 border-2 border-ink/20 rounded-lg text-sm bg-white
  focus:outline-none focus:border-violet transition-colors text-ink`

const STEPS = [
  { id: 'delivery', label: 'Delivery' },
  { id: 'review',   label: 'Review & place order' },
]

const StepIndicator = ({ step }) => (
  <div className="flex items-center gap-2 mb-6 text-sm">
    <span className="flex items-center gap-1.5 text-green-600 font-semibold">
      <FiCheck size={14} /> Account
    </span>
    {STEPS.map((s, i) => (
      <React.Fragment key={s.id}>
        <span className="text-ink/20">—</span>
        <span className={`font-semibold ${step === s.id ? 'text-violet' : 'text-gray'}`}>
          {i + 1}. {s.label}
        </span>
      </React.Fragment>
    ))}
  </div>
)

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items: cartItems, totalUGX: cartTotal, clearCart } = useCart()
  const { buyNowItem, clearBuyNow } = useBuyNow()
  const { user } = useCustomerAuth()

  // Buy Now is a separate, temporary purchase intent — when present it
  // takes over checkout entirely and the cart is left untouched.
  const items = buyNowItem
    ? [{ ...buyNowItem.product, quantity: buyNowItem.quantity }]
    : cartItems
  const totalUGX = buyNowItem
    ? buyNowItem.product.price_ugx * buyNowItem.quantity
    : cartTotal

  const [step, setStep] = useState('delivery')
  const [form, setForm] = useState({
    name: '', whatsapp: '', email: '', address: '',
    landmark: '', recipientName: '', notes: '',
  })
  const [errors, setErrors]           = useState({})
  const [submitting, setSubmitting]   = useState(false)
  const [submitError, setSubmitError] = useState('')
  const submittingRef = useRef(false) // belt-and-suspenders duplicate-submit guard

  // CustomerGuard guarantees `user` is set by the time this renders —
  // prefill from the account's saved profile.
  useEffect(() => {
    if (!user) return
    setForm(f => ({
      ...f,
      name: f.name || user.name || '',
      whatsapp: f.whatsapp || user.whatsapp || '',
      email: f.email || user.email || '',
      address: f.address || user.delivery_address || '',
      recipientName: f.recipientName || user.name || '',
    }))
  }, [user])

  const validateDelivery = () => {
    const e = {}
    if (!form.name.trim())     e.name = 'Name is required'
    if (!form.whatsapp.trim()) e.whatsapp = 'WhatsApp number is required'
    if (!form.email.trim())    e.email = 'Email is required'
    if (!form.address.trim())  e.address = 'Delivery address is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = (e) => {
    e.preventDefault()
    if (!validateDelivery()) return
    setStep('review')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setStep('delivery')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlaceOrder = async () => {
    if (submittingRef.current || items.length === 0) return
    submittingRef.current = true
    setSubmitting(true)
    setSubmitError('')
    try {
      const order = await createOrder({
        customer: {
          name: form.name.trim(),
          whatsapp: form.whatsapp.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          landmark: form.landmark.trim() || null,
          recipient_name: form.recipientName.trim() || null,
          notes: form.notes.trim() || null,
        },
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
      })
      if (buyNowItem) clearBuyNow()
      else clearCart()
      navigate(`/orders/${order.order_number}/success`, {
        state: { order, contact: form.email.trim() },
      })
    } catch (err) {
      setSubmitError(err.message)
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-12 pb-20 text-center">
        <FiShoppingBag size={40} className="mx-auto mb-4 text-gray/40" />
        <h1 className="font-bricolage font-black text-2xl text-ink mb-2">Your cart is empty</h1>
        <p className="text-gray mb-6">Add some products before checking out.</p>
        <Link to="/accessories" className="inline-block bg-violet text-yellow font-bricolage font-bold
                                            px-6 py-3 rounded-xl border-2 border-ink shadow-[3px_3px_0_#120D1E]">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <div className="mb-2">
        <h1 className="font-bricolage font-black text-2xl text-ink">Checkout</h1>
        <p className="text-gray text-sm">Cash on delivery — pay when your order arrives</p>
      </div>

      <StepIndicator step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Main column */}
        {step === 'delivery' ? (
          <form
            onSubmit={handleContinue}
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

            <Field label="Point of reference" hint="(optional)">
              <input
                value={form.landmark}
                onChange={e => setForm(f => ({ ...f, landmark: e.target.value }))}
                placeholder="e.g. Near Shell Entebbe Road"
                className={inputCls}
              />
            </Field>

            <Field label="Recipient name" hint="(if different from you)">
              <input
                value={form.recipientName}
                onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))}
                className={inputCls}
              />
            </Field>

            <Field label="Delivery notes" hint="(optional)">
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3}
                placeholder="Preferred delivery time, etc."
                className={`${inputCls} resize-y`}
              />
            </Field>

            <motion.button
              type="submit"
              whileHover={{ x: -1, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-violet text-yellow
                         font-bricolage font-bold py-4 rounded-xl border-2 border-ink
                         shadow-[4px_4px_0_#120D1E] hover:shadow-[5px_5px_0_#120D1E] transition-all"
            >
              Continue to review
            </motion.button>
          </form>
        ) : (
          <div className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] space-y-5">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="w-9 h-9 rounded-lg border-2 border-ink flex items-center justify-center text-ink-soft hover:bg-light-gray transition flex-shrink-0"
                aria-label="Back to delivery details"
              >
                <FiArrowLeft size={16} />
              </button>
              <h2 className="font-bricolage font-bold text-base text-ink">Review your order</h2>
            </div>

            {/* Delivery summary */}
            <div className="bg-off-white rounded-lg p-4 space-y-1.5 text-sm">
              <p className="font-bricolage font-bold text-ink flex items-center gap-1.5 mb-2">
                <FiMapPin size={13} className="text-violet" /> Delivering to
              </p>
              <p><span className="text-ink-soft">{form.recipientName || form.name}</span> · <span className="text-ink-soft">{form.whatsapp}</span></p>
              <p className="text-ink-soft">{form.address}</p>
              {form.landmark && <p className="text-ink-soft">Point of reference: {form.landmark}</p>}
              {form.notes && <p className="text-ink-soft">Notes: {form.notes}</p>}
            </div>

            {/* Payment method */}
            <div>
              <p className="font-bricolage font-bold text-ink text-sm mb-2">Payment method</p>
              <div className="flex items-center gap-2.5 bg-violet-pale border-2 border-violet/20 rounded-lg px-3 py-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-violet flex-shrink-0" />
                <span className="text-sm font-semibold text-ink">Cash on Delivery</span>
              </div>
            </div>

            {submitError && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {submitError}
              </p>
            )}

            <motion.button
              onClick={handlePlaceOrder}
              disabled={submitting}
              whileHover={submitting ? {} : { x: -1, y: -1 }}
              whileTap={submitting ? {} : { scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-violet text-yellow
                         font-bricolage font-bold py-4 rounded-xl border-2 border-ink
                         shadow-[4px_4px_0_#120D1E] hover:shadow-[5px_5px_0_#120D1E] transition-all
                         disabled:opacity-60"
            >
              {submitting ? 'Placing order…' : `Place order — UGX ${totalUGX.toLocaleString()}`}
            </motion.button>
          </div>
        )}

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
  )
}
