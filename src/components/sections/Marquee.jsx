import React from 'react'
import { motion } from 'framer-motion'

const marqueeItems = [
  'Trade-In', 'Genuine Accessories', 'Campus Delivery', 'Secure Swap',
  'Instant Valuation', 'Student Discounts', 'Workspace Setup', 'Performance Boost',
]

const Marquee = () => {
  return (
    <div className="bg-violet py-3 border-y-2 border-ink overflow-hidden">
      <div className="flex whitespace-nowrap">
        
        <motion.div
          className="flex gap-8"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="text-yellow font-bricolage font-bold text-sm md:text-base tracking-wide">
              {item} ✦
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Marquee