'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import { useGbajoStore, Tenant } from '@/store/gbajoStore'
import { Plus, Trash2, Edit2, Building2 } from 'lucide-react'

export default function TenantsPage() {
  const { tenants, addTenant, updateTenant, deleteTenant } = useGbajoStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Tenant>>({})

  const handleOpen = (t?: Tenant) => {
    if (t) { setFormData(t); setEditingId(t.id) }
    else { setFormData({ name: '', email: '', status: 'active', maxMembers: 10 }); setEditingId(null) }
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) updateTenant(editingId, formData)
    else addTenant({ id: Date.now().toString(), name: formData.name || '', email: formData.email || '', status: (formData.status as any) || 'active', createdDate: new Date().toISOString().split('T')[0], maxMembers: formData.maxMembers || 10, currentMembers: 0 })
    setIsOpen(false)
  }

  const columns = [
    {
      key: 'name', label: 'Organization', render: (v: string) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-100 rounded-lg flex items-center justify-center">
            <Building2 size={16} className="text-brand-600" />
          </div>
          <span className="font-semibold text-gray-900">{v}</span>
        </div>
      )
    },
    { key: 'email', label: 'Email' },
    { key: 'createdDate', label: 'Created' },
    { key: 'currentMembers', label: 'Members', render: (v: number, r: Tenant) => `${v}/${r.maxMembers}` },
    { key: 'status', label: 'Status', render: (v: string) => <span className={v === 'active' ? 'badge-success' : 'badge-warning'}>{v}</span> },
    {
      key: 'id', label: 'Actions', render: (val: string, row: Tenant) => (
        <div className="flex gap-2">
          <button onClick={() => handleOpen(row)} className="w-8 h-8 bg-gray-50 hover:bg-brand-50 rounded-lg flex items-center justify-center"><Edit2 size={14} /></button>
          <button onClick={() => deleteTenant(val)} className="w-8 h-8 bg-gray-50 hover:bg-red-50 rounded-lg flex items-center justify-center"><Trash2 size={14} className="text-red-500" /></button>
        </div>
      )
    },
  ]

  const totalMembers = tenants.reduce((s, t) => s + t.currentMembers, 0)
  const totalCapacity = tenants.reduce((s, t) => s + t.maxMembers, 0)

  return (
    <DashboardLayout>
      <PageHeader title="Tenants" subtitle="Manage cooperative organizations" action={
        <button onClick={() => handleOpen()} className="btn-primary"><Plus size={16} />Add Organization</button>
      } />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Organizations" value={tenants.length} trend="All registered tenants" highlight />
        <StatCard label="Active" value={tenants.filter(t => t.status === 'active').length} trend="Currently operational" />
        <StatCard label="Total Members" value={totalMembers} trend="Across all tenants" />
        <StatCard label="Capacity" value={`${Math.round((totalMembers / totalCapacity) * 100)}%`} trend="Utilization rate" />
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">All Organizations</h2>
        <Table columns={columns} data={tenants} />
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingId ? 'Edit Organization' : 'Add Organization'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Organization Name</label>
            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-base" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Members</label>
              <input type="number" value={formData.maxMembers || 10} onChange={(e) => setFormData({ ...formData, maxMembers: +e.target.value })} className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
              <select value={formData.status || 'active'} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="input-base">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
