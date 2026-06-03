import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiX, FiArrowRight, FiUpload, FiCheckCircle, FiLoader } from 'react-icons/fi'
import { calculateTradeInValue } from '../../utils/tradeInCalculator'

// ── constants ────────────────────────────────────────────────────────────────
const brands      = ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Microsoft', 'Samsung', 'Other']
const years       = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', 'Older']
const ramOptions  = ['4GB', '8GB', '16GB', '32GB']
const storageOpts = ['128GB', '256GB', '512GB', '1TB', '2TB']
const conditions  = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
const occupations = ['Student', 'Young Professional']

const phoneNumber = '256779543595'

// ── helpers ──────────────────────────────────────────────────────────────────
const normaliseBrand = (brand) => {
  const map = {
    Apple: 'Apple (MacBook)', Dell: 'Dell', HP: 'HP', Lenovo: 'Lenovo',
    ASUS: 'Asus', Acer: 'Acer', Microsoft: 'Other', Samsung: 'Samsung', Other: 'Other',
  }
  return map[brand] || 'Other'
}

const normaliseCondition = (condition) => {
  const map = {
    Excellent: 'Excellent (like new)', 'Very Good': 'Good (minor scratches)',
    Good: 'Good (minor scratches)', Fair: 'Fair (visible wear)', Poor: 'Poor (damaged)',
  }
  return map[condition] || 'Good (minor scratches)'
}

// ── shared input style ────────────────────────────────────────────────────────
const inputCls = 'w-full p-2.5 border-2 border-ink rounded-lg bg-white text-ink text-sm focus:outline-none focus:border-violet transition-colors'

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold mb-1 text-ink-soft">{label}</label>
    {children}
  </div>
)

// ── Result modal ──────────────────────────────────────────────────────────────
const ResultModal = ({ form, estimatedValue, onClose, onReset }) => {
  const waText = encodeURIComponent(
    `Hi! I submitted my ${form.brand} ${form.model} for trade-in. My estimated value is UGX ${estimatedValue.toLocaleString()}.`
  )

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="relative z-10 bg-white rounded-3xl shadow-[8px_8px_0_#120D1E] border-2 border-ink w-full max-w-md"
        initial={{ scale: 0.92, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full
          bg-light-gray hover:bg-violet hover:text-yellow flex items-center
          justify-center transition-colors border-2 border-ink"
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

        <div className="text-center py-10 px-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-green-100 border-2
            border-green-400 flex items-center justify-center mx-auto mb-6"
          >
            <FiCheckCircle size={36} className="text-green-500" />
          </motion.div>

          <h2 className="font-bricolage font-bold text-2xl text-ink mb-1">Your Trade-In Value</h2>
          <p className="text-gray text-sm mb-6">
            Based on your {form.brand} {form.model} ({form.year})
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-violet rounded-2xl p-6 mb-6"
          >
            <p className="text-yellow/70 text-xs mb-1 uppercase tracking-widest">Estimated Value</p>
            <p className="font-bricolage font-black text-4xl text-yellow mb-1">
              UGX {estimatedValue.toLocaleString()}
            </p>
            <p className="text-yellow/50 text-xs">Subject to physical inspection</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { label: 'Condition', value: form.condition },
              { label: 'RAM',       value: form.ram },
              { label: 'Year',      value: form.year },
            ].map((item) => (
              <div key={item.label} className="bg-light-gray rounded-xl p-3 text-center">
                <p className="text-gray text-xs mb-0.5">{item.label}</p>
                <p className="font-semibold text-ink text-xs">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/${phoneNumber}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary justify-center"
            >
              <FaWhatsapp size={16} /> Confirm on WhatsApp <FiArrowRight size={14} />
            </a>
            <button onClick={onReset} className="btn-secondary justify-center">
              Try Another Device
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Loading overlay ───────────────────────────────────────────────────────────
const LoadingOverlay = () => (
  <div className="absolute inset-0 bg-white/90 rounded-2xl z-10 flex flex-col items-center justify-center gap-5">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <FiLoader size={36} className="text-violet" />
    </motion.div>
    <div className="text-center">
      <p className="font-bricolage font-bold text-ink text-base mb-1">Analysing your device…</p>
      <p className="text-gray text-sm">Checking market value and condition</p>
    </div>
    <div className="w-44 h-2 bg-light-gray rounded-full overflow-hidden">
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        className="h-full bg-violet rounded-full"
      />
    </div>
  </div>
)

// ── TradeForm (inline) ────────────────────────────────────────────────────────
const TradeForm = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [images, setImages]   = useState([])
  const [form, setForm] = useState({
    name: '', occupation: '', brand: '', model: '',
    year: '', ram: '', storage: '', condition: '', whatsapp: '',
  })

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    const value = calculateTradeInValue({
      brand:     normaliseBrand(form.brand),
      year:      form.year === 'Older' ? '2018 or older' : form.year,
      condition: normaliseCondition(form.condition),
      ram:       form.ram === '32GB' ? '32GB+' : form.ram,
    })
    setLoading(false)
    setResult({ value, form: { ...form } })
  }

  const handleReset = () => {
    setResult(null)
    setImages([])
    setForm({ name: '', occupation: '', brand: '', model: '', year: '', ram: '', storage: '', condition: '', whatsapp: '' })
  }

  return (
    <>
      <div className="relative bg-off-white border-2 border-ink rounded-2xl p-6 shadow-[8px_8px_0_#120D1E]">
        {loading && <LoadingOverlay />}

        <h3 className="font-bricolage font-bold text-xl mb-5">Trade-In Estimate</h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Personal */}
          <p className="font-bricolage font-semibold text-ink/50 text-xs uppercase tracking-widest">Your Info</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Full Name *">
              <input
                required value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="e.g. Brian Kasozi" className={inputCls}
              />
            </Field>
            <Field label="WhatsApp Number *">
              <input
                required value={form.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value)}
                placeholder="+256 700 000 000" className={inputCls}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Occupation *">
                <select
                  required value={form.occupation}
                  onChange={(e) => update('occupation', e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select occupation</option>
                  {occupations.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <hr className="border-light-gray" />

          {/* Laptop */}
          <p className="font-bricolage font-semibold text-ink/50 text-xs uppercase tracking-widest">Laptop Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Brand *">
              <select required value={form.brand} onChange={(e) => update('brand', e.target.value)} className={inputCls}>
                <option value="">Select brand</option>
                {brands.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Model *">
              <input
                required value={form.model}
                onChange={(e) => update('model', e.target.value)}
                placeholder="e.g. Inspiron 15" className={inputCls}
              />
            </Field>
            <Field label="Year *">
              <select required value={form.year} onChange={(e) => update('year', e.target.value)} className={inputCls}>
                <option value="">Select year</option>
                {years.map((y) => <option key={y}>{y}</option>)}
              </select>
            </Field>
            <Field label="Condition *">
              <select required value={form.condition} onChange={(e) => update('condition', e.target.value)} className={inputCls}>
                <option value="">Select condition</option>
                {conditions.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="RAM *">
              <select required value={form.ram} onChange={(e) => update('ram', e.target.value)} className={inputCls}>
                <option value="">Select RAM</option>
                {ramOptions.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Storage *">
              <select required value={form.storage} onChange={(e) => update('storage', e.target.value)} className={inputCls}>
                <option value="">Select storage</option>
                {storageOpts.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-ink-soft">
              Upload Photos <span className="text-gray font-normal">(optional)</span>
            </label>
            <label className="
            flex flex-col items-center justify-center gap-2 p-5
            rounded-xl cursor-pointer border-2 border-dashed border-ink/20 bg-white
            hover:border-violet/40 hover:bg-violet-pale/20 transition-all">
              <FiUpload size={20} className="text-gray" />
              <p className="text-ink/60 text-sm">Drop images here or click to browse</p>
              <p className="text-gray text-xs">PNG, JPG up to 10 MB each</p>
              <input
                type="file" multiple accept="image/*" className="hidden"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
              />
            </label>
            {images.length > 0 && (
              <p className="text-violet text-xs mt-1.5">{images.length} image(s) selected</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary w-full justify-center text-base py-4"
          >
            Get My Trade-In Value <FiArrowRight size={16} />
          </motion.button>
        </form>
      </div>

      <AnimatePresence>
        {result && (
          <ResultModal
            form={result.form}
            estimatedValue={result.value}
            onClose={() => setResult(null)}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ── LeadCapture ───────────────────────────────────────────────────────────────
const LeadCapture = () => (
  <section id="lead-capture" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* Left: copy — sticky so it stays visible while scrolling the tall form */}
        <div className="reveal lg:sticky lg:top-32">
          <div className="section-tag inline-block bg-yellow text-ink rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wide mb-4">
            Get Instant Estimate
          </div>
          <h2 className="font-bricolage text-3xl md:text-4xl font-bold mb-3 leading-tight">
            Know your device's value<br />
            <span className="text-violet">in minutes</span>
          </h2>
          <p className="text-gray leading-relaxed">
            Takes less than 2 minutes. No commitment required. We'll send you a fair, instant
            valuation straight to your WhatsApp.
          </p>

          <ul className="space-y-3 mt-6">
            {[
              'Free, no-obligation valuation',
              'Response within 30 minutes',
              'Fair, transparent pricing always',
              'Campus delivery available',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-ink-soft font-medium">
                <span className="w-5 h-5 rounded-full bg-violet-pale text-violet flex items-center justify-center text-xs flex-shrink-0 font-bold">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: inline form */}
        <div className="reveal">
          <TradeForm />
        </div>
      </div>
    </div>
  </section>
)

export default LeadCapture