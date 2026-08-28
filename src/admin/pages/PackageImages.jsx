/**
 * PackageImages.jsx
 * ──────────────────────────────────────────────────────────────────
 * Route: /admin/packages
 *
 * Manages the image slideshow shown in each homepage "package" modal
 * (novaUpgrade, novaBoost, novaAccessories, novaWorkspace — defined in
 * src/components/sections/Solutions.jsx). Title/description/features/
 * icon stay hardcoded there; only images are admin-editable, mirroring
 * the product image upload pattern in UploadProduct.jsx at a much
 * smaller scale (no other fields, no create/edit modes).
 * ──────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from 'react'
import {
  FiUploadCloud, FiX, FiArrowUp, FiArrowDown, FiAlertCircle,
} from 'react-icons/fi'
import {
  getPackageImages, addPackageImages, deletePackageImage, reorderPackageImages,
} from '../../api/catalog'

const PACKAGES = [
  { id: 'upgrade',     label: 'novaUpgrade' },
  { id: 'boost',       label: 'novaBoost & Clean' },
  { id: 'accessories', label: 'novaAccessories' },
  { id: 'workspace',   label: 'novaWorkspace' },
]

const MAX_IMAGES = 6

const filenameOf = (url) => url.split('/').pop()

const ImagePreview = ({ url, index, total, onRemove, onMoveUp, onMoveDown }) => (
  <div className="relative group">
    <div className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all
      ${index === 0 ? 'border-violet shadow-[2px_2px_0_#6C2BD9]' : 'border-ink/20 hover:border-violet/40'}`}>
      <img src={url} alt="" className="w-full h-full object-cover" />
    </div>

    {index === 0 && (
      <div className="absolute top-1.5 left-1.5 bg-violet text-yellow text-[9px] font-black
                      px-1.5 py-0.5 rounded-full border border-ink/30">
        SHOWN FIRST
      </div>
    )}

    <div className="absolute inset-0 bg-ink/40 rounded-xl opacity-0 group-hover:opacity-100
                    transition-opacity flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={index === 0}
        className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-ink
                   disabled:opacity-30 hover:bg-white transition"
        title="Move up"
      >
        <FiArrowUp size={12} />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={index === total - 1}
        className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-ink
                   disabled:opacity-30 hover:bg-white transition"
        title="Move down"
      >
        <FiArrowDown size={12} />
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition"
        title="Remove image"
      >
        <FiX size={12} />
      </button>
    </div>
  </div>
)

export default function PackageImages() {
  const [imagesByPackage, setImagesByPackage] = useState({})
  const [activeId, setActiveId] = useState(PACKAGES[0].id)
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const [error, setError]       = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const activeImages = imagesByPackage[activeId] || []

  useEffect(() => {
    getPackageImages()
      .then(setImagesByPackage)
      .catch(err => setError(err.message || 'Failed to load package images'))
      .finally(() => setLoading(false))
  }, [])

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return
    const allowed = files.slice(0, Math.max(0, MAX_IMAGES - activeImages.length))
    if (allowed.length === 0) {
      setError(`Max ${MAX_IMAGES} images per package.`)
      return
    }
    setError('')
    setUploading(true)
    setUploadPct(0)
    try {
      const fd = new FormData()
      allowed.forEach(f => fd.append('images', f))
      const result = await addPackageImages(activeId, fd, setUploadPct)
      setImagesByPackage(m => ({ ...m, [activeId]: result.images }))
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      setUploadPct(0)
    }
  }

  const handleRemove = async (url) => {
    setError('')
    try {
      const result = await deletePackageImage(activeId, filenameOf(url))
      setImagesByPackage(m => ({ ...m, [activeId]: result.images }))
    } catch (err) {
      setError(err.message || 'Could not remove image')
    }
  }

  const handleReorder = async (from, to) => {
    const next = [...activeImages]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setImagesByPackage(m => ({ ...m, [activeId]: next })) // optimistic
    try {
      await reorderPackageImages(activeId, next)
    } catch (err) {
      setError(err.message || 'Could not save new order')
      setImagesByPackage(m => ({ ...m, [activeId]: activeImages })) // revert
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-violet border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-bricolage font-black text-2xl text-ink">Package images</h1>
        <p className="text-gray text-sm">
          Controls the image slideshow shown when a visitor opens a package on the homepage.
          Title, description, and features stay in the codebase — only images live here.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg">
          <FiAlertCircle size={14} className="flex-shrink-0" /> {error}
        </div>
      )}

      {/* Package tabs */}
      <div className="flex gap-2 flex-wrap">
        {PACKAGES.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all
              ${activeId === p.id
                ? 'bg-violet text-yellow border-ink shadow-[3px_3px_0_#120D1E]'
                : 'bg-white text-ink-soft border-ink/20 hover:border-violet hover:text-violet'}`}
          >
            {p.label}
            <span className="ml-1.5 text-xs opacity-70">
              {(imagesByPackage[p.id] || []).length}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border-2 border-ink p-5 shadow-[3px_3px_0_#120D1E] space-y-4">
        <h2 className="font-bricolage font-bold text-base text-ink border-b border-ink/10 pb-2 flex items-center justify-between">
          Images
          <span className="text-gray text-xs font-normal">{activeImages.length}/{MAX_IMAGES}</span>
        </h2>

        {/* Upload zone */}
        {activeImages.length < MAX_IMAGES && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              handleFiles(Array.from(e.dataTransfer.files))
            }}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
              ${isDragging ? 'border-violet bg-violet-pale' : 'border-ink/20 hover:border-violet/40 hover:bg-violet-pale/30'}`}
          >
            <FiUploadCloud size={22} className="mx-auto mb-2 text-violet" />
            <p className="text-sm text-ink-soft">
              {isDragging ? 'Drop images here' : 'Drag images or click to browse'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(Array.from(e.target.files))}
            />
          </div>
        )}

        {uploading && (
          <div className="space-y-1.5">
            <p className="text-xs text-gray">{uploadPct}% uploaded</p>
            <div className="w-full bg-light-gray rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-violet rounded-full transition-all"
                style={{ width: `${uploadPct}%` }}
              />
            </div>
          </div>
        )}

        {activeImages.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {activeImages.map((url, i) => (
              <ImagePreview
                key={url}
                url={url}
                index={i}
                total={activeImages.length}
                onRemove={() => handleRemove(url)}
                onMoveUp={() => handleReorder(i, i - 1)}
                onMoveDown={() => handleReorder(i, i + 1)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray text-sm text-center py-6">
            No images uploaded yet — the homepage falls back to its default image for this package.
          </p>
        )}
      </div>
    </div>
  )
}
