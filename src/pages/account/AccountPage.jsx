import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiPhone, FiMapPin, FiLogOut, FiCheck, FiPackage } from 'react-icons/fi'

import Navbar from '../../components/ui/Navbar'
import Footer from '../../components/ui/Footer'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import { getMyOrders } from '../../api/orders'

const inputCls = `w-full px-3 py-2.5 border-2 border-ink/20 rounded-lg text-sm bg-white
  focus:outline-none focus:border-violet transition-colors text-ink`

export default function AccountPage() {
  const navigate = useNavigate()
  const { user, updateProfile, logout } = useCustomerAuth()

  const [form, setForm] = useState({
    name: user?.name || '',
    whatsapp: user?.whatsapp || '',
    delivery_address: user?.delivery_address || '',
  })
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  const [orders, setOrders]   = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    getMyOrders().then(setOrders).catch(() => {}).finally(() => setOrdersLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateProfile(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-16 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bricolage font-black text-2xl text-ink">My account</h1>
            <p className="text-gray text-sm">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray hover:text-red-600 transition"
          >
            <FiLogOut size={14} /> Sign out
          </button>
        </div>

        {/* Profile */}
        <form
          onSubmit={handleSave}
          className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] space-y-4"
        >
          <h2 className="font-bricolage font-bold text-base text-ink border-b border-ink/10 pb-2">
            Profile & delivery details
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink-soft flex items-center gap-1.5">
              <FiUser size={13} /> Name
            </label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink-soft flex items-center gap-1.5">
              <FiPhone size={13} /> WhatsApp number
            </label>
            <input
              value={form.whatsapp}
              onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
              placeholder="07XXXXXXXX"
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink-soft flex items-center gap-1.5">
              <FiMapPin size={13} /> Delivery address
            </label>
            <input
              value={form.delivery_address}
              onChange={e => setForm(f => ({ ...f, delivery_address: e.target.value }))}
              placeholder="e.g. Kampala, Makerere"
              className={inputCls}
            />
            <p className="text-xs text-gray">Used to prefill checkout next time you order.</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-violet text-yellow
                       font-bricolage font-bold py-3 rounded-xl border-2 border-ink
                       shadow-[3px_3px_0_#120D1E] disabled:opacity-60 transition-all"
          >
            {saved ? <><FiCheck size={15} /> Saved</> : saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>

        {/* Order history */}
        <div className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E]">
          <h2 className="font-bricolage font-bold text-base text-ink border-b border-ink/10 pb-2 mb-3">
            My orders
          </h2>

          {ordersLoading ? (
            <p className="text-gray text-sm">Loading…</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-6">
              <FiPackage size={28} className="mx-auto mb-2 text-gray/30" />
              <p className="text-gray text-sm">No orders yet</p>
              <Link to="/accessories" className="text-violet text-sm font-medium hover:underline">
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map(order => (
                <Link
                  key={order.id}
                  to={`/orders/${order.order_number}?contact=${encodeURIComponent(order.customer.email)}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-ink/10 hover:border-violet/40 hover:bg-violet-pale/20 transition"
                >
                  <div>
                    <p className="font-semibold text-sm text-ink">{order.order_number}</p>
                    <p className="text-xs text-gray">
                      UGX {order.total_ugx.toLocaleString()} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} size="sm" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
