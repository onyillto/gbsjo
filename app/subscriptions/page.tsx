'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import { useGbajoStore, Subscription } from '@/store/gbajoStore'
import { Plus, Trash2, Edit2, CreditCard } from 'lucide-react'

export default function SubscriptionsPage() {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription, users } = useGbajoStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Subscription>>({})

  const handleOpen = (s?: Subscription) => {
    if (s) { setFormData(s); setEditingId(s.id) }
    else { setFormData({ memberId: '', planName: '', status: 'active', price: 0, endDate: '', renewalDate: '' }); setEditingId(null) }
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) updateSubscription(editingId, formData)
    else addSubscription({
      id: Date.now().toString(),
      memberId: formData.memberId || '',
      planName: formData.planName || '',
      status: (formData.status as any) || 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: formData.endDate || '',
      price: formData.price || 0,
      renewalDate: formData.renewalDate || '',
    })
    setIsOpen(false)
  }

  const columns = [
    {
      key: 'planName', label: 'Plan', render: (v: string) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-100 rounded-lg flex items-center justify-center">
            <CreditCard size={16} className="text-brand-600" />
          </div>
          <span className="font-semibold text-gray-900">{v}</span>
        </div>
      )
    },
    {
      key: 'memberId', label: 'Member', render: (v: string) => {
        const m = users.find(u => u.id === v)
        return <span className="text-gray-900">{m?.name || 'Unknown'}</span>
      }
    },
    { key: 'price', label: 'Price', render: (v: number) => <span className="font-semibold">₦{v.toLocaleString()}</span> },
    { key: 'renewalDate', label: 'Renewal' },
    {
      key: 'status', label: 'Status', render: (v: string) => {
        const map: any = { active: 'badge-success', paused: 'badge-warning', cancelled: 'badge-danger' }
        return <span className={map[v]}>{v}</span>
      }
    },
    {
      key: 'id', label: 'Actions', render: (val: string, row: Subscription) => (
        <div className="flex gap-2">
          <button onClick={() => handleOpen(row)} className="w-8 h-8 bg-gray-50 hover:bg-brand-50 rounded-lg flex items-center justify-center"><Edit2 size={14} /></button>
          <button onClick={() => deleteSubscription(val)} className="w-8 h-8 bg-gray-50 hover:bg-red-50 rounded-lg flex items-center justify-center"><Trash2 size={14} className="text-red-500" /></button>
        </div>
      )
    },
  ]

  const revenue = subscriptions.reduce((s, x) => s + x.price, 0)

  return (
    <DashboardLayout>
      <PageHeader title="Subscriptions" subtitle="Manage member subscription plans" action={
        <button onClick={() => handleOpen()} className="btn-primary"><Plus size={16} />Add Subscription</button>
      } />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Revenue" value={`₦${(revenue / 1000).toFixed(0)}K`} trend="All plans combined" highlight />
        <StatCard label="Total Plans" value={subscriptions.length} trend="All subscriptions" />
        <StatCard label="Active" value={subscriptions.filter(s => s.status === 'active').length} trend="Currently active" />
        <StatCard label="Paused" value={subscriptions.filter(s => s.status === 'paused').length} trend="Temporarily paused" />
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">All Subscriptions</h2>
        <Table columns={columns} data={subscriptions} />
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingId ? 'Edit Subscription' : 'Add Subscription'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Member</label>
            <select value={formData.memberId || ''} onChange={(e) => setFormData({ ...formData, memberId: e.target.value })} className="input-base" required>
              <option value="">Select member</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Plan Name</label>
            <input type="text" value={formData.planName || ''} onChange={(e) => setFormData({ ...formData, planName: e.target.value })} className="input-base" placeholder="e.g., Premium, Basic" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₦)</label>
              <input type="number" value={formData.price || 0} onChange={(e) => setFormData({ ...formData, price: +e.target.value })} className="input-base" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
              <select value={formData.status || 'active'} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="input-base">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
              <input type="date" value={formData.endDate || ''} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Renewal Date</label>
              <input type="date" value={formData.renewalDate || ''} onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })} className="input-base" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 justify-center">{editingId ? 'Update' : 'Add'}</button>
            <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
