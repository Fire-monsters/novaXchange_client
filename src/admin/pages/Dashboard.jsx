import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiAlertCircle, FiCheckCircle, FiFileText, FiArrowRight, FiUploadCloud } from 'react-icons/fi'
import { getProducts } from '../../api/catalog'

const StatCard = ({ label, value, sub, subColor = 'text-gray', icon: Icon, iconColor = 'text-violet' }) => (
  <div className="bg-white rounded-xl border-2 border-ink p-4 shadow-[3px_3px_0_#120D1E]">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray font-medium uppercase tracking-wide mb-1">{label}</p>
        <p className="font-bricolage font-black text-3xl text-ink">{value}</p>
        {sub && <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>}
      </div>
      <div className={`w-9 h-9 rounded-lg bg-violet-pale flex items-center justify-center ${iconColor}`}>
        <Icon size={18} />
      </div>
    </div>
  </div>
)

export default function Dashboard() {
  const [stats, setStats]     = useState(null)
  const [recent, setRecent]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getProducts({ active: true,  limit: 1 }),
      getProducts({ active: false, limit: 100 }),
      getProducts({ active: true,  limit: 6 }),
    ]).then(([active, all, latest]) => {
      const drafts   = all.items.filter(p => !p.active).length
      const lowStock = active.items.filter(p => p.stock <= 5)
      setStats({ active: active.total, total: all.total, drafts, lowStock })
      setRecent(latest.items)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-violet border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-bricolage font-black text-2xl text-ink">Dashboard</h1>
        <p className="text-gray text-sm">Catalog overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Active products"  value={stats?.active}    icon={FiCheckCircle} sub="In store now" subColor="text-green-600" />
        <StatCard label="Total products"   value={stats?.total}     icon={FiPackage} sub="Including drafts" />
        <StatCard label="Draft / inactive" value={stats?.drafts}    icon={FiFileText} sub="Not in store" />
        <StatCard label="Low stock"        value={stats?.lowStock?.length} icon={FiAlertCircle} iconColor="text-orange-500" sub="≤ 5 units left" subColor="text-orange-500" />
      </div>

      {/* Low stock alert */}
      {stats?.lowStock?.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <FiAlertCircle size={16} className="text-orange-500" />
            <h3 className="font-bold text-sm text-orange-800">Low stock — restock soon</h3>
          </div>
          <div className="space-y-2">
            {stats.lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-orange-100">
                <div className="flex items-center gap-3">
                  {p.images[0] && <img src={p.images[0]} className="w-8 h-8 rounded object-cover" alt="" />}
                  <span className="text-sm font-medium text-ink">{p.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${p.stock === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                    {p.stock} left
                  </span>
                  <Link
                    to={`/admin/products/edit/${p.id}`}
                    className="text-xs text-violet hover:underline font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent products */}
      <div className="bg-white rounded-xl border-2 border-ink shadow-[3px_3px_0_#120D1E] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10">
          <h3 className="font-bricolage font-bold text-sm">Recent products</h3>
          <Link to="/admin/products" className="text-violet text-xs font-semibold hover:underline flex items-center gap-1">
            View all <FiArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-ink/5">
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <FiPackage size={32} className="text-gray/30" />
              <p className="text-gray text-sm">No products yet</p>
              <Link to="/admin/products/upload" className="text-violet text-sm font-semibold hover:underline flex items-center gap-1">
                <FiUploadCloud size={14} /> Upload your first product
              </Link>
            </div>
          ) : recent.map(p => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-light-gray transition">
              <div className="w-10 h-10 rounded-lg bg-light-gray flex-shrink-0 overflow-hidden border border-ink/10">
                {p.images[0]
                  ? <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                  : <FiPackage size={16} className="m-auto mt-2.5 text-gray" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{p.name}</p>
                <p className="text-xs text-gray capitalize">{p.category} · {p.tier}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bricolage font-bold text-sm text-violet">UGX {p.price_ugx.toLocaleString()}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {p.active ? 'Active' : 'Draft'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}