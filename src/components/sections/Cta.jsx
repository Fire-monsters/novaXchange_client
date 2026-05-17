import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiMessageCircle } from 'react-icons/fi'

const Cta = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-violet to-pink">

      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">
            <h2 className="font-bricolage text-3xl md:text-5xl font-bold mb-4">
            Are you!
          </h2>
          </div>

          <h2 className="font-bricolage text-3xl md:text-5xl font-bold mb-4">
            Ready to Level Up Your Tech?
          </h2>

          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Stop struggling with slow devices. Join hundreds of students who've upgraded with novaXchange.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="#lead-capture" className="bg-yellow text-ink font-bold py-3 px-6
            rounded-full inline-flex items-center gap-2
            hover:bg-yellow-deep transition shadow-lg">
              Start Trade-In <FiArrowRight />
            </a>
            <a href="https://wa.me/256700000000"
              className="bg-white/20 backdrop-blur border border-white/30
              text-white font-semibold py-3 px-6 rounded-full inline-flex items-center gap-2
              hover:bg-white/30 transition">
              <FiMessageCircle /> WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Cta