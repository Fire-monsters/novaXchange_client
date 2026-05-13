import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi'

/**
 * Hero section with video background, rotating circle, and floating cards.
 * Uses Framer Motion for animations. Video background is optional (fallback to gradient).
 */
const Hero = () => {
  const floatingCards = [
    { label: 'Genuine Gear', icon: '', style: 'top-[25%] left-[25%]' },
    { label: 'Secure Trade-In', icon: '', style: 'top-[5%] right-[5%]' },
    { label: 'Campus Delivery', icon: '', style: 'bottom-[5%] left-[5%]' },
    { label: 'Instant Valuation', icon: '', style: 'bottom-[5%] right-[5%]' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://via.placeholder.com/1920x1080?text=novaXchange"
        >
          <source src="/video-bg.mp4" type="video/mp4" />
          {/* Fallback gradient if video not available */}
        </video>
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay for readability */}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-yellow/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-yellow rounded-full animate-pulse" />
            <span className="text-yellow text-sm font-semibold">Student-First Tech Hub</span>
          </div>
          <h1 className="font-bricolage text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight">
            Turn Your Slow Device <br />
            <span className="bg-gradient-to-r from-yellow to-yellow-deep bg-clip-text text-transparent">
              Into Instant Upgrade
            </span>
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-white/80">
            Trade-in, clean, accessorize, and level up your workspace. Built for Ugandan students and young professionals.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="#lead-capture" className="btn-primary">
              Start Trade-In <FiArrowRight />
            </a>
            <a href="#solutions" className="btn-secondary bg-transparent text-white border-white shadow-none hover:bg-white/10">
              Explore Services <FiShoppingBag />
            </a>
          </div>
        </motion.div>

        {/* Animated Rotating Circle with Cards */}
        <div className="relative w-full max-w-3xl mx-auto mt-16 h-[400px] md:h-[500px]">

          {/* Rotating outer ring with cards */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {floatingCards.map((card, idx) => (
              <motion.div
                key={idx}
                className={`absolute ${card.style} bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 w-36 text-center shadow-xl`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
              >
                <span className="text-2xl">{card.icon}</span>
                <p className="text-white text-sm font-semibold mt-1">{card.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Center Logo */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-yellow to-violet rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="font-bricolage font-black text-2xl md:text-3xl text-ink">novaX</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero