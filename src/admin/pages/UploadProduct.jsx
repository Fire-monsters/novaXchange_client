/**
 * UploadProduct.jsx
 * ──────────────────────────────────────────────────────────────────
 * Handles both CREATE and EDIT in one component.
 *
 * CREATE: /admin/products/upload
 * EDIT:   /admin/products/edit/:id   (pre-fills all fields from API)
 * DUPE:   /admin/products/upload?duplicate=:id  (copies fields, new slug)
 *
 * Image zone:
 *   - Drag-and-drop or click to browse
 *   - Multiple files, inline previews
 *   - Remove individual images
 *   - First image = primary (shown on cards) — reorder with ↑ ↓ arrows
 *
 * Specs builder:
 *   - Dynamic key-value rows (add / remove)
 *   - Laptop template pre-fills cpu, ram, storage, display, battery, os
 *
 * Submit flow:
 *   1. Validate form
 *   2. Build FormData (images as files + all fields as form strings)
 *   3. POST /admin/products via XHR with progress callback
 *   4. Show per-step progress bar: "Uploading images… Saving product… Done"
 * ──────────────────────────────────────────────────────────────────
 */

import React, {
  useState, useEffect, useRef, useCallback,
} from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUploadCloud, FiX, FiPlus, FiArrowUp, FiArrowDown,
  FiCheck, FiArrowLeft, FiInfo, FiLoader,
} from 'react-icons/fi'
import {
  createProduct, updateProduct, getProducts,
  addProductImages, getCategories,
} from '../../api/catalog'

// ── Constants ─────────────────────────────────────────────────────────────────

const TIERS    = ['premium', 'mid-range', 'budget']
const ALL_TAGS = ['Quick Sale', 'Great Value', 'Affordable', 'Popular', 'New Arrival', 'Low Stock', 'Best Pick']

const LAPTOP_SPEC_TEMPLATE = { cpu: '', ram: '', storage: '', display: '', battery: '', os: '' }
const EMPTY_SPEC_ROW       = { key: '', value: '' }

const STEPS = [
  { id: 'uploading', label: 'Uploading images…' },
  { id: 'saving',    label: 'Saving product…' },
  { id: 'done',      label: 'Done!' },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

const slugify = (s) =>
  s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')

const specsToRows = (specs = {}) =>
  Object.entries(specs).map(([key, value]) => ({ key, value }))

const rowsToSpecs = (rows) =>
  rows.reduce((acc, r) => {
    if (r.key.trim()) acc[r.key.trim()] = r.value
    return acc
  }, {})

// ── Image preview item ─────────────────────────────────────────────────────────

const ImagePreview = ({ file, url, index, total, onRemove, onMoveUp, onMoveDown }) => (
  <div className="relative group">
    <div className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all
      ${index === 0 ? 'border-violet shadow-[2px_2px_0_#6C2BD9]' : 'border-ink/20 hover:border-violet/40'}`}>
      <img src={url} alt="" className="w-full h-full object-cover" />
    </div>

    {/* Primary badge */}
    {index === 0 && (
      <div className="absolute top-1.5 left-1.5 bg-violet text-yellow text-[9px] font-black
                      px-1.5 py-0.5 rounded-full border border-ink/30">
        PRIMARY
      </div>
    )}

    {/* Controls overlay */}
    <div className="absolute inset-0 bg-ink/40 rounded-xl opacity-0 group-hover:opacity-100
                    transition-opacity flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onMoveUp(index)}
        disabled={index === 0}
        className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-ink
                   disabled:opacity-30 hover:bg-white transition"
        title="Move up (set as primary if first)"
      >
        <FiArrowUp size={12} />
      </button>
      <button
        type="button"
        onClick={() => onMoveDown(index)}
        disabled={index === total - 1}
        className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-ink
                   disabled:opacity-30 hover:bg-white transition"
        title="Move down"
      >
        <FiArrowDown size={12} />
      </button>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition"
        title="Remove image"
      >
        <FiX size={12} />
      </button>
    </div>
  </div>
)

// ── Progress overlay ───────────────────────────────────────────────────────────

const ProgressOverlay = ({ step, uploadPct }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/60 backdrop-blur-sm">
    <div className="bg-white rounded-2xl border-2 border-ink shadow-[8px_8px_0_#120D1E] p-8 w-80 text-center">
      <motion.div
        animate={{ rotate: step !== 'done' ? 360 : 0 }}
        transition={{ duration: 1, repeat: step !== 'done' ? Infinity : 0, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-4 border-violet border-t-transparent mx-auto mb-4"
        style={{ borderTopColor: step === 'done' ? '#6C2BD9' : 'transparent' }}
      />

      <p className="font-bricolage font-bold text-xl text-ink mb-1">
        {STEPS.find(s => s.id === step)?.label}
      </p>

      {step === 'uploading' && (
        <>
          <p className="text-gray text-sm mb-4">{uploadPct}% complete</p>
          <div className="w-full bg-light-gray rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-violet rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${uploadPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </>
      )}

      {step === 'done' && (
        <div className="mt-2 flex items-center justify-center gap-1.5 text-green-600 text-sm font-semibold">
          <FiCheck size={16} /> Product saved successfully
        </div>
      )}
    </div>
  </div>
)

// ── Field wrapper ──────────────────────────────────────────────────────────────

const Field = ({ label, required, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-ink-soft flex items-center gap-1.5">
      {label}
      {required && <span className="text-red-500">*</span>}
      {hint && (
        <span title={hint} className="text-gray cursor-help"><FiInfo size={12} /></span>
      )}
    </label>
    {children}
  </div>
)

const inputCls = `w-full px-3 py-2.5 border-2 border-ink/20 rounded-lg text-sm bg-white
  focus:outline-none focus:border-violet transition-colors text-ink`

// ── Main component ─────────────────────────────────────────────────────────────

export default function UploadProduct() {
  const navigate        = useNavigate()
  const { id }          = useParams()           // set on edit route
  const [searchParams]  = useSearchParams()
  const duplicateId     = searchParams.get('duplicate')
  const isEdit          = Boolean(id)

  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name:               '',
    slug:               '',
    category:           '',
    tier:               'mid-range',
    price_ugx:          '',
    original_price_ugx: '',
    stock:              '',
    short_description:  '',
    description:        '',
    active:             true,
  })
  const [specRows,    setSpecRows]    = useState([EMPTY_SPEC_ROW])
  const [tags,        setTags]        = useState([])
  const [slugEdited,  setSlugEdited]  = useState(false)

  // ── Image state ─────────────────────────────────────────────────────────────
  const [newFiles,    setNewFiles]    = useState([])   // File objects (new uploads)
  const [newPreviews, setNewPreviews] = useState([])   // Object URLs for new files
  const [existingUrls,setExistingUrls]= useState([])   // URLs already on the product (edit mode)
  const [isDragging,  setIsDragging]  = useState(false)
  const fileInputRef                  = useRef(null)
  const dropZoneRef                   = useRef(null)

  // ── UI state ────────────────────────────────────────────────────────────────
  const [categories,  setCategories]  = useState([])
  const [submitStep,  setSubmitStep]  = useState(null) // null | 'uploading' | 'saving' | 'done'
  const [uploadPct,   setUploadPct]   = useState(0)
  const [errors,      setErrors]      = useState({})

  // ── Load categories ──────────────────────────────────────────────────────────
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
  }, [])

  // ── Prefill for edit or duplicate ────────────────────────────────────────────
  useEffect(() => {
    const sourceId = id || duplicateId
    if (!sourceId) return

    // Fetch all products and find by id (public endpoint returns by slug;
    // admin endpoint returns by id — use list with limit hack for now)
    getProducts({ active: false, limit: 100 })
      .then(res => {
        const product = res.items.find(p => p.id === sourceId)
        if (!product) return

        setForm({
          name:               duplicateId ? `${product.name} (copy)` : product.name,
          slug:               duplicateId ? `${product.slug}-copy` : product.slug,
          category:           product.category,
          tier:               product.tier,
          price_ugx:          String(product.price_ugx),
          original_price_ugx: product.original_price_ugx ? String(product.original_price_ugx) : '',
          stock:              String(product.stock),
          short_description:  product.short_description,
          description:        product.description,
          active:             product.active,
        })
        setSpecRows(specsToRows(product.specs))
        setTags(product.tags || [])
        setExistingUrls(product.images || [])
        setSlugEdited(true) // prevent slug auto-update from name changes
      })
      .catch(console.error)
  }, [id, duplicateId])

  // ── Auto-generate slug from name ──────────────────────────────────────────────
  const handleNameChange = (v) => {
    setForm(f => ({
      ...f,
      name: v,
      slug: slugEdited ? f.slug : slugify(v),
    }))
  }

  // ── Category → spec template ──────────────────────────────────────────────────
  const handleCategoryChange = (v) => {
    setForm(f => ({ ...f, category: v }))
    if (v === 'laptop' && specRows.length === 1 && !specRows[0].key) {
      setSpecRows(specsToRows(LAPTOP_SPEC_TEMPLATE))
    }
  }

  // ── Image handling ────────────────────────────────────────────────────────────
  const addFiles = useCallback((files) => {
    const MAX = 6
    const current = newFiles.length + existingUrls.length
    const allowed = files.slice(0, MAX - current)
    if (allowed.length < files.length) {
      alert(`Max ${MAX} images per product. Only adding the first ${allowed.length}.`)
    }
    const previews = allowed.map(f => URL.createObjectURL(f))
    setNewFiles(prev => [...prev, ...allowed])
    setNewPreviews(prev => [...prev, ...previews])
  }, [newFiles, existingUrls])

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newPreviews[index])
    setNewFiles(f => f.filter((_, i) => i !== index))
    setNewPreviews(p => p.filter((_, i) => i !== index))
  }

  const moveNewImage = (from, to) => {
    if (to < 0 || to >= newFiles.length) return
    const files = [...newFiles]
    const prevs  = [...newPreviews]
    ;[files[from], files[to]] = [files[to], files[from]]
    ;[prevs[from],  prevs[to]]  = [prevs[to],  prevs[from]]
    setNewFiles(files)
    setNewPreviews(prevs)
  }

  // Drag-and-drop
  const onDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    addFiles(files)
  }, [addFiles])

  // ── Spec rows ─────────────────────────────────────────────────────────────────
  const updateSpecRow = (index, field, value) => {
    setSpecRows(rows => rows.map((r, i) => i === index ? { ...r, [field]: value } : r))
  }
  const addSpecRow    = () => setSpecRows(rows => [...rows, { key: '', value: '' }])
  const removeSpecRow = (index) => setSpecRows(rows => rows.filter((_, i) => i !== index))

  // ── Tag toggle ────────────────────────────────────────────────────────────────
  const toggleTag = (tag) => {
    setTags(ts => ts.includes(tag) ? ts.filter(t => t !== tag) : [...ts, tag])
  }

  // ── Validation ────────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.name.trim())             e.name = 'Product name is required'
    if (!form.slug.trim())             e.slug = 'Slug is required'
    if (!form.category)                e.category = 'Select a category'
    if (!form.tier)                    e.tier = 'Select a tier'
    if (!form.price_ugx || isNaN(Number(form.price_ugx))) e.price_ugx = 'Enter a valid price'
    if (!form.stock || isNaN(Number(form.stock)))         e.stock = 'Enter a valid stock count'
    if (!form.short_description.trim()) e.short_description = 'Short description is required'
    if (!form.description.trim())       e.description = 'Full description is required'
    if (newFiles.length === 0 && existingUrls.length === 0)
      e.images = 'Upload at least one product image'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    try {
      if (isEdit) {
        // EDIT: update fields first, then handle new images separately
        setSubmitStep('saving')
        const specs = rowsToSpecs(specRows)
        await updateProduct(id, {
          name:               form.name,
          slug:               form.slug,
          category:           form.category,
          tier:               form.tier,
          price_ugx:          Number(form.price_ugx),
          original_price_ugx: form.original_price_ugx ? Number(form.original_price_ugx) : null,
          stock:              Number(form.stock),
          short_description:  form.short_description,
          description:        form.description,
          specs,
          tags,
          active:             form.active,
        })

        if (newFiles.length > 0) {
          setSubmitStep('uploading')
          const fd = new FormData()
          newFiles.forEach(f => fd.append('images', f))
          await addProductImages(id, fd, setUploadPct)
        }

      } else {
        // CREATE: all in one FormData request
        setSubmitStep('uploading')
        const fd = new FormData()
        fd.append('name',               form.name)
        fd.append('slug',               form.slug)
        fd.append('category',           form.category)
        fd.append('tier',               form.tier)
        fd.append('price_ugx',          form.price_ugx)
        fd.append('original_price_ugx', form.original_price_ugx || '')
        fd.append('stock',              form.stock)
        fd.append('short_description',  form.short_description)
        fd.append('description',        form.description)
        fd.append('specs_json',         JSON.stringify(rowsToSpecs(specRows)))
        fd.append('tags_json',          JSON.stringify(tags))
        fd.append('active',             String(form.active))
        newFiles.forEach(f => fd.append('images', f))

        setSubmitStep('uploading')
        const product = await createProduct(fd, (pct) => {
          setUploadPct(pct)
          if (pct === 100) setSubmitStep('saving')
        })
      }

      setSubmitStep('done')
      setTimeout(() => navigate('/admin/products'), 1200)

    } catch (err) {
      setSubmitStep(null)
      alert(`Error: ${err.message}`)
    }
  }

  const totalImages = existingUrls.length + newFiles.length

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      {submitStep && <ProgressOverlay step={submitStep} uploadPct={uploadPct} />}

      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
                  className="w-9 h-9 rounded-lg border-2 border-ink flex items-center justify-center text-ink-soft hover:bg-light-gray transition">
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-bricolage font-black text-2xl text-ink">
              {isEdit ? 'Edit product' : duplicateId ? 'Duplicate product' : 'Upload product'}
            </h1>
            <p className="text-gray text-sm">
              {isEdit ? 'Update fields — images managed below' : 'Fill in details and upload images to publish'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

            {/* ── LEFT: form fields ── */}
            <div className="space-y-5">

              {/* Basic info */}
              <div className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] space-y-4">
                <h2 className="font-bricolage font-bold text-base text-ink border-b border-ink/10 pb-2">
                  Basic info
                </h2>

                <Field label="Product name" required>
                  <input
                    value={form.name}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="e.g. Logitech MX Master 3"
                    className={`${inputCls} ${errors.name ? 'border-red-400' : ''}`}
                  />
                  {errors.name && <p data-error className="text-red-500 text-xs">{errors.name}</p>}
                </Field>

                <Field label="Slug" required hint="URL-safe identifier — auto-generated from name, editable">
                  <input
                    value={form.slug}
                    onChange={e => { setSlugEdited(true); setForm(f => ({ ...f, slug: slugify(e.target.value) })) }}
                    placeholder="logitech-mx-master-3"
                    className={`${inputCls} font-mono text-sm ${errors.slug ? 'border-red-400' : ''}`}
                  />
                  {errors.slug && <p data-error className="text-red-500 text-xs">{errors.slug}</p>}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Category" required>
                    <select
                      value={form.category}
                      onChange={e => handleCategoryChange(e.target.value)}
                      className={`${inputCls} ${errors.category ? 'border-red-400' : ''}`}
                    >
                      <option value="">Select…</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                    {errors.category && <p data-error className="text-red-500 text-xs">{errors.category}</p>}
                  </Field>

                  <Field label="Tier" required>
                    <select
                      value={form.tier}
                      onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}
                      className={`${inputCls} capitalize ${errors.tier ? 'border-red-400' : ''}`}
                    >
                      {TIERS.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Price (UGX)" required>
                    <input
                      type="number" min="0"
                      value={form.price_ugx}
                      onChange={e => setForm(f => ({ ...f, price_ugx: e.target.value }))}
                      placeholder="180000"
                      className={`${inputCls} ${errors.price_ugx ? 'border-red-400' : ''}`}
                    />
                    {errors.price_ugx && <p data-error className="text-red-500 text-xs">{errors.price_ugx}</p>}
                  </Field>

                  <Field label="Original price (UGX)" hint="Shows strikethrough on card if set">
                    <input
                      type="number" min="0"
                      value={form.original_price_ugx}
                      onChange={e => setForm(f => ({ ...f, original_price_ugx: e.target.value }))}
                      placeholder="220000 (optional)"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field label="Stock quantity" required>
                  <input
                    type="number" min="0"
                    value={form.stock}
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    placeholder="10"
                    className={`${inputCls} max-w-[140px] ${errors.stock ? 'border-red-400' : ''}`}
                  />
                  {errors.stock && <p data-error className="text-red-500 text-xs">{errors.stock}</p>}
                </Field>
              </div>

              {/* Descriptions */}
              <div className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] space-y-4">
                <h2 className="font-bricolage font-bold text-base text-ink border-b border-ink/10 pb-2">
                  Descriptions
                </h2>

                <Field label="Short description" required hint="Shown on product cards — keep under 100 characters">
                  <input
                    value={form.short_description}
                    onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))}
                    placeholder="One punchy line about what makes this product great"
                    maxLength={120}
                    className={`${inputCls} ${errors.short_description ? 'border-red-400' : ''}`}
                  />
                  <div className="flex justify-between">
                    {errors.short_description
                      ? <p data-error className="text-red-500 text-xs">{errors.short_description}</p>
                      : <span />}
                    <span className="text-gray text-xs">{form.short_description.length}/120</span>
                  </div>
                </Field>

                <Field label="Full description" required hint="Shown in product detail modal — markdown supported">
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder={`Detailed description of the product.\n\nYou can use line breaks for paragraphs.\nBullet points work too.`}
                    rows={8}
                    className={`${inputCls} resize-y leading-relaxed ${errors.description ? 'border-red-400' : ''}`}
                  />
                  {errors.description && <p data-error className="text-red-500 text-xs">{errors.description}</p>}
                </Field>
              </div>

              {/* Specs */}
              <div className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] space-y-4">
                <div className="flex items-center justify-between border-b border-ink/10 pb-2">
                  <h2 className="font-bricolage font-bold text-base text-ink">Specifications</h2>
                  {form.category === 'laptop' && (
                    <button
                      type="button"
                      onClick={() => setSpecRows(specsToRows(LAPTOP_SPEC_TEMPLATE))}
                      className="text-xs text-violet hover:underline font-medium"
                    >
                      Use laptop template
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {specRows.map((row, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        value={row.key}
                        onChange={e => updateSpecRow(i, 'key', e.target.value)}
                        placeholder="e.g. CPU"
                        className="flex-1 px-3 py-2 border border-ink/20 rounded-lg text-sm focus:outline-none focus:border-violet"
                      />
                      <input
                        value={row.value}
                        onChange={e => updateSpecRow(i, 'value', e.target.value)}
                        placeholder="e.g. Intel Core i5-1235U"
                        className="flex-[2] px-3 py-2 border border-ink/20 rounded-lg text-sm focus:outline-none focus:border-violet"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(i)}
                        className="w-8 h-8 rounded-lg text-gray hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition flex-shrink-0"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addSpecRow}
                  className="flex items-center gap-1.5 text-sm text-violet font-medium hover:underline"
                >
                  <FiPlus size={14} /> Add spec row
                </button>
              </div>
            </div>

            {/* ── RIGHT: images + tags + settings ── */}
            <div className="space-y-5">

              {/* Image upload zone */}
              <div className="bg-white rounded-xl border-2 border-ink p-4 shadow-[3px_3px_0_#120D1E]">
                <h2 className="font-bricolage font-bold text-base text-ink border-b border-ink/10 pb-2 mb-3">
                  Images
                  <span className="text-gray text-xs font-normal ml-2">{totalImages}/6</span>
                </h2>

                {errors.images && (
                  <p data-error className="text-red-500 text-xs mb-2">{errors.images}</p>
                )}

                {/* Drop zone */}
                {totalImages < 6 && (
                  <div
                    ref={dropZoneRef}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all mb-3
                      ${isDragging
                        ? 'border-violet bg-violet-pale'
                        : 'border-ink/20 hover:border-violet/40 hover:bg-violet-pale/30'}`}
                  >
                    <FiUploadCloud size={24} className={`mx-auto mb-2 ${isDragging ? 'text-violet' : 'text-gray'}`} />
                    <p className="text-sm font-medium text-ink-soft">
                      {isDragging ? 'Drop images here' : 'Drag images or click to browse'}
                    </p>
                    <p className="text-xs text-gray mt-1">PNG, JPG, WebP · max 15MB each</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => addFiles(Array.from(e.target.files || []))}
                    />
                  </div>
                )}

                {/* Existing images (edit mode) */}
                {existingUrls.length > 0 && (
                  <>
                    <p className="text-xs text-gray font-semibold uppercase tracking-wide mb-2">
                      Current images
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {existingUrls.map((url, i) => (
                        <div key={url} className="relative group">
                          <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-ink/20">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                          </div>
                          {i === 0 && (
                            <div className="absolute top-1 left-1 bg-violet text-yellow text-[9px] font-black px-1.5 py-0.5 rounded-full">
                              PRIMARY
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => setExistingUrls(us => us.filter((_, j) => j !== i))}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white
                                       flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            <FiX size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* New image previews */}
                {newPreviews.length > 0 && (
                  <>
                    {existingUrls.length > 0 && (
                      <p className="text-xs text-gray font-semibold uppercase tracking-wide mb-2">
                        New images
                      </p>
                    )}
                    <div className="grid grid-cols-3 gap-2">
                      {newPreviews.map((url, i) => (
                        <ImagePreview
                          key={url}
                          file={newFiles[i]}
                          url={url}
                          index={i}
                          total={newPreviews.length}
                          onRemove={removeNewImage}
                          onMoveUp={(idx) => moveNewImage(idx, idx - 1)}
                          onMoveDown={(idx) => moveNewImage(idx, idx + 1)}
                        />
                      ))}
                    </div>
                  </>
                )}

                <p className="text-xs text-gray mt-3 flex items-start gap-1.5">
                  <FiInfo size={11} className="flex-shrink-0 mt-0.5" />
                  First image = primary (shown on product cards). Hover an image to reorder.
                </p>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl border-2 border-ink p-4 shadow-[3px_3px_0_#120D1E]">
                <h2 className="font-bricolage font-bold text-base text-ink border-b border-ink/10 pb-2 mb-3">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all
                        ${tags.includes(tag)
                          ? 'bg-violet text-yellow border-ink shadow-[2px_2px_0_#120D1E]'
                          : 'bg-off-white text-ink-soft border-ink/20 hover:border-violet/40'}`}
                    >
                      {tags.includes(tag) && <FiCheck size={10} className="inline mr-1" />}
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility toggle */}
              <div className="bg-white rounded-xl border-2 border-ink p-4 shadow-[3px_3px_0_#120D1E]">
                <h2 className="font-bricolage font-bold text-base text-ink border-b border-ink/10 pb-2 mb-3">
                  Visibility
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {form.active ? 'Published' : 'Draft'}
                    </p>
                    <p className="text-xs text-gray">
                      {form.active ? 'Visible in the store' : 'Hidden — not visible to customers'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                    className={`w-12 h-6 rounded-full border-2 border-ink transition-colors relative flex-shrink-0
                      ${form.active ? 'bg-violet' : 'bg-light-gray'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white border border-ink/20 transition-all
                      ${form.active ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Submit buttons */}
              <div className="space-y-2">
                <motion.button
                  type="submit"
                  whileHover={{ x: -1, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 bg-violet text-yellow
                             font-bricolage font-bold py-4 rounded-xl border-2 border-ink
                             shadow-[4px_4px_0_#120D1E] hover:shadow-[5px_5px_0_#120D1E] transition-all"
                >
                  <FiUploadCloud size={16} />
                  {isEdit ? 'Save changes' : form.active ? 'Publish product' : 'Save as draft'}
                </motion.button>

                {/* Quick draft toggle on create */}
                {!isEdit && form.active && (
                  <button
                    type="button"
                    onClick={() => { setForm(f => ({ ...f, active: false })) }}
                    className="w-full text-center text-xs text-gray hover:text-ink transition py-1"
                  >
                    or save as draft instead
                  </button>
                )}
              </div>

            </div>
          </div>
        </form>
      </div>
    </>
  )
}