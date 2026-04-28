'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import { useGbajoStore, Withdrawal } from '@/store/gbajoStore'
import { Plus, Trash2, Edit2 } from 'lucide-react'

export default function WithdrawalsPage() {
  const { withdrawals, addWithdrawal, updateWithdrawal, deleteWithdrawal, users } = useGbajoStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Withdrawal>>({})

  const handleOpen = (w?: Withdrawal) => {
    if (w) { setFormData(w); setEditingId(w.id) }
    else { setFormData({ memberId: '', amount: 0, status: 'pending', bankAccount: '' }); setEditingId(null) }
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) updateWithdrawal(editingId, formData)
    else addWithdrawal({
      id: Date.now().toString(),
      memberId: formData.memberId || '',
      amount: formData.amount || 0,
      status: (formData.status as any) || 'pending',
      requestDate: new Date().toISOString().split('T')[0],
      bankAccount: formData.bankAccount || '',
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
    {
      key: 'status', label: 'Status', render: (v: string) => {
        const map: any = { pending: 'badge-warning', approved: 'badge-info', completed: 'badge-success', rejected: 'badge-danger' }
        return <span className={map[v]}>{v}</span>
      }
    },
    { key: 'requestDate', label: 'Request Date' },
    { key: 'bankAccount', label: 'Account' },
    {
      key: 'id', label: 'Actions', render: (val: string, row: Withdrawal) => (
        <div className="flex gap-2">
          <button onClick={() => handleOpen(row)} className="w-8 h-8 bg-gray-50 hover:bg-brand-50 rounded-lg flex items-center justify-center"><Edit2 size={14} /></button>
          <button onClick={() => deleteWithdrawal(val)} className="w-8 h-8 bg-gray-50 hover:bg-red-50 rounded-lg flex items-center justify-center"><Trash2 size={14} className="text-red-500" /></button>
        </div>
      )
    },
  ]

  const total = withdrawals.reduce((s, w) => s + w.amount, 0)
  const pendingAmount = withdrawals.filter(w => w.status === 'pending' || w.status === 'approved').reduce((s, w) => s + w.amount, 0)

  return (
    <DashboardLayout>
      <PageHeader title="Withdrawals" subtitle="Manage withdrawal requests" action={
        <button onClick={() => handleOpen()} className="btn-primary"><Plus size={16} />New Request</button>
      } />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Requested" value={`₦${(total / 1000000).toFixed(2)}M`} trend="All requests" highlight />
        <StatCard label="Completed" value={withdrawals.filter(w => w.status === 'completed').length} trend="Successfully processed" />
        <StatCard label="Pending" value={withdrawals.filter(w => w.status === 'pending').length} trend="Awaiting approval" />
        <StatCard label="Pending Value" value={`₦${(pendingAmount / 1000).toFixed(0)}K`} trend="Awaiting processing" />
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">All Withdrawal Requests</h2>
        <Table columns={columns} data={withdrawals} />
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingId ? 'Edit Withdrawal' : 'New Withdrawal'}>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bank Account</label>
            <input type="text" value={formData.bankAccount || ''} onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })} className="input-base" placeholder="e.g., XXX1234" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
            <select value={formData.status || 'pending'} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="input-base">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center">{editingId ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
