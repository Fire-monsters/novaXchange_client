import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'

/**
 * Fixed WhatsApp button with pulse animation.
 * Opens chat with predefined number (replace with actual).
 * Future: can be dynamic via env variable.
 */
const FloatingWhatsApp = () => {
  const phoneNumber = '256779543595' 
  const message = 'Hello novaXchange! I need help with a trade-in.'

  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <motion.button
      onClick={openWhatsApp}
      className="fixed bottom-6 right-6 z-50
      bg-green-500 text-white p-4 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-200"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <FaWhatsapp size={28} />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-300 rounded-full animate-pulseRing" />
      </div>
    </motion.button>
  )
}

export default FloatingWhatsApp