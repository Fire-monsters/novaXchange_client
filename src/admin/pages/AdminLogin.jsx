import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiArrowRight, FiAlertCircle } from 'react-icons/fi'
import { adminLogin, saveToken } from '../../api/catalog'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await adminLogin(form.email, form.password)
      saveToken(res.access_token)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow to-violet border-2 border-yellow/30 flex items-center justify-center mx-auto mb-4">
            <span className="font-black text-ink text-xl">N</span>
          </div>
          <h1 className="font-bricolage font-black text-2xl text-white">
            nova<span className="text-yellow">X</span>change
          </h1>
          <p className="text-white/40 text-sm mt-1">Admin panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border-2 border-ink shadow-[6px_6px_0_#FFE033] p-6">
          <h2 className="font-bricolage font-bold text-xl text-ink mb-5">Sign in</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg mb-4">
              <FiAlertCircle size={14} className="flex-shrink-0" />
              {error}
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
                  placeholder="admin@novaxchange.xyz"
                  className="w-full pl-9 pr-3 py-2.5 border-2 border-ink rounded-lg text-sm
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
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border-2 border-ink rounded-lg text-sm
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
                         transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-yellow border-t-transparent rounded-full animate-spin" />
              ) : (
                <> Sign in <FiArrowRight size={15} /> </>
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          novaXchange admin · {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  )
}