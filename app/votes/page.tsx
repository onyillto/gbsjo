'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import Table from '@/components/Table'
import Modal from '@/components/Modal'
import { useGbajoStore, Vote } from '@/store/gbajoStore'
import { Plus, Vote as VoteIcon } from 'lucide-react'

export default function VotesPage() {
  const { votes, addVote, elections, users } = useGbajoStore()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Vote>>({})

  const handleOpen = () => {
    setFormData({ electionId: '', memberId: '', position: '', candidate: '' })
    setIsOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addVote({
      id: Date.now().toString(),
      electionId: formData.electionId || '',
      memberId: formData.memberId || '',
      position: formData.position || '',
      candidate: formData.candidate || '',
      timestamp: new Date().toISOString(),
    })
    setIsOpen(false)
  }

  const columns = [
    {
      key: 'electionId', label: 'Election', render: (v: string) => {
        const el = elections.find(e => e.id === v)
        return <span className="font-semibold text-gray-900">{el?.title || 'Unknown'}</span>
      }
    },
    {
      key: 'memberId', label: 'Voter', render: (v: string) => {
        const m = users.find(u => u.id === v)
        return <span>{m?.name || 'Unknown'}</span>
      }
    },
    { key: 'position', label: 'Position', render: (v: string) => <span className="badge-info">{v}</span> },
    { key: 'candidate', label: 'Candidate', render: (v: string) => <span className="font-semibold">{v}</span> },
    { key: 'timestamp', label: 'Voted At', render: (v: string) => new Date(v).toLocaleString() },
  ]

  const uniqueVoters = new Set(votes.map(v => v.memberId)).size
  const turnout = users.length ? Math.round((uniqueVoters / users.length) * 100) : 0

  const candidateCount: Record<string, number> = {}
  votes.forEach(v => { candidateCount[v.candidate] = (candidateCount[v.candidate] || 0) + 1 })
  const topCandidates = Object.entries(candidateCount).sort(([, a], [, b]) => b - a).slice(0, 5)

  return (
    <DashboardLayout>
      <PageHeader title="Votes" subtitle="Election votes and results" action={
        <button onClick={handleOpen} className="btn-primary"><Plus size={16} />Record Vote</button>
      } />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <StatCard label="Total Votes" value={votes.length} trend="All votes cast" highlight />
        <StatCard label="Unique Voters" value={uniqueVoters} trend="Individual members" />
        <StatCard label="Active Elections" value={elections.filter(e => e.status === 'active').length} trend="Ongoing" />
        <StatCard label="Turnout" value={`${turnout}%`} trend="Member participation" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">All Votes</h2>
          <Table columns={columns} data={votes} />
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Leading Candidates</h2>
          <div className="space-y-3">
            {topCandidates.length === 0 ? (
              <p className="text-sm text-gray-400">No votes yet</p>
            ) : topCandidates.map(([candidate, count], i) => (
              <div key={candidate} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{candidate}</span>
                  <span className="text-sm font-bold text-brand-600">{count}</span>
                </div>
                <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-600 h-full" style={{ width: `${votes.length ? (count / votes.length) * 100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Record Vote">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Election</label>
            <select value={formData.electionId || ''} onChange={(e) => setFormData({ ...formData, electionId: e.target.value })} className="input-base" required>
              <option value="">Select election</option>
              {elections.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Voter</label>
            <select value={formData.memberId || ''} onChange={(e) => setFormData({ ...formData, memberId: e.target.value })} className="input-base" required>
              <option value="">Select member</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Position</label>
            <input type="text" value={formData.position || ''} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="input-base" placeholder="e.g., President" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Candidate</label>
            <input type="text" value={formData.candidate || ''} onChange={(e) => setFormData({ ...formData, candidate: e.target.value })} className="input-base" placeholder="Candidate name" required />
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
