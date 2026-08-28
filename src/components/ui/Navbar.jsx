import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiUser } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useCustomerAuth } from '../../context/CustomerAuthContext'
import { NAV_ITEMS } from '../../config/navigation'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useCustomerAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Section links only exist on "/" — scroll there directly if we're
  // already home, otherwise navigate and let useHashScroll (PublicLayout)
  // finish the job once the route lands.
  const goToSection = (sectionId) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/#${sectionId}`)
    }
  }

  return (
    <nav
      className={`fixed top-4 left-4 right-4 md:top-0 md:left-0 md:right-0 max-w-7xl md:max-w-none mx-auto z-50 
        overflow-hidden rounded-3xl md:rounded-none border border-white/60 md:border-x-0 md:border-t-0 bg-white/55 
        backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 
        before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl md:before:rounded-none 
        before:bg-gradient-to-b before:from-white/65 before:via-white/20 
        before:to-white/5 before:content-[''] ${
        scrolled ? 'shadow-[0_18px_45px_rgba(18,13,30,0.18)]' : 'shadow-[0_10px_30px_rgba(18,13,30,0.12)]'
      }`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow to-violet rounded-full shadow-md flex items-center justify-center">
              <span className="text-ink font-bold text-sm">N</span>
            </div>
            <span className="font-bricolage font-extrabold text-xl tracking-tight">
              nova<span className="text-violet">X</span>change
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((link) => (
              <button
                key={link.label}
                onClick={() => goToSection(link.sectionId)}
                className="text-ink-soft font-medium hover:text-violet transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
            <Link
              to={user ? '/account' : '/account/login'}
              className="flex items-center gap-1.5 text-ink-soft font-medium hover:text-violet transition-colors duration-200"
            >
              <FiUser size={16} /> {user ? user.name.split(' ')[0] : 'Account'}
            </Link>
            <button
              onClick={() => goToSection('lead-capture')}
              className="bg-violet text-yellow font-bold px-5 py-2 rounded-full border-2 border-ink shadow-[3px_3px_0_#120D1E] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#120D1E] transition-all"
            >
              Get Estimate
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-ink focus:outline-none"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/35 bg-white/45 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-3">
              {NAV_ITEMS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => { setIsOpen(false); goToSection(link.sectionId) }}
                  className="block w-full text-left py-2 text-ink-soft font-medium hover:text-violet transition"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to={user ? '/account' : '/account/login'}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 py-2 text-ink-soft font-medium hover:text-violet transition"
              >
                <FiUser size={16} /> {user ? user.name.split(' ')[0] : 'Account'}
              </Link>
              <button
                onClick={() => { setIsOpen(false); goToSection('lead-capture') }}
                className="block w-full text-center bg-violet text-yellow font-bold py-2 rounded-full border-2 border-ink shadow-[3px_3px_0_#120D1E] mt-2"
              >
                Get Estimate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
