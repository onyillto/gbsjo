'use client'

import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import Table from '@/components/Table'
import { useGbajoStore } from '@/store/gbajoStore'
import { Wallet as WalletIcon } from 'lucide-react'

export default function WalletsPage() {
  const { wallets, users } = useGbajoStore()

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0)
  const totalEarned = wallets.reduce((s, w) => s + w.totalEarned, 0)

  const columns = [
    {
      key: 'memberId', label: 'Member', render: (v: string) => {
        const m = users.find(u => u.id === v)
        const name = m?.name || 'Unknown'
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
              {name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <span className="font-semibold text-gray-900">{name}</span>
          </div>
        )
      }
    },
    { key: 'balance', label: 'Current Balance', render: (v: number) => <span className="font-semibold text-brand-600">₦{v.toLocaleString()}</span> },
    { key: 'totalEarned', label: 'Total Earned', render: (v: number) => <span className="font-semibold">₦{v.toLocaleString()}</span> },
    { key: 'lastUpdated', label: 'Last Updated' },
  ]

  const topEarners = [...wallets].sort((a, b) => b.totalEarned - a.totalEarned).slice(0, 5)

  return (
    <DashboardLayout>
      <PageHeader title="Member Wallets" subtitle="Track balances and earnings" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Balance" value={`₦${(totalBalance / 1000000).toFixed(1)}M`} trend="Across all members" highlight />
        <StatCard label="Total Earned" value={`₦${(totalEarned / 1000000).toFixed(1)}M`} trend="Lifetime earnings" />
        <StatCard label="Active Wallets" value={wallets.length} trend="With balance" />
        <StatCard label="Average Balance" value={`₦${wallets.length ? (totalBalance / wallets.length / 1000).toFixed(0) : 0}K`} trend="Per wallet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">All Wallets</h2>
          <Table columns={columns} data={wallets} />
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Earners</h2>
          <div className="space-y-3">
            {topEarners.map((w, i) => {
              const m = users.find(u => u.id === w.memberId)
              const name = m?.name || 'Unknown'
              return (
                <div key={w.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-xs">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                    <p className="text-xs text-gray-500">₦{(w.totalEarned / 1000).toFixed(0)}K earned</p>
                  </div>
                  <WalletIcon size={16} className="text-brand-600" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
