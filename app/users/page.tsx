'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import { useGbajoStore, User } from '@/store/gbajoStore'
import { Plus, Trash2, Edit2, Users as UsersIcon } from 'lucide-react'

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useGbajoStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<User>>({})

  const handleOpen = (user?: User) => {
    if (user) { setFormData(user); setEditingId(user.id) }
    else { setFormData({ name: '', email: '', phone: '', role: 'member', status: 'active' }); setEditingId(null) }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) updateUser(editingId, formData)
    else addUser({ id: Date.now().toString(), name: formData.name || '', email: formData.email || '', phone: formData.phone || '', joinDate: new Date().toISOString().split('T')[0], role: (formData.role as 'member' | 'admin') || 'member', status: (formData.status as 'active' | 'inactive') || 'active' })
    setIsModalOpen(false)
  }

  const columns = [
    {
      key: 'name', label: 'Member', render: (val: string, row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
            {val.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{val}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role', render: (v: string) => <span className={v === 'admin' ? 'badge-info' : 'badge-neutral'}>{v}</span> },
    { key: 'status', label: 'Status', render: (v: string) => <span className={v === 'active' ? 'badge-success' : 'badge-warning'}>{v}</span> },
    {
      key: 'id', label: 'Actions', render: (val: string, row: User) => (
        <div className="flex gap-2">
          <button onClick={() => handleOpen(row)} className="w-8 h-8 bg-gray-50 hover:bg-brand-50 rounded-lg flex items-center justify-center"><Edit2 size={14} className="text-gray-600" /></button>
          <button onClick={() => deleteUser(val)} className="w-8 h-8 bg-gray-50 hover:bg-red-50 rounded-lg flex items-center justify-center"><Trash2 size={14} className="text-red-500" /></button>
        </div>
      )
    },
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Members" subtitle="Manage all cooperative members" action={
        <button onClick={() => handleOpen()} className="btn-primary"><Plus size={16} />Add Member</button>
      } />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Members" value={users.length} trend="All registered members" highlight />
        <StatCard label="Active" value={users.filter(u => u.status === 'active').length} trend="Currently active" />
        <StatCard label="Admins" value={users.filter(u => u.role === 'admin').length} trend="With admin access" />
        <StatCard label="Inactive" value={users.filter(u => u.status === 'inactive').length} trend="Not active" />
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">All Members</h2>
        <Table columns={columns} data={users} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Member' : 'Add Member'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
            <input type="tel" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-base" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
              <select value={formData.role || 'member'} onChange={(e) => setFormData({ ...formData, role: e.target.value as any })} className="input-base">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
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
            <button type="submit" className="btn-primary flex-1 justify-center">{editingId ? 'Update' : 'Add'} Member</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
