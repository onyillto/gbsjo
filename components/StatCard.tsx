'use client'

import { TrendingUp, ArrowUpRight } from 'lucide-react'
import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  trend?: string
  highlight?: boolean
  icon?: ReactNode
}

export default function StatCard({ label, value, trend, highlight = false, icon }: StatCardProps) {
  return (
    <div className={`${highlight ? 'stat-card-highlight' : 'stat-card'} relative overflow-hidden card-hover`}>
      {/* Dashed decoration */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 dashed-decoration opacity-30"></div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <p className={`text-sm font-semibold ${highlight ? 'text-brand-100' : 'text-gray-600'}`}>{label}</p>
        <button className={`w-7 h-7 rounded-full flex items-center justify-center ${highlight ? 'bg-brand-500' : 'bg-gray-100'}`}>
          <ArrowUpRight size={14} className={highlight ? 'text-white' : 'text-gray-600'} />
        </button>
      </div>

      <h3 className={`text-3xl font-bold mb-3 relative z-10 ${highlight ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </h3>

      {trend && (
        <div className={`flex items-center gap-1 text-xs relative z-10 ${highlight ? 'text-brand-100' : 'text-gray-500'}`}>
          <TrendingUp size={12} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  )
}
