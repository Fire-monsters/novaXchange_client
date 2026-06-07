/**
 * AccessoriesPage.jsx
 * ──────────────────────────────────────────────────────────────────
 * Route: /accessories
 *
 * Features:
 *   - Search bar (name + description)
 *   - Tier filter tabs (All | Premium | Mid-range | Budget)
 *   - Category filter pills
 *   - Product grid — laptop cards + accessory cards
 *   - Product detail modal (image gallery, specs, tags, buy/cart/upgrade)
 *   - Upgrade button — LAPTOPS ONLY — opens WhatsApp trade-in flow
 *   - Delivery location banner
 *   - Fully mobile responsive
 * ──────────────────────────────────────────────────────────────────
 */

import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiX, FiShoppingCart, FiArrowRight,
  FiChevronLeft, FiChevronRight, FiMapPin,
  FiPackage, FiFilter, FiRefreshCw,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Navbar from '../components/ui/Navbar'
import Footer from '../components/ui/Footer'
import products, { CATEGORIES, TIERS, TAG_STYLES } from '../data/accessories'
import { useCart } from '../context/CartContext'

const WA_NUMBER = '256779543595'

// ─────────────────────────────────────────────────────────────────────────────
//  Delivery Banner
// ─────────────────────────────────────────────────────────────────────────────

const DeliveryBanner = ({ location, onSetLocation }) => {
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState(location || '')
  const inputRef = useRef(null)

  const save = () => {
    if (input.trim()) {
      onSetLocation(input.trim())
      setEditing(false)
    }
  }

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  return (
    <div className="bg-violet-pale border-b border-violet/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3 flex-wrap">
        <FiMapPin size={14} className="text-violet flex-shrink-0" />
        {!editing ? (
          <span className="text-sm text-ink-soft">
            Delivering to:{' '}
            <button
              onClick={() => setEditing(true)}
              className="font-semibold text-violet hover:underline"
            >
              {location || 'Set your location'}
            </button>
          </span>
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && save()}
              placeholder="e.g. Kampala, Makerere"
              className="text-sm border border-violet/30 rounded-lg px-3 py-1 bg-white text-ink
                         focus:outline-none focus:border-violet w-full max-w-xs"
            />
            <button
              onClick={save}
              className="text-xs bg-violet text-yellow font-bold px-3 py-1.5 rounded-lg"
            >
              Save
            </button>
            <button onClick={() => setEditing(false)} className="text-gray hover:text-ink">
              <FiX size={14} />
            </button>
          </div>
        )}
        <span className="text-xs text-gray ml-auto flex items-center gap-1.5">
          <FiPackage size={12} />
          Free delivery on orders over UGX 100,000
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  Product Detail Modal
// ─────────────────────────────────────────────────────────────────────────────

const ProductModal = ({ product, onClose, deliveryLocation }) => {
  const [activeImg, setActiveImg] = useState(0)
  const { addItem } = useCart()
  const isLaptop = product.category === 'laptop'
  const galleryRef = useRef(null)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleBuyNow = () => {
    const specLine = isLaptop
      ? `${product.specs.cpu} · ${product.specs.ram} · ${product.specs.storage}`
      : Object.entries(product.specs).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(' · ')

    const msg = encodeURIComponent(
      `Hi novaXchange! 🛒\n\nI'd like to buy:\n*${product.name}*\n${specLine}\nPrice: UGX ${product.price_ugx.toLocaleString()}\n\n📍 Deliver to: ${deliveryLocation || 'Kampala (will confirm address)'}\n\nPlease confirm availability!`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
  }

  const handleUpgrade = () => {
    const msg = encodeURIComponent(
      `Hi novaXchange! 🔄\n\nI'd like to *trade in* my current laptop for:\n*${product.name}* (UGX ${product.price_ugx.toLocaleString()})\n\nCan you help me with a trade-in valuation?`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
  }

  const handleAddToCart = () => {
    addItem(product)
    onClose()
  }

  const discount = product.original_price_ugx
    ? Math.round((1 - product.price_ugx / product.original_price_ugx) * 100)
    : null

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
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

      {/* Modal */}
      <motion.div
        className="relative z-10 bg-white w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto
                   rounded-t-3xl sm:rounded-3xl border-2 border-ink
                   sm:shadow-[10px_10px_0_#120D1E]"
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-light-gray border border-ink/20
                     flex items-center justify-center hover:bg-violet hover:text-yellow transition-colors"
          aria-label="Close"
        >
          <FiX size={16} />
        </button>

        {/* Image gallery */}
        <div className="relative bg-light-gray">
          {/* Main image */}
          <div className="h-[260px] sm:h-[320px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={product.images[activeImg]}
                alt={`${product.name} view ${activeImg + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>
          </div>

          {/* Thumbnail strip — only shown if multiple images */}
          {product.images.length > 1 && (
            <div
              ref={galleryRef}
              className="flex gap-2 p-3 overflow-x-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all
                    ${activeImg === i ? 'border-violet shadow-[2px_2px_0_#6C2BD9]' : 'border-ink/20 hover:border-violet/40'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Nav arrows if multiple images */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg(i => (i - 1 + product.images.length) % product.images.length)}
                className="absolute left-2 top-1/3 -translate-y-1/2 w-8 h-8 rounded-full bg-ink/50
                           text-white flex items-center justify-center hover:bg-ink transition"
                aria-label="Previous image"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={() => setActiveImg(i => (i + 1) % product.images.length)}
                className="absolute right-2 top-1/3 -translate-y-1/2 w-8 h-8 rounded-full bg-ink/50
                           text-white flex items-center justify-center hover:bg-ink transition"
                aria-label="Next image"
              >
                <FiChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${TAG_STYLES[tag] || 'bg-light-gray text-gray'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Name + price */}
          <h2 className="font-bricolage font-black text-2xl text-ink mb-1 leading-tight">
            {product.name}
          </h2>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-bricolage font-black text-3xl text-violet">
              UGX {product.price_ugx.toLocaleString()}
            </span>
            {product.original_price_ugx && (
              <>
                <span className="text-gray text-sm line-through">
                  {product.original_price_ugx.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-ink-soft text-sm leading-relaxed mb-5 whitespace-pre-line">
            {product.description}
          </p>

          {/* Specs */}
          <div className="mb-5">
            <h3 className="font-bricolage font-bold text-xs uppercase tracking-widest text-gray mb-3">
              {isLaptop ? 'Key Specifications' : 'Details'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(product.specs).map(([key, val]) => (
                <div
                  key={key}
                  className="bg-light-gray rounded-xl p-3 border border-ink/5"
                >
                  <p className="text-gray text-[10px] uppercase tracking-wide mb-0.5">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="font-semibold text-ink text-sm leading-snug">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery note */}
          {deliveryLocation && (
            <div className="flex items-center gap-2 bg-violet-pale rounded-xl p-3 mb-5 text-sm">
              <FiMapPin size={14} className="text-violet flex-shrink-0" />
              <span className="text-ink-soft">
                Delivering to <strong className="text-violet">{deliveryLocation}</strong> — confirm on WhatsApp
              </span>
            </div>
          )}

          {/* Stock warning */}
          {product.stock <= 5 && (
            <p className="text-orange-600 text-xs font-semibold mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
              Only {product.stock} left in stock
            </p>
          )}

          {/* ── Action buttons ── */}
          <div className="flex flex-col gap-3">
            {/* Buy Now → WhatsApp */}
            <motion.button
              onClick={handleBuyNow}
              whileHover={{ x: -2, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 bg-violet text-yellow
                         font-bricolage font-bold py-4 rounded-2xl border-2 border-ink
                         shadow-[4px_4px_0_#120D1E] hover:shadow-[6px_6px_0_#120D1E] transition-all text-base"
            >
              <FaWhatsapp size={18} /> Buy it now <FiArrowRight size={16} />
            </motion.button>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-white text-ink
                         font-semibold py-3.5 rounded-2xl border-2 border-ink
                         shadow-[4px_4px_0_#120D1E] hover:border-violet hover:text-violet
                         hover:shadow-[4px_4px_0_#6C2BD9] transition-all"
            >
              <FiShoppingCart size={16} /> Add to cart
            </button>

            {/* Upgrade — LAPTOPS ONLY */}
            {isLaptop && (
              <motion.button
                onClick={handleUpgrade}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 bg-yellow text-ink
                           font-semibold py-3.5 rounded-2xl border-2 border-ink
                           shadow-[4px_4px_0_#120D1E] hover:bg-yellow-deep transition-all text-sm"
              >
                <FiRefreshCw size={15} />
                Trade in your current laptop for this one
              </motion.button>
            )}
          </div>

          {/* Trust note */}
          <p className="text-center text-gray text-xs mt-4 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Genuine product · 3-month novaXchange warranty · Cash on delivery available
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  Product Card
// ─────────────────────────────────────────────────────────────────────────────

const ProductCard = ({ product, onClick }) => {
  const isLaptop = product.category === 'laptop'
  const { addItem } = useCart()

  const handleCartClick = (e) => {
    e.stopPropagation()
    addItem(product)
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4 }}
      className="group bg-white border-2 border-ink rounded-2xl overflow-hidden cursor-pointer
                 shadow-[4px_4px_0_#120D1E] hover:shadow-[8px_8px_0_#6C2BD9]
                 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-light-gray"
           style={{ height: isLaptop ? '200px' : '160px' }}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges row */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-1">
          <div className="flex flex-col gap-1">
            {product.original_price_ugx && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-fit border border-white/20">
                SALE
              </span>
            )}
            {isLaptop && (
              <span className="bg-violet text-yellow text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
                Laptop
              </span>
            )}
          </div>
          {product.stock <= 5 && (
            <span className="bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {product.stock} left
            </span>
          )}
        </div>

        {/* Upgrade badge — laptops only */}
        {isLaptop && (
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-yellow text-ink text-[10px] font-bold px-2 py-1 rounded-full
                             border border-ink flex items-center gap-1">
              <FiRefreshCw size={9} /> Trade-in available
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <p className="font-bricolage font-bold text-sm text-ink leading-snug line-clamp-2 mb-1">
            {product.name}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TAG_STYLES[tag] || 'bg-light-gray text-gray'}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Quick specs — laptops get CPU/RAM/SSD, others get first 2 specs */}
        {isLaptop ? (
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: 'CPU',  val: product.specs.cpu.split(' ').slice(0, 3).join(' ') },
              { label: 'RAM',  val: product.specs.ram },
              { label: 'SSD',  val: product.specs.storage },
            ].map(s => (
              <div key={s.label} className="bg-light-gray rounded-lg p-1.5 text-center">
                <p className="text-gray text-[9px] uppercase tracking-wide">{s.label}</p>
                <p className="font-semibold text-ink text-[10px] leading-snug">{s.val}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-0.5">
            {Object.entries(product.specs).slice(0, 2).map(([k, v]) => (
              <p key={k} className="text-[11px] text-gray">
                <span className="capitalize">{k.replace(/_/g, ' ')}</span>:{' '}
                <span className="text-ink-soft font-medium">{v}</span>
              </p>
            ))}
          </div>
        )}

        {/* Price + quick-add */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-light-gray">
          <div>
            <p className="font-bricolage font-black text-lg text-violet leading-none">
              UGX {product.price_ugx.toLocaleString()}
            </p>
            {product.original_price_ugx && (
              <p className="text-gray text-xs line-through mt-0.5">
                {product.original_price_ugx.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={handleCartClick}
            className="w-9 h-9 rounded-full bg-violet-pale text-violet border border-violet/20
                       flex items-center justify-center hover:bg-violet hover:text-yellow
                       transition-colors flex-shrink-0"
            aria-label="Add to cart"
          >
            <FiShoppingCart size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  Cart Drawer (slide in from right)
// ─────────────────────────────────────────────────────────────────────────────

const CartDrawer = ({ open, onClose }) => {
  const { items, increment, decrement, removeItem, totalUGX, clearCart } = useCart()

  const handleCheckout = () => {
    if (items.length === 0) return
    const lines = items.map(i =>
      `• ${i.name} × ${i.quantity} — UGX ${(i.price_ugx * i.quantity).toLocaleString()}`
    ).join('\n')
    const msg = encodeURIComponent(
      `Hi novaXchange! 🛒\n\nMy cart:\n${lines}\n\n*Total: UGX ${totalUGX.toLocaleString()}*\n\nPlease confirm availability and delivery details!`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 w-full max-w-sm bg-white h-full flex flex-col
                       border-l-2 border-ink shadow-[-8px_0_0_#120D1E]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b-2 border-ink">
              <div>
                <h3 className="font-bricolage font-bold text-xl">Your cart</h3>
                <p className="text-gray text-xs">{items.length} item{items.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-light-gray flex items-center justify-center
                           hover:bg-violet hover:text-yellow transition-colors border border-ink/10"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <FiShoppingCart size={40} className="text-gray/30" />
                  <p className="text-gray font-medium">Your cart is empty</p>
                  <p className="text-gray text-sm">Add some products to get started</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id}
                       className="flex gap-3 bg-off-white rounded-xl p-3 border border-ink/10">
                    <img src={item.images[0]} alt={item.name}
                         className="w-16 h-16 object-cover rounded-lg border border-ink/10 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-ink line-clamp-2 leading-snug">
                        {item.name}
                      </p>
                      <p className="font-bricolage font-bold text-violet text-sm mt-0.5">
                        UGX {(item.price_ugx * item.quantity).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => decrement(item.id)}
                                className="w-6 h-6 rounded-full bg-light-gray border border-ink/20 text-ink
                                           flex items-center justify-center text-sm font-bold hover:bg-violet hover:text-yellow transition">
                          −
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => increment(item.id)}
                                className="w-6 h-6 rounded-full bg-light-gray border border-ink/20 text-ink
                                           flex items-center justify-center text-sm font-bold hover:bg-violet hover:text-yellow transition">
                          +
                        </button>
                        <button onClick={() => removeItem(item.id)}
                                className="ml-auto text-gray hover:text-red-500 transition">
                          <FiX size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t-2 border-ink space-y-3">
                <div className="flex justify-between font-bricolage font-bold text-lg">
                  <span>Total</span>
                  <span className="text-violet">UGX {totalUGX.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-violet text-yellow
                             font-bricolage font-bold py-4 rounded-2xl border-2 border-ink
                             shadow-[4px_4px_0_#120D1E] hover:shadow-[6px_6px_0_#120D1E] transition-all"
                >
                  <FaWhatsapp size={18} /> Checkout via WhatsApp
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-gray hover:text-red-500 transition py-1"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────────────────────────────────────

const AccessoriesPage = () => {
  const [search, setSearch]           = useState('')
  const [activeTier, setActiveTier]   = useState('all')
  const [activeCategory, setCategory] = useState('all')
  const [selectedProduct, setSelected]= useState(null)
  const [cartOpen, setCartOpen]       = useState(false)
  const [deliveryLoc, setDeliveryLoc] = useState(() =>
    localStorage.getItem('nxc_delivery_loc') || ''
  )
  const { totalCount } = useCart()

  // Persist delivery location
  useEffect(() => {
    if (deliveryLoc) localStorage.setItem('nxc_delivery_loc', deliveryLoc)
  }, [deliveryLoc])

  // Filter logic
  const filtered = useMemo(() => {
    let list = [...products]
    if (activeTier !== 'all')     list = list.filter(p => p.tier === activeTier)
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [search, activeTier, activeCategory])

  const laptops     = filtered.filter(p => p.category === 'laptop')
  const accessories = filtered.filter(p => p.category !== 'laptop')

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <DeliveryBanner location={deliveryLoc} onSetLocation={setDeliveryLoc} />

      {/* ── Page header ── */}
      <div className="bg-white border-b-2 border-ink pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-block bg-violet-pale text-violet rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide mb-2">
                novaAccessories
              </div>
              <h1 className="font-bricolage font-black text-3xl md:text-4xl text-ink">
                Laptops & Accessories
              </h1>
              <p className="text-gray mt-1 text-sm">
                {products.length} genuine products · Campus delivery · Trade-in available
              </p>
            </div>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-ink text-white font-semibold
                         py-2.5 px-5 rounded-full border-2 border-ink hover:bg-violet transition-colors
                         self-start sm:self-auto"
            >
              <FiShoppingCart size={16} />
              Cart
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-yellow text-ink
                                 text-[10px] font-black flex items-center justify-center border border-ink">
                  {totalCount}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-5 max-w-lg">
            <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search laptops, mice, keyboards…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-ink text-sm bg-off-white
                         focus:outline-none focus:border-violet transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-ink"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Tier tabs */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {TIERS.map(tier => (
              <button
                key={tier.id}
                onClick={() => setActiveTier(tier.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all
                  ${activeTier === tier.id
                    ? 'bg-violet text-yellow border-ink shadow-[3px_3px_0_#120D1E]'
                    : 'bg-white text-ink-soft border-ink/20 hover:border-violet hover:text-violet'}`}
              >
                {tier.label}
              </button>
            ))}
          </div>

          {/* Category pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${activeCategory === cat.id
                    ? 'bg-ink text-yellow border-ink'
                    : 'bg-off-white text-gray border-ink/15 hover:border-ink/40 hover:text-ink'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray">
            Showing <strong className="text-ink">{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
            {(search || activeTier !== 'all' || activeCategory !== 'all') && (
              <button
                onClick={() => { setSearch(''); setActiveTier('all'); setCategory('all') }}
                className="ml-2 text-violet hover:underline font-medium"
              >
                Clear filters
              </button>
            )}
          </p>
          <span className="text-xs text-gray hidden sm:flex items-center gap-1.5">
            <FiFilter size={11} /> Click any product for full details
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="text-5xl">🔍</div>
            <h3 className="font-bricolage font-bold text-xl text-ink">No products found</h3>
            <p className="text-gray text-sm max-w-xs">
              Try different search terms or clear your filters.
            </p>
            <button
              onClick={() => { setSearch(''); setActiveTier('all'); setCategory('all') }}
              className="btn-secondary mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Laptops section */}
            {laptops.length > 0 && (activeCategory === 'all' || activeCategory === 'laptop') && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="font-bricolage font-bold text-xl text-ink">Laptops</h2>
                  <span className="text-xs text-gray bg-light-gray px-2.5 py-1 rounded-full border border-ink/10">
                    {laptops.length} available
                  </span>
                  <span className="text-xs text-violet bg-violet-pale px-2.5 py-1 rounded-full border border-violet/20 flex items-center gap-1">
                    <FiRefreshCw size={10} /> Trade-in available
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {laptops.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setSelected(product)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Accessories section */}
            {accessories.length > 0 && activeCategory !== 'laptop' && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="font-bricolage font-bold text-xl text-ink">
                    {activeCategory === 'all' ? 'Accessories' : CATEGORIES.find(c => c.id === activeCategory)?.label}
                  </h2>
                  <span className="text-xs text-gray bg-light-gray px-2.5 py-1 rounded-full border border-ink/10">
                    {accessories.length} items
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {accessories.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setSelected(product)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />

      {/* Product detail modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelected(null)}
            deliveryLocation={deliveryLoc}
          />
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

export default AccessoriesPage