import React, { useState, useEffect } from 'react'
import { FiTag, FiPlus, FiTrash2 } from 'react-icons/fi'
import { getCategories, createCategory, deleteCategory } from '../../api/catalog'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ id: '', label: '' })
  const [error, setError] = useState('')

  const load = () => getCategories().then(setCategories).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const slugifyId = (s) => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.id.trim() || !form.label.trim()) return
    try {
      await createCategory({ id: slugifyId(form.id), label: form.label.trim() })
      setForm({ id: '', label: '' })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete category "${id}"? Products already using it keep this value, but it won't show in filters.`)) return
    try {
      await deleteCategory(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-bricolage font-black text-2xl text-ink">Categories</h1>
        <p className="text-gray text-sm">Drive the filter pills in the store and admin product form</p>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-white rounded-xl border-2 border-ink p-4 shadow-[3px_3px_0_#120D1E] flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-ink-soft mb-1">Label</label>
          <input
            value={form.label}
            onChange={e => setForm(f => ({ ...f, label: e.target.value, id: f.id || slugifyId(e.target.value) }))}
            placeholder="e.g. Webcams"
            className="w-full px-3 py-2 border-2 border-ink/15 rounded-lg text-sm focus:outline-none focus:border-violet"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs
          font-semibold text-ink-soft mb-1">
            ID (slug)</label>
          <input
            value={form.id}
            onChange={e => setForm(f => ({ ...f, id: slugifyId(e.target.value) }))}
            placeholder="webcam"
            className="w-full px-3 py-2 border-2 border-ink/15 rounded-lg text-sm font-mono focus:outline-none focus:border-violet"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-1.5 bg-violet text-yellow text-sm font-bold px-4 py-2.5 rounded-lg border-2 border-ink shadow-[2px_2px_0_#120D1E] hover:shadow-[3px_3px_0_#120D1E] transition-all"
        >
          <FiPlus size={14} /> Add
        </button>
      </form>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* List */}
      <div className="bg-white rounded-xl border-2 border-ink shadow-[3px_3px_0_#120D1E] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-4 border-violet border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-ink/5">
            {categories.map(c => (
              <div key={c.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <FiTag size={14} className="text-violet" />
                  <div>
                    <p className="font-semibold text-ink text-sm">{c.label}</p>
                    <p className="text-xs text-gray font-mono">{c.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-soft hover:bg-red-50 hover:text-red-600 transition"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}