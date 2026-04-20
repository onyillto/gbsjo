'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import { useGbajoStore, Payment } from '@/store/gbajoStore'
import { Plus, Trash2, DollarSign } from 'lucide-react'

export default function PaymentsPage() {
  const { payments, addPayment, deletePayment, users } = useGbajoStore()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Payment>>({})

  const handleOpen = () => {
    setFormData({ memberId: '', amount: 0, type: 'contribution', status: 'pending' })
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addPayment({
      id: Date.now().toString(),
      memberId: formData.memberId || '',
      amount: formData.amount || 0,
      type: (formData.type as any) || 'contribution',
      status: (formData.status as any) || 'pending',
      date: new Date().toISOString().split('T')[0],
      reference: `PAY${Date.now().toString().slice(-6)}`,
    })
    setIsOpen(false)
  }

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
    { key: 'amount', label: 'Amount', render: (v: number) => <span className="font-semibold">₦{v.toLocaleString()}</span> },
    { key: 'type', label: 'Type', render: (v: string) => <span className="badge-info">{v}</span> },
    {
      key: 'status', label: 'Status', render: (v: string) => {
        const map: any = { completed: 'badge-success', pending: 'badge-warning', failed: 'badge-danger' }
        return <span className={map[v]}>{v}</span>
      }
    },
    { key: 'date', label: 'Date' },
    { key: 'reference', label: 'Reference', render: (v: string) => <span className="text-xs font-mono text-gray-500">{v}</span> },
    {
      key: 'id', label: '', render: (v: string) => (
        <button onClick={() => deletePayment(v)} className="w-8 h-8 bg-gray-50 hover:bg-red-50 rounded-lg flex items-center justify-center"><Trash2 size={14} className="text-red-500" /></button>
      )
    },
  ]

  const total = payments.reduce((s, p) => s + p.amount, 0)
  const completed = payments.filter(p => p.status === 'completed').length

  return (
    <DashboardLayout>
      <PageHeader title="Payments" subtitle="All payment transactions" action={
        <button onClick={handleOpen} className="btn-primary"><Plus size={16} />Record Payment</button>
      } />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Value" value={`₦${(total / 1000000).toFixed(2)}M`} trend="All transactions" highlight />
        <StatCard label="Completed" value={completed} trend="Successfully processed" />
        <StatCard label="Pending" value={payments.filter(p => p.status === 'pending').length} trend="Awaiting processing" />
        <StatCard label="Success Rate" value={`${payments.length ? Math.round((completed / payments.length) * 100) : 0}%`} trend="Completion rate" />
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h2>
        <Table columns={columns} data={payments} />
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Record Payment">
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type</label>
              <select value={formData.type || 'contribution'} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="input-base">
                <option value="contribution">Contribution</option>
                <option value="subscription">Subscription</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
              <select value={formData.status || 'pending'} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="input-base">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
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
