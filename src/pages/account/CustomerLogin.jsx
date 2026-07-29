import React, { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiArrowRight, FiAlertCircle } from 'react-icons/fi'

import Navbar from '../../components/ui/Navbar'
import Footer from '../../components/ui/Footer'
import GoogleAuthButton from '../../components/ui/GoogleAuthButton'
import { useCustomerAuth } from '../../context/CustomerAuthContext'

export default function CustomerLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useCustomerAuth()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate(searchParams.get('next') || '/account')
    } catch (err) {
      setError(err.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />
      <div className="max-w-sm mx-auto px-4 pt-32 pb-20">
        <h1 className="font-bricolage font-black text-2xl text-ink text-center mb-1">Sign in</h1>
        <p className="text-gray text-sm text-center mb-6">Track orders and skip re-entering your details</p>

        <div className="bg-white rounded-2xl border-2 border-ink shadow-[5px_5px_0_#120D1E] p-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg mb-4">
              <FiAlertCircle size={14} className="flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink-soft mb-1.5">Email</label>
              <div className="relative">
                <FiMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                <input
                  type="email" required autoFocus
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 border-2 border-ink/20 rounded-lg text-sm
                             focus:outline-none focus:border-violet transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-soft mb-1.5">Password</label>
              <div className="relative">
                <FiLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                <input
                  type="password" required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 border-2 border-ink/20 rounded-lg text-sm
                             focus:outline-none focus:border-violet transition-colors"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ x: -1, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-violet text-yellow
                         font-bricolage font-bold py-3 rounded-xl border-2 border-ink
                         shadow-[4px_4px_0_#120D1E] hover:shadow-[5px_5px_0_#120D1E]
                         transition-all disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in…' : <> Sign in <FiArrowRight size={15} /> </>}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-ink/10" />
            <span className="text-xs text-gray uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-ink/10" />
          </div>
          <GoogleAuthButton label="Continue with Google" />
        </div>

        <p className="text-center text-gray text-sm mt-5">
          No account? <Link to="/account/register" className="text-violet font-semibold hover:underline">Create one</Link>
        </p>
      </div>
      <Footer />
    </div>
  )
}
