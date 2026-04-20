'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import { useGbajoStore, Contribution } from '@/store/gbajoStore'
import { Plus, Trash2 } from 'lucide-react'

export default function ContributionsPage() {
  const { contributions, addContribution, deleteContribution, users } = useGbajoStore()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Contribution>>({})

  const handleOpen = () => {
    setFormData({ memberId: '', amount: 0, month: '', status: 'pending' })
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selected = users.find(u => u.id === formData.memberId)
    addContribution({
      id: Date.now().toString(),
      memberId: formData.memberId || '',
      memberName: selected?.name || '',
      amount: formData.amount || 0,
      date: new Date().toISOString().split('T')[0],
      month: formData.month || '',
      status: (formData.status as any) || 'pending',
      reference: `TXN${Date.now().toString().slice(-6)}`
    })
    setIsOpen(false)
  }

  const columns = [
    {
      key: 'memberName', label: 'Member', render: (v: string) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
            {v.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="font-semibold text-gray-900">{v}</span>
        </div>
      )
    },
    { key: 'amount', label: 'Amount', render: (v: number) => <span className="font-semibold">₦{v.toLocaleString()}</span> },
    { key: 'month', label: 'Month' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (v: string) => <span className={v === 'completed' ? 'badge-success' : 'badge-warning'}>{v}</span> },
    { key: 'reference', label: 'Reference', render: (v: string) => <span className="text-xs font-mono text-gray-500">{v}</span> },
    {
      key: 'id', label: '', render: (val: string) => (
        <button onClick={() => deleteContribution(val)} className="w-8 h-8 bg-gray-50 hover:bg-red-50 rounded-lg flex items-center justify-center"><Trash2 size={14} className="text-red-500" /></button>
      )
    },
  ]

  const total = contributions.reduce((s, c) => s + c.amount, 0)

  return (
    <DashboardLayout>
      <PageHeader title="Contributions" subtitle="Track and manage member contributions" action={
        <button onClick={handleOpen} className="btn-primary"><Plus size={16} />Record Contribution</button>
      } />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Amount" value={`₦${(total / 1000000).toFixed(2)}M`} trend="All contributions" highlight />
        <StatCard label="Completed" value={contributions.filter(c => c.status === 'completed').length} trend="Paid in full" />
        <StatCard label="Pending" value={contributions.filter(c => c.status === 'pending').length} trend="Awaiting payment" />
        <StatCard label="Average" value={`₦${contributions.length ? (total / contributions.length / 1000).toFixed(0) : 0}K`} trend="Per contribution" />
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Contributions</h2>
        <Table columns={columns} data={contributions} />
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Record Contribution">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Member</label>
            <select value={formData.memberId || ''} onChange={(e) => setFormData({ ...formData, memberId: e.target.value })} className="input-base" required>
              <option value="">Select member</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount (₦)</label>
            <input type="number" value={formData.amount || 0} onChange={(e) => setFormData({ ...formData, amount: +e.target.value })} className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Month</label>
            <input type="text" value={formData.month || ''} onChange={(e) => setFormData({ ...formData, month: e.target.value })} className="input-base" placeholder="e.g., April" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
            <select value={formData.status || 'pending'} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="input-base">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center">Record</button>
            <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
