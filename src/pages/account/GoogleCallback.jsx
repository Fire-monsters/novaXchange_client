/**
 * GoogleCallback.jsx
 * ──────────────────────────────────────────────────────────────────
 * Route: /account/google-callback
 *
 * Landing point after Supabase's Google OAuth redirect. Exchanges the
 * Supabase session for our own customer_jwt (via loginWithGoogle), then
 * — mirroring CustomerRegister's WhatsApp field — asks for a WhatsApp
 * number if this profile doesn't have one yet.
 * ──────────────────────────────────────────────────────────────────
 */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPhone, FiArrowRight, FiAlertCircle } from 'react-icons/fi'

import { supabase } from '../../lib/supabaseClient'
import { useCustomerAuth } from '../../context/CustomerAuthContext'

// Where GoogleAuthButton stashed the post-login destination, since the
// Supabase hosted redirect can't carry our own query params through the
// round-trip. Read once and clear so it doesn't leak into a later visit.
const takeNextDestination = () => {
  const next = sessionStorage.getItem('nxc_auth_next')
  sessionStorage.removeItem('nxc_auth_next')
  return next || '/account'
}

export default function GoogleCallback() {
  const navigate = useNavigate()
  const { loginWithGoogle, updateProfile } = useCustomerAuth()

  const [status, setStatus]     = useState('working') // working | needsWhatsapp | error
  const [error, setError]       = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    const run = async () => {
      if (!supabase) {
        setError('Google sign-in is not configured yet.')
        setStatus('error')
        return
      }
      try {
        const { data, error: sessionError } = await supabase.auth.getSession()
        if (sessionError || !data.session) {
          throw new Error(sessionError?.message || 'No Google session found')
        }
        const profile = await loginWithGoogle(data.session.access_token)
        if (profile.whatsapp) {
          navigate(takeNextDestination(), { replace: true })
        } else {
          setStatus('needsWhatsapp')
        }
      } catch (err) {
        setError(err.message || 'Google sign-in failed')
        setStatus('error')
      }
    }
    run()
    // Run once on mount — the Supabase session is only present in the URL/storage this one time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSaveWhatsapp = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateProfile({ whatsapp: whatsapp.trim() || null })
      navigate(takeNextDestination(), { replace: true })
    } catch (err) {
      setError(err.message || 'Could not save WhatsApp number')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 pt-12 pb-20">
        {status === 'working' && (
          <div className="text-center pt-10">
            <div className="w-8 h-8 border-4 border-violet border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray text-sm">Finishing Google sign-in…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-2xl border-2 border-ink shadow-[5px_5px_0_#120D1E] p-6 text-center">
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg mb-4 text-left">
              <FiAlertCircle size={14} className="flex-shrink-0" /> {error}
            </div>
            <button
              onClick={() => navigate('/account/login')}
              className="text-violet font-semibold text-sm hover:underline"
            >
              Back to sign in
            </button>
          </div>
        )}

        {status === 'needsWhatsapp' && (
          <>
            <h1 className="font-bricolage font-black text-2xl text-ink text-center mb-1">One more thing</h1>
            <p className="text-gray text-sm text-center mb-6">
              What's your WhatsApp number? We'll use it for order updates.
            </p>

            <div className="bg-white rounded-2xl border-2 border-ink shadow-[5px_5px_0_#120D1E] p-6">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg mb-4">
                  <FiAlertCircle size={14} className="flex-shrink-0" /> {error}
                </div>
              )}

              <form onSubmit={handleSaveWhatsapp} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ink-soft mb-1.5">
                    WhatsApp number <span className="text-gray font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <FiPhone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
                    <input
                      autoFocus
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="07XXXXXXXX"
                      className="w-full pl-9 pr-3 py-2.5 border-2 border-ink/20 rounded-lg text-sm
                                 focus:outline-none focus:border-violet transition-colors"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ x: -1, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 bg-violet text-yellow
                             font-bricolage font-bold py-3 rounded-xl border-2 border-ink
                             shadow-[4px_4px_0_#120D1E] hover:shadow-[5px_5px_0_#120D1E]
                             transition-all disabled:opacity-60 mt-2"
                >
                  {saving ? 'Saving…' : <> Continue <FiArrowRight size={15} /> </>}
                </motion.button>
              </form>
            </div>

            <button
              onClick={() => navigate(takeNextDestination(), { replace: true })}
              className="w-full text-center text-gray text-sm mt-4 hover:text-ink transition"
            >
              Skip for now
            </button>
          </>
        )}
      </div>
  )
}
