/**
 * AccessoriesPreview.jsx
 * ──────────────────────────────────────────────────────────────────
 * Homepage sneak-peek section.
 * Shows 5–6 product cards in a horizontal scroll strip.
 * "View all accessories →" button navigates to /accessories.
 *
 * Sits between <Solutions /> and <About /> in App.jsx.
 * ──────────────────────────────────────────────────────────────────
 */

import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiShoppingCart, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import products, { TAG_STYLES } from '../../data/accessories'
import { useCart } from '../../context/CartContext'

// Pick 6 featured products — mix of laptops and accessories
const FEATURED_IDS = ['1', '4', '6', '7', '3', '8']
const featured = FEATURED_IDS.map(id => products.find(p => p.id === id)).filter(Boolean)

// ── Mini product card for the preview strip ─────────────────────────
const PreviewCard = ({ product }) => {
  const { addItem } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  return (
    <Link
      to={`/accessories/${product.slug}`}
      className="group flex-shrink-0 w-[220px] sm:w-[240px] bg-white border-2 border-ink rounded-2xl overflow-hidden
                 shadow-[4px_4px_0_#120D1E] hover:shadow-[6px_6px_0_#6C2BD9]
                 hover:-translate-y-1 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-[150px] bg-light-gray overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Discount badge */}
        {product.original_price_ugx && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-ink">
            SALE
          </div>
        )}
        {/* Category pill */}
        <div className="absolute top-2 right-2 bg-ink/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize">
          {product.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="font-bricolage font-bold text-sm text-ink leading-snug line-clamp-2">
          {product.name}
        </p>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TAG_STYLES[tag] || 'bg-light-gray text-gray border-gray/20'}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="font-bricolage font-black text-base text-violet">
            UGX {product.price_ugx.toLocaleString()}
          </span>
          {product.original_price_ugx && (
            <span className="text-gray text-xs line-through">
              {product.original_price_ugx.toLocaleString()}
            </span>
          )}
        </div>

        {/* Quick add */}
        <button
          onClick={handleAddToCart}
          className="mt-1 w-full bg-violet-pale text-violet text-xs font-bold py-1.5 rounded-lg
                     border border-violet/20 hover:bg-violet hover:text-yellow transition-colors
                     flex items-center justify-center gap-1.5"
        >
          <FiShoppingCart size={12} /> Add to cart
        </button>
      </div>
    </Link>
  )
}

// ── Main section ────────────────────────────────────────────────────
const AccessoriesPreview = () => {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <section className="py-20 bg-ink overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 reveal">
          <div>
            <div className="inline-block bg-yellow text-ink rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wide mb-3">
              novaAccessories
            </div>
            <h2 className="font-bricolage text-3xl md:text-4xl font-bold text-white leading-tight">
              Gear up. Level up.
            </h2>
            <p className="text-white/50 mt-2 text-sm max-w-md">
              Genuine laptops, mice, keyboards, chargers — everything your setup needs, at Uganda-fair prices.
            </p>
          </div>

          {/* Scroll controls + View all — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll(-1)}
              className="w-9 h-9 rounded-full border border-white/20 text-white/60
                         hover:border-yellow hover:text-yellow transition-colors flex items-center justify-center"
              aria-label="Scroll left"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-9 h-9 rounded-full border border-white/20 text-white/60
                         hover:border-yellow hover:text-yellow transition-colors flex items-center justify-center"
              aria-label="Scroll right"
            >
              <FiChevronRight size={18} />
            </button>
            <Link
              to="/accessories"
              className="ml-2 bg-yellow text-ink font-bold py-2.5 px-5 rounded-full border-2 border-yellow-deep
                         inline-flex items-center gap-2 hover:bg-yellow-deep transition shadow-[3px_3px_0_rgba(255,255,255,0.15)]"
            >
              View all <FiArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Horizontal scroll strip */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              className="snap-start"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <PreviewCard product={product} />
            </motion.div>
          ))}

          {/* "See all" card at the end */}
          <Link
            to="/accessories"
            className="flex-shrink-0 w-[220px] sm:w-[240px] bg-violet border-2 border-yellow/30 rounded-2xl
                       flex flex-col items-center justify-center gap-3 p-6 text-center snap-start
                       hover:border-yellow transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-yellow/10 border border-yellow/30 flex items-center justify-center
                            group-hover:bg-yellow/20 transition-colors">
              <FiArrowRight size={20} className="text-yellow" />
            </div>
            <p className="font-bricolage font-bold text-white text-sm">See all products</p>
            <p className="text-white/40 text-xs">{products.length} items in store</p>
          </Link>
        </div>

        {/* View all — mobile */}
        <div className="mt-6 flex justify-center md:hidden reveal">
          <Link
            to="/accessories"
            className="bg-yellow text-ink font-bold py-3 px-8 rounded-full border-2 border-yellow-deep
                       inline-flex items-center gap-2 shadow-[4px_4px_0_rgba(255,255,255,0.1)]"
          >
            View all accessories <FiArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default AccessoriesPreview