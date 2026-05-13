import React from 'react'
import { motion } from 'framer-motion'
import { FiBattery, FiShoppingBag, FiAlertCircle, FiDollarSign, FiGrid, FiUserX } from 'react-icons/fi'

const painPoints = [
  { icon: FiBattery, title: 'Poor Battery Life', desc: 'Laptops that die within an hour during lectures' },
  { icon: FiAlertCircle, title: 'Fake Accessories', desc: 'Knockoff chargers and mice that break in weeks' },
  { icon: FiDollarSign, title: 'Expensive Upgrades', desc: 'New devices cost months of savings' },
  { icon: FiGrid, title: 'Cluttered Workspace', desc: 'Messy desks kill productivity' },
  { icon: FiUserX, title: 'Unreliable Sellers', desc: 'No warranty, no trust, no support' },
  { icon: FiShoppingBag, title: 'Slow Laptops', desc: 'Struggle to run basic software' },
]

const Problem = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <section className="py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <div className="section-tag inline-block bg-violet-pale text-violet rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wide mb-3">
            The Struggle Is Real
          </div>
          <h2 className="font-bricolage text-3xl md:text-4xl font-bold">
            We know the pain of <span className="text-violet">outdated tech</span>
          </h2>
          <p className="text-gray mt-4 max-w-2xl mx-auto">
            Ugandan students face these issues every day. It's time for a better way.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {painPoints.map((point, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white p-6 rounded-2xl border-2 border-ink shadow-[4px_4px_0_#120D1E] hover:shadow-[6px_6px_0_#6C2BD9] transition-all duration-200 hover:-translate-y-1"
            >
              <point.icon className="text-violet text-3xl mb-3" />
              <h3 className="font-bold text-lg mb-1">{point.title}</h3>
              <p className="text-gray text-sm">{point.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Problem