import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiRefreshCw, FiZap, FiShoppingBag, FiMonitor, FiX, FiArrowRight, FiCheck } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

// ── WhatsApp number ───────────────────────────────────────────────────────────
const WA_NUMBER = '256779543595'

// ── Package data ──────────────────────────────────────────────────────────────
const packages = [
  {
    id: 'upgrade',
    icon: FiRefreshCw,
    title: 'novaUpgrade',
    subtitle: 'Trade-In & Upgrade',
    tagline: 'Turn your old device into your next one.',
    description:
      'Trade in your old gadget, top up a small amount, and upgrade to a better device without starting from scratch.',
    features: [
      'Laptop trade-ins',
      'Instant valuation',
      'Transparent pricing',
      'Student-friendly process',
      'Fast response',
    ],
    cta: 'Get Instant Estimate',
    waMessage: "Hi novaXchange! I'd like to get an instant trade-in estimate for my device.",
    gradient: 'from-violet to-pink',
    accentColor: '#6C2BD9',
    lightBg: '#EDE6FF',
    href: null, // opens modal → WhatsApp
  },
  {
    id: 'boost',
    icon: FiZap,
    title: 'novaBoost & Clean',
    subtitle: 'Performance Optimization',
    tagline: 'Make your device feel brand new again.',
    description:
      'We help clean, optimize, and improve your device performance so it works faster and better for studying, coding, design, editing, and work.',
    features: [
      'Device cleanup',
      'Speed optimization',
      'Software setup',
      'Storage cleanup',
      'Performance boosting',
    ],
    cta: 'Boost My Device',
    waMessage: "Hi novaXchange! I'd like to boost and optimize my device's performance.",
    gradient: 'from-yellow to-yellow-deep',
    accentColor: '#F5C800',
    lightBg: '#FFFBE0',
    href: null,
  },
  {
    id: 'accessories',
    icon: FiShoppingBag,
    title: 'novaAccessories',
    subtitle: 'Genuine Tech Accessories',
    tagline: 'Gear that actually lasts.',
    description:
      'Your home for trusted and genuine tech accessories that actually last and perform.',
    features: [
      'Genuine accessories',
      'Mice & keyboards',
      'Chargers & adapters',
      'Laptop bags',
      'Workspace accessories',
    ],
    cta: 'Explore Accessories',
    waMessage: null, // goes to page
    gradient: 'from-mint to-teal',
    accentColor: '#00E5C4',
    lightBg: '#E0FBF7',
    href: '/accessories', // future page
  },
  {
    id: 'workspace',
    icon: FiMonitor,
    title: 'novaWorkspace',
    subtitle: 'Workspace Setup',
    tagline: 'Build the setup that builds you.',
    description:
      'We help students and creators build clean, productive, inspiring workspaces for learning, creativity, and remote work.',
    features: [
      'Workspace setup guidance',
      'Desk accessories',
      'Productivity-focused setups',
      'Minimal workspace ideas',
      'Student workspace recommendations',
    ],
    cta: 'Build My Workspace',
    waMessage: "Hi novaXchange! I'd like help setting up my workspace.",
    gradient: 'from-orange-400 to-red-400',
    accentColor: '#FF6B2B',
    lightBg: '#FFF0E8',
    href: null,
  },
]

// ── Modal
const PackageModal = ({ pkg, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleCta = () => {
    if (pkg.href) {
      window.location.href = pkg.href
    } else {
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pkg.waMessage)}`
      window.open(url, '_blank')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal card */}
        <motion.div
          className="relative z-10 bg-white rounded-3xl border-2 border-ink shadow-[10px_10px_0_#120D1E] w-full max-w-lg overflow-hidden"
          initial={{ scale: 0.88, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        >
          {/* Header band */}
          <div className={`bg-gradient-to-r ${pkg.gradient} p-6 relative overflow-hidden`}>
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-black/10" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/35 flex items-center justify-center transition-colors text-white border border-white/20"
              aria-label="Close"
            >
              <FiX size={16} />
            </button>

            <div className="relative z-10">
              <span className="text-4xl mb-3 block">{pkg.emoji}</span>
              <div className="inline-block bg-black/20 text-white/90 text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 mb-2">
                {pkg.subtitle}
              </div>
              <h2 className="font-bricolage font-black text-3xl text-white leading-tight">
                {pkg.title}
              </h2>
              <p className="text-white/75 text-sm mt-1 font-medium">{pkg.tagline}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-ink-soft text-sm leading-relaxed mb-5">{pkg.description}</p>

            {/* Features */}
            <div className="mb-6">
              <p className="font-bricolage font-bold text-xs uppercase tracking-widest text-gray mb-3">
                What's included
              </p>
              <ul className="space-y-2">
                {pkg.features.map((feat, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-3 text-sm text-ink-soft"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.15 }}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: pkg.lightBg, border: `1.5px solid ${pkg.accentColor}` }}
                    >
                      <FiCheck size={11} style={{ color: pkg.accentColor, strokeWidth: 3 }} />
                    </span>
                    {feat}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <motion.button
              onClick={handleCta}
              className="w-full flex items-center justify-center gap-2.5 font-bricolage font-bold py-4 px-6 rounded-2xl border-2 border-ink text-base transition-all"
              style={{
                background: pkg.accentColor === '#F5C800' ? '#FFE033' : pkg.accentColor === '#00E5C4' ? '#00E5C4' : pkg.accentColor === '#FF6B2B' ? '#FF6B2B' : '#6C2BD9',
                color: pkg.accentColor === '#F5C800' || pkg.accentColor === '#00E5C4' ? '#120D1E' : '#FFE033',
                boxShadow: '4px 4px 0 #120D1E',
              }}
              whileHover={{ x: -2, y: -2, boxShadow: '6px 6px 0 #120D1E' }}
              whileTap={{ scale: 0.97 }}
            >
              {pkg.href ? (
                <>
                  {pkg.cta} <FiArrowRight size={16} />
                </>
              ) : (
                <>
                  <FaWhatsapp size={18} />
                  {pkg.cta}
                  <FiArrowRight size={16} />
                </>
              )}
            </motion.button>

            {!pkg.href && (
              <p className="text-center text-gray text-xs mt-3 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Opens WhatsApp — we reply within 30 mins
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Solutions section ─────────────────────────────────────────────────────────
const Solutions = () => {
  const [activeModal, setActiveModal] = useState(null)
  const activePkg = packages.find((p) => p.id === activeModal)

  return (
    <>
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
              <motion.button
                key={idx}
                onClick={() => setActiveModal(pkg.id)}
                className="relative group bg-off-white border-2 border-ink rounded-2xl p-6 shadow-[4px_4px_0_#120D1E] hover:shadow-[8px_8px_0_#6C2BD9] transition-all duration-300 hover:-translate-y-2 overflow-hidden text-left w-full"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${pkg.gradient}`} />
                <span className="text-3xl mb-3 block">{pkg.emoji}</span>
                <pkg.icon className="text-4xl text-violet mb-4" />
                <h3 className="font-bricolage font-bold text-xl mb-1">{pkg.title}</h3>
                <p className="text-xs text-gray font-semibold uppercase tracking-wide mb-2">{pkg.subtitle}</p>
                <p className="text-gray text-sm mb-4">{pkg.description}</p>
                <span className="inline-flex items-center gap-1 text-violet font-semibold text-sm group-hover:gap-2 transition-all">
                  Learn more →
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {activePkg && (
          <PackageModal
            pkg={activePkg}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Solutions