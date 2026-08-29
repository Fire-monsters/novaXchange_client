import React, { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiUser, FiMail, FiLock, FiPhone, FiArrowRight, FiAlertCircle, FiEye, FiEyeOff,
} from 'react-icons/fi'

import GoogleAuthButton from '../../components/ui/GoogleAuthButton'
import { useCustomerAuth } from '../../context/CustomerAuthContext'

export default function CustomerRegister() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register } = useCustomerAuth()

  const next = searchParams.get('next')
  const loginHref = next ? `/account/login?next=${encodeURIComponent(next)}` : '/account/login'

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', whatsapp: '',
  })
  const [errors, setErrors]           = useState({})
  const [showPassword, setShowPassword]               = useState(false)
  const [showConfirmPassword, setShowConfirmPassword]  = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        whatsapp: form.whatsapp.trim() || null,
      })
      navigate(next || '/account')
    } catch (err) {
      setError(err.message || 'Unable to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 pt-12 pb-20">
        <h1 className="font-bricolage font-black text-2xl text-ink text-center mb-1">
          {next === '/checkout' ? 'Create your account to continue' : 'Create an account'}
        </h1>
        <p className="text-gray text-sm text-center mb-6">
          {next === '/checkout' ? "Just a few details so we can deliver your order" : 'Track orders and check out faster next time'}
        </p>

        <div className="bg-white rounded-2xl border-2 border-ink shadow-[5px_5px_0_#120D1E] p-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg mb-4">
              <FiAlertCircle size={14} className="flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink-soft mb-1.5">Full name</label>
              <div className="relative">
                <FiUser size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                <input
                  required autoFocus
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 border-2 border-ink/20 rounded-lg text-sm
                             focus:outline-none focus:border-violet transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-soft mb-1.5">Email</label>
              <div className="relative">
                <FiMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 border-2 border-ink/20 rounded-lg text-sm
                             focus:outline-none focus:border-violet transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-soft mb-1.5">
                WhatsApp number <span className="text-gray font-normal">(optional)</span>
              </label>
              <div className="relative">
                <FiPhone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                <input
                  value={form.whatsapp}
                  onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                  placeholder="07XXXXXXXX"
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
                  type={showPassword ? 'text' : 'password'} required minLength={6}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className={`w-full pl-9 pr-9 py-2.5 border-2 rounded-lg text-sm
                             focus:outline-none focus:border-violet transition-colors
                             ${errors.password ? 'border-red-400' : 'border-ink/20'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-ink transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-soft mb-1.5">Confirm password</label>
              <div className="relative">
                <FiLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'} required minLength={6}
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className={`w-full pl-9 pr-9 py-2.5 border-2 rounded-lg text-sm
                             focus:outline-none focus:border-violet transition-colors
                             ${errors.confirmPassword ? 'border-red-400' : 'border-ink/20'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-ink transition"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
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
              {loading ? 'Creating account…' : <> Create account <FiArrowRight size={15} /> </>}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-ink/10" />
            <span className="text-xs text-gray uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-ink/10" />
          </div>
          <GoogleAuthButton label="Sign up with Google" next={next} />
        </div>

        <p className="text-center text-gray text-sm mt-5">
          Already have an account? <Link to={loginHref} className="text-violet font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
  )
}
