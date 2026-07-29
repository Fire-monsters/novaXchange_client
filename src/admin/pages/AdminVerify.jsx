import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { verifyAdminEmail } from '../../api/catalog'

export default function AdminVerify() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token.')
      return
    }

    verifyAdminEmail(token)
      .then((res) => {
        setStatus('success')
        setMessage(res.message || 'Your email is verified. You can now sign in.')
        setTimeout(() => navigate('/admin/login'), 2500)
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err.message || 'Verification failed.')
      })
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl border-2 border-ink bg-white p-8 shadow-[6px_6px_0_#FFE033]">
        <div className="mb-6 flex items-center justify-center">
          {status === 'success' ? <FiCheckCircle className="text-green-600" size={44} /> : <FiAlertCircle className="text-violet" size={44} />}
        </div>
        <h1 className="mb-2 text-center font-bricolage text-2xl font-black text-ink">Email verification</h1>
        <p className="text-center text-sm text-ink-soft">{message || 'Verifying your admin account…'}</p>
      </motion.div>
    </div>
  )
}
