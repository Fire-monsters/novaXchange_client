import { FiCheckCircle, FiPackage, FiTruck, FiXCircle, FiClock } from 'react-icons/fi'

export const ORDER_STATUS_META = {
  pending:   { label: 'Pending confirmation', icon: FiClock,       color: 'text-orange-600 bg-orange-50 border-orange-200' },
  confirmed: { label: 'Confirmed',             icon: FiCheckCircle, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  packed:    { label: 'Packed',                icon: FiPackage,     color: 'text-violet bg-violet-pale border-violet/20' },
  shipped:   { label: 'Shipped',               icon: FiTruck,       color: 'text-blue-600 bg-blue-50 border-blue-200' },
  delivered: { label: 'Delivered',             icon: FiCheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  cancelled: { label: 'Cancelled',             icon: FiXCircle,     color: 'text-red-600 bg-red-50 border-red-200' },
}

export default function OrderStatusBadge({ status, size = 'md' }) {
  const meta = ORDER_STATUS_META[status] || ORDER_STATUS_META.pending
  const Icon = meta.icon
  const cls = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-4 py-3'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-xl border-2 font-semibold ${cls} ${meta.color}`}>
      <Icon size={size === 'sm' ? 12 : 18} /> {meta.label}
    </span>
  )
}
