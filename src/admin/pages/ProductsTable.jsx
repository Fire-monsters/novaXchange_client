/**
 * ProductsTable.jsx
 * ──────────────────────────────────────────────────────────────────
 * Admin product list: search, category/tier filter, active/draft toggle,
 * inline stock edit, row actions (edit/duplicate/delete), bulk actions,
 * pagination.
 * ──────────────────────────────────────────────────────────────────
 */
import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiSearch, FiEdit2, FiCopy, FiTrash2, FiChevronLeft, FiChevronRight,
  FiPackage, FiCheck, FiX, FiPlus,
} from 'react-icons/fi'
import {
  getProducts, getCategories, patchStock, deleteProduct, bulkAction,
} from '../../api/catalog'

const TIERS = ['premium', 'mid-range', 'budget']
const LIMIT = 20

// ── Inline stock editor ─────────────────────────────────────────────
const StockCell = ({ product, onSaved }) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(product.stock)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    const n = Number(value)
    if (isNaN(n) || n < 0) { setValue(product.stock); setEditing(false); return }
    if (n === product.stock) { setEditing(false); return }
    setSaving(true)
    try {
      const updated = await patchStock(product.id, n)
      onSaved(updated)
    } catch (err) {
      alert(`Failed to update stock: ${err.message}`)
      setValue(product.stock)
    } finally {
      setSaving(false)
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <input
        type="number" min="0" autoFocus
        value={value}
        disabled={saving}
        onChange={e => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={e => {
          if (e.key === 'Enter') save()
          if (e.key === 'Escape') { setValue(product.stock); setEditing(false) }
        }}
        className="w-16 px-2 py-1 border-2 border-violet rounded-lg text-sm text-center focus:outline-none"
      />
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={`px-2 py-1 rounded-lg text-sm font-semibold border border-transparent
        hover:border-ink/20 hover:bg-light-gray transition
        ${product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-orange-600' : 'text-ink'}`}
      title="Click to edit stock"
    >
      {product.stock}
    </button>
  )
}

export default function ProductsTable() {
  const navigate = useNavigate()

  const [items, setItems]         = useState([])
  const [total, setTotal]          = useState(0)
  const [pages, setPages]          = useState(1)
  const [page, setPage]            = useState(1)
  const [loading, setLoading]      = useState(true)

  const [search, setSearch]        = useState('')
  const [category, setCategory]    = useState('')
  const [tier, setTier]            = useState('')
  const [status, setStatus]        = useState('all') // all | active | draft
  const [categories, setCategories]= useState([])
  const [selected, setSelected]    = useState(new Set())

  // Load categories once
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  // Load products whenever filters change
  const load = useCallback(() => {
    setLoading(true)
    const params = { page, limit: LIMIT, search }
    if (category) params.category = category
    if (tier)      params.tier     = tier
    if (status === 'active') params.active = true
    if (status === 'draft')  params.active = false
    // 'all' → fetch both via active=false (includes drafts) — admin sees everything
    if (status === 'all')    params.active = false

    getProducts(params)
      .then(res => {
        setItems(res.items)
        setTotal(res.total)
        setPages(res.pages)
      })
      .catch(err => {
        console.error(err)
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [page, search, category, tier, status])

  useEffect(() => { load() }, [load])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [search, category, tier, status])

  // ── Row helpers ──────────────────────────────────────────────────
  const updateRow = (updated) => {
    setItems(items => items.map(p => p.id === updated.id ? updated : p))
  }

  const toggleSelect = (id) => {
    setSelected(s => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === items.length) setSelected(new Set())
    else setSelected(new Set(items.map(p => p.id)))
  }

  const handleDelete = async (product) => {
    const hard = window.confirm(
      `Delete "${product.name}"?\n\nClick OK to permanently delete (removes images from storage too).\nClick Cancel to just unpublish it (soft delete — keeps it as a draft).`
    )
    // If user cancels the confirm, do nothing
    if (!hard) {
      const soft = window.confirm(`Unpublish "${product.name}" instead? (sets it to draft)`)
      if (!soft) return
    }
    try {
      await deleteProduct(product.id, hard)
      load()
    } catch (err) {
      alert(`Failed: ${err.message}`)
    }
  }

  const handleBulk = async (action) => {
    if (selected.size === 0) return
    const label = { activate: 'activate', deactivate: 'unpublish (set to draft)', delete: 'permanently delete' }[action]
    if (!window.confirm(`${label} ${selected.size} product(s)?`)) return
    try {
      await bulkAction([...selected], action)
      setSelected(new Set())
      load()
    } catch (err) {
      alert(`Bulk action failed: ${err.message}`)
    }
  }

  const clearFilters = () => {
    setSearch(''); setCategory(''); setTier(''); setStatus('all')
  }

  const filtersActive = search || category || tier || status !== 'all'

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-bricolage font-black text-2xl text-ink">Products</h1>
          <p className="text-gray text-sm">{total} total</p>
        </div>
        <Link
          to="/admin/products/upload"
          className="flex items-center gap-1.5 bg-violet text-yellow text-sm font-bold
                     px-4 py-2.5 rounded-lg border-2 border-ink shadow-[2px_2px_0_#120D1E]
                     hover:shadow-[3px_3px_0_#120D1E] hover:-translate-x-px hover:-translate-y-px transition-all w-fit"
        >
          <FiPlus size={14} /> Add product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border-2 border-ink p-4 shadow-[3px_3px_0_#120D1E] space-y-3">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name or description…"
              className="w-full pl-9 pr-3 py-2 border-2 border-ink/15 rounded-lg text-sm
                         focus:outline-none focus:border-violet transition-colors"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-3 py-2 border-2 border-ink/15 rounded-lg text-sm focus:outline-none focus:border-violet"
          >
            <option value="">All categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>

          {/* Tier */}
          <select
            value={tier}
            onChange={e => setTier(e.target.value)}
            className="px-3 py-2 border-2 border-ink/15 rounded-lg text-sm capitalize focus:outline-none focus:border-violet"
          >
            <option value="">All tiers</option>
            {TIERS.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
          </select>

          {/* Status */}
          <div className="flex border-2 border-ink/15 rounded-lg overflow-hidden text-sm font-medium">
            {[
              { id: 'all',    label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'draft',  label: 'Draft' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setStatus(s.id)}
                className={`px-3 py-2 transition ${status === s.id ? 'bg-violet text-yellow' : 'bg-white text-ink-soft hover:bg-light-gray'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {filtersActive && (
            <button onClick={clearFilters} className="text-sm text-violet hover:underline font-medium">
              Clear filters
            </button>
          )}
        </div>

        {/* Bulk actions bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 bg-violet-pale rounded-lg px-3 py-2 text-sm">
            <span className="font-semibold text-violet">{selected.size} selected</span>
            <button onClick={() => handleBulk('activate')} className="flex items-center gap-1 text-green-700 hover:underline font-medium">
              <FiCheck size={13} /> Activate
            </button>
            <button onClick={() => handleBulk('deactivate')} className="flex items-center gap-1 text-gray-600 hover:underline font-medium">
              <FiX size={13} /> Deactivate
            </button>
            <button onClick={() => handleBulk('delete')} className="flex items-center gap-1 text-red-600 hover:underline font-medium">
              <FiTrash2 size={13} /> Delete
            </button>
            <button onClick={() => setSelected(new Set())} className="ml-auto text-gray hover:text-ink">
              <FiX size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border-2 border-ink shadow-[3px_3px_0_#120D1E] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-violet border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <FiPackage size={32} className="text-gray/30" />
            <p className="text-gray text-sm">No products found</p>
            {filtersActive && (
              <button onClick={clearFilters} className="text-violet text-sm font-semibold hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink/10 text-left text-xs text-gray uppercase tracking-wide">
                  <th className="px-4 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={selected.size === items.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-violet"
                    />
                  </th>
                  <th className="px-2 py-3">Product</th>
                  <th className="px-2 py-3">Category</th>
                  <th className="px-2 py-3">Tier</th>
                  <th className="px-2 py-3">Price</th>
                  <th className="px-2 py-3">Stock</th>
                  <th className="px-2 py-3">Status</th>
                  <th className="px-2 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {items.map(p => (
                  <tr key={p.id} className="hover:bg-light-gray transition">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="w-4 h-4 accent-violet"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <div className="w-10 h-10 rounded-lg bg-light-gray flex-shrink-0 overflow-hidden border border-ink/10">
                          {p.images?.[0]
                            ? <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                            : <FiPackage size={16} className="m-auto mt-2.5 text-gray" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink truncate">{p.name}</p>
                          <p className="text-xs text-gray font-mono truncate">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 capitalize text-ink-soft">{p.category}</td>
                    <td className="px-2 py-3 capitalize text-ink-soft">{p.tier}</td>
                    <td className="px-2 py-3 font-bricolage font-bold text-violet whitespace-nowrap">
                      UGX {p.price_ugx.toLocaleString()}
                    </td>
                    <td className="px-2 py-3">
                      <StockCell product={p} onSaved={updateRow} />
                    </td>
                    <td className="px-2 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                        ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                        onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-soft hover:bg-violet-pale hover:text-violet transition"
                        title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/products/upload?duplicate=${p.id}`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-soft hover:bg-violet-pale hover:text-violet transition"
                          title="Duplicate"
                        >
                          <FiCopy size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-soft hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-ink/10 text-sm">
            <span className="text-gray">Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg border border-ink/15 flex items-center justify-center disabled:opacity-30 hover:bg-light-gray"
              >
                <FiChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="w-8 h-8 rounded-lg border border-ink/15 flex items-center justify-center disabled:opacity-30 hover:bg-light-gray"
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}