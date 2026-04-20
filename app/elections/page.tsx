'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import Modal from '@/components/Modal'
import { useGbajoStore, Election } from '@/store/gbajoStore'
import { Plus, Trash2, Edit2, Calendar } from 'lucide-react'

export default function ElectionsPage() {
  const { elections, addElection, updateElection, deleteElection } = useGbajoStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Election>>({})
  const [positionInput, setPositionInput] = useState('')

  const handleOpen = (e?: Election) => {
    if (e) { setFormData(e); setEditingId(e.id) }
    else { setFormData({ title: '', description: '', status: 'upcoming', positions: [], totalVotes: 0, quorumRequired: 10 }); setEditingId(null) }
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) updateElection(editingId, formData)
    else addElection({
      id: Date.now().toString(),
      title: formData.title || '',
      description: formData.description || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      status: (formData.status as any) || 'upcoming',
      positions: formData.positions || [],
      totalVotes: 0,
      quorumRequired: formData.quorumRequired || 10,
    })
    setIsOpen(false)
  }

  const addPosition = () => {
    if (positionInput.trim()) {
      setFormData({ ...formData, positions: [...(formData.positions || []), positionInput] })
      setPositionInput('')
    }
  }

  const getStatusBadge = (status: string) => {
    const map: any = { active: 'badge-success', upcoming: 'badge-info', completed: 'badge-neutral' }
    return map[status]
  }

  return (
    <DashboardLayout>
      <PageHeader title="Elections" subtitle="Manage elections and voting" action={
        <button onClick={() => handleOpen()} className="btn-primary"><Plus size={16} />Create Election</button>
      } />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Elections" value={elections.length} trend="All elections" highlight />
        <StatCard label="Active" value={elections.filter(e => e.status === 'active').length} trend="Currently voting" />
        <StatCard label="Upcoming" value={elections.filter(e => e.status === 'upcoming').length} trend="Scheduled" />
        <StatCard label="Completed" value={elections.filter(e => e.status === 'completed').length} trend="Finished" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {elections.map((election) => {
          const progress = Math.round((election.totalVotes / election.quorumRequired) * 100)
          return (
            <div key={election.id} className="card card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={getStatusBadge(election.status)}>{election.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{election.title}</h3>
                  <p className="text-sm text-gray-500">{election.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleOpen(election)} className="w-8 h-8 bg-gray-50 hover:bg-brand-50 rounded-lg flex items-center justify-center"><Edit2 size={14} /></button>
                  <button onClick={() => deleteElection(election.id)} className="w-8 h-8 bg-gray-50 hover:bg-red-50 rounded-lg flex items-center justify-center"><Trash2 size={14} className="text-red-500" /></button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-600">Quorum Progress</span>
                  <span className="text-xs font-bold text-brand-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-brand-600 h-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{election.totalVotes} / {election.quorumRequired} votes</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
                <Calendar size={12} />
                <span>{election.startDate} → {election.endDate}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {election.positions.map((pos, i) => (
                  <span key={i} className="text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full font-medium">{pos}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editingId ? 'Edit Election' : 'Create Election'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
            <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-base resize-none" rows={2} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
              <input type="date" value={formData.startDate || ''} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="input-base" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
              <input type="date" value={formData.endDate || ''} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="input-base" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
              <select value={formData.status || 'upcoming'} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="input-base">
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quorum Required</label>
              <input type="number" value={formData.quorumRequired || 10} onChange={(e) => setFormData({ ...formData, quorumRequired: +e.target.value })} className="input-base" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Positions</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={positionInput} onChange={(e) => setPositionInput(e.target.value)} className="input-base" placeholder="e.g., President" />
              <button type="button" onClick={addPosition} className="btn-secondary">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(formData.positions || []).map((p, i) => (
                <span key={i} className="text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full font-medium">
                  {p}
                  <button type="button" onClick={() => setFormData({ ...formData, positions: formData.positions?.filter((_, idx) => idx !== i) })} className="ml-1.5">×</button>
                </span>
              ))}
            </div>
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
