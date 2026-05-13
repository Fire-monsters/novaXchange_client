import React from 'react'
import { motion } from 'framer-motion'
import { FiRefreshCw, FiZap, FiShoppingBag, FiMonitor } from 'react-icons/fi'

const packages = [
  {
    icon: FiRefreshCw,
    title: 'novaUpgrade',
    description: 'Trade-in your old gadget, top-up a small amount, and upgrade to a better device.',
    cta: 'Trade Now',
    href: '#lead-capture',
    gradient: 'from-violet to-pink',
  },
  {
    icon: FiZap,
    title: 'novaBoost & Clean',
    description: 'Professional device cleanup, optimization, and performance boosting.',
    cta: 'Boost My Device',
    href: '#lead-capture',
    gradient: 'from-yellow to-yellow-deep',
  },
  {
    icon: FiShoppingBag,
    title: 'novaAccessories',
    description: 'Genuine tech accessories marketplace – chargers, mice, bags, and more.',
    cta: 'Shop Now',
    href: '#lead-capture',
    gradient: 'from-mint to-teal',
  },
  {
    icon: FiMonitor,
    title: 'novaWorkspace',
    description: 'Complete workspace setup assistance – ergonomic and student-friendly.',
    cta: 'Set Up Workspace',
    href: '#lead-capture',
    gradient: 'from-orange to-red-400',
  },
]

const Solutions = () => {
  return (
    <section id="solutions" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <div className="section-tag inline-block bg-violet-pale text-violet rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wide mb-3">
            What We Offer
          </div>
          <h2 className="font-bricolage text-3xl md:text-4xl font-bold">
            Upgrade Your Tech Experience
          </h2>
          <p className="text-gray mt-4 max-w-2xl mx-auto">
            Simple packages designed for students, by people who understand your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, idx) => (
            <motion.div
              key={idx}
              className="relative group bg-off-white border-2 border-ink rounded-2xl p-6 shadow-[4px_4px_0_#120D1E] hover:shadow-[8px_8px_0_#6C2BD9] transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${pkg.gradient}`} />
              <pkg.icon className="text-4xl text-violet mb-4" />
              <h3 className="font-bricolage font-bold text-xl mb-2">{pkg.title}</h3>
              <p className="text-gray text-sm mb-4">{pkg.description}</p>
              <a
                href={pkg.href}
                className="inline-flex items-center gap-1 text-violet font-semibold text-sm group-hover:gap-2 transition-all"
              >
                {pkg.cta} →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Solutions