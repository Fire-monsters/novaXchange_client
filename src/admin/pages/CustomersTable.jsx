/**
 * CustomersTable.jsx
 * ──────────────────────────────────────────────────────────────────
 * Read-only list of registered customer accounts. Mirrors
 * ProductsTable.jsx's search/pagination shape.
 * ──────────────────────────────────────────────────────────────────
 */
import React, { useState, useEffect, useCallback } from 'react'
import { FiSearch, FiChevronLeft, FiChevronRight, FiUsers } from 'react-icons/fi'
import { listCustomersAdmin } from '../../api/catalog'

const LIMIT = 20

export default function CustomersTable() {
  const [items, setItems]     = useState([])
  const [total, setTotal]     = useState(0)
  const [pages, setPages]     = useState(1)
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  const load = useCallback(() => {
    setLoading(true)
    listCustomersAdmin({ page, limit: LIMIT, search })
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
  }, [page, search])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [search])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-bricolage font-black text-2xl text-ink">Customers</h1>
        <p className="text-gray text-sm">{total} registered</p>
      </div>

      <div className="bg-white rounded-xl border-2 border-ink p-4 shadow-[3px_3px_0_#120D1E]">
        <div className="relative max-w-md">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, WhatsApp…"
            className="w-full pl-9 pr-3 py-2 border-2 border-ink/15 rounded-lg text-sm
                       focus:outline-none focus:border-violet transition-colors"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-ink shadow-[3px_3px_0_#120D1E] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-violet border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <FiUsers size={32} className="text-gray/30" />
            <p className="text-gray text-sm">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink/10 text-left text-xs text-gray uppercase tracking-wide">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-2 py-3">Email</th>
                  <th className="px-2 py-3">WhatsApp</th>
                  <th className="px-2 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {items.map(u => (
                  <tr key={u.id} className="hover:bg-light-gray transition">
                    <td className="px-4 py-3 font-semibold text-ink">{u.name}</td>
                    <td className="px-2 py-3 text-ink-soft">{u.email}</td>
                    <td className="px-2 py-3 text-ink-soft">{u.whatsapp || '—'}</td>
                    <td className="px-2 py-3 text-ink-soft whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
