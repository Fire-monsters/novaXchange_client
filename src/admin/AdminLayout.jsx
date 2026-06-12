/**
 * AdminLayout.jsx
 * Responsive sidebar + topbar.
 * On mobile: sidebar is a slide-in drawer toggled by a hamburger.
 * On desktop: sidebar is always visible (240px fixed).
 */
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid, FiPackage, FiUploadCloud, FiTag,
  FiShoppingCart, FiUsers, FiRefreshCw,
  FiSettings, FiLogOut, FiMenu, FiX, FiBell,
  FiPlus,
} from 'react-icons/fi'
import { clearToken } from '../api/catalog'
import { useCart } from '../context/CartContext'

const NAV = [
  { section: 'Overview' },
  { label: 'Dashboard',       href: '/admin',              icon: FiGrid },
  { section: 'Catalog' },
  { label: 'Products',        href: '/admin/products',     icon: FiPackage },
  { label: 'Upload product',  href: '/admin/products/upload', icon: FiUploadCloud },
  { label: 'Categories',      href: '/admin/categories',   icon: FiTag },
  { section: 'Commerce' },
  { label: 'Orders',          href: '/admin/orders',       icon: FiShoppingCart },
  { label: 'Customers',       href: '/admin/customers',    icon: FiUsers },
  { section: 'Trade-ins' },
  { label: 'Submissions',     href: '/admin/trade-ins',    icon: FiRefreshCw },
]

const NavItem = ({ item, active, onClick }) => (
  <Link
    to={item.href}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2 text-sm font-medium transition-all
      ${active
        ? 'bg-violet text-yellow shadow-[2px_2px_0_#120D1E]'
        : 'text-ink-soft hover:bg-violet-pale hover:text-violet'}`}
  >
    <item.icon size={16} className="flex-shrink-0" />
    {item.label}
  </Link>
)

const Sidebar = ({ onClose }) => {
  const location = useLocation()
  const navigate  = useNavigate()

  const handleLogout = () => {
    clearToken()
    navigate('/admin/login')
  }

  return (
    <div className="flex flex-col h-full bg-white border-r-2 border-ink w-60">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b-2 border-ink">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow to-violet flex items-center justify-center">
            <span className="text-ink font-black text-xs">N</span>
          </div>
          <span className="font-bricolage font-bold text-base">
            nova<span className="text-violet">X</span>
            <span className="text-gray text-sm font-normal"> admin</span>
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray hover:text-ink lg:hidden">
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
        {NAV.map((item, i) => {
          if (item.section) {
            return (
              <p key={i} className="px-4 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray">
                {item.section}
              </p>
            )
          }
          const active = item.href === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.href)
          return (
            <NavItem
              key={item.href}
              item={item}
              active={active}
              onClick={onClose}
            />
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t-2 border-ink py-3 space-y-0.5">
        <Link
          to="/admin/settings"
          className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium text-ink-soft hover:bg-light-gray transition"
        >
          <FiSettings size={16} /> Settings
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 mx-0 rounded-none text-sm font-medium
                     text-gray hover:text-red-600 hover:bg-red-50 transition text-left pl-6"
        >
          <FiLogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  )
}

export function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-light-gray flex" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {/* Desktop sidebar */}
      <div className="hidden lg:block flex-shrink-0 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-ink/50"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="relative z-10 h-full"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b-2 border-ink px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg border border-ink/20 flex items-center justify-center text-ink hover:bg-light-gray"
            >
              <FiMenu size={18} />
            </button>
            <h1 className="font-bricolage font-bold text-base text-ink hidden sm:block">
              Admin panel
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-lg border border-ink/20 flex items-center justify-center text-ink-soft hover:bg-light-gray">
              <FiBell size={16} />
            </button>
            <button
              onClick={() => navigate('/admin/products/upload')}
              className="flex items-center gap-1.5 bg-violet text-yellow text-sm font-bold
                         px-3 py-2 rounded-lg border-2 border-ink shadow-[2px_2px_0_#120D1E]
                         hover:shadow-[3px_3px_0_#120D1E] hover:-translate-x-px hover:-translate-y-px transition-all"
            >
              <FiPlus size={14} /> Add product
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}