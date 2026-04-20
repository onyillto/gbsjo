'use client'

import DashboardLayout from '@/components/DashboardLayout'
import StatCard from '@/components/StatCard'
import { useGbajoStore } from '@/store/gbajoStore'
import { Plus, Download, Calendar, Play, UserPlus, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { users, contributions, elections, votes, getTotalContributions } = useGbajoStore()

  const totalContributions = getTotalContributions()
  const completedContributions = contributions.filter(c => c.status === 'completed').length
  const pendingContributions = contributions.filter(c => c.status === 'pending').length
  const activeElections = elections.filter(e => e.status === 'active').length

  // Calculate participation rate
  const activeElection = elections.find(e => e.status === 'active')
  const participationRate = activeElection ? Math.round((activeElection.totalVotes / activeElection.quorumRequired) * 100) : 0

  // Mock bar chart heights (days of week)
  const chartData = [
    { day: 'S', height: 35 },
    { day: 'M', height: 85, highlight: true },
    { day: 'T', height: 55 },
    { day: 'W', height: 90, highlight: true },
    { day: 'T', height: 45 },
    { day: 'F', height: 65 },
    { day: 'S', height: 40 },
  ]

  const recentMembers = users.slice(0, 4)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-sm text-gray-500">Plan, prioritize, and manage your cooperative with ease.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-primary">
              <Plus size={16} />
              Add Member
            </button>
            <button className="btn-secondary">
              <Download size={16} />
              Import Data
            </button>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Contributions"
            value={`₦${(totalContributions / 1000000).toFixed(1)}M`}
            trend="Increased from last month"
            highlight
          />
          <StatCard
            label="Completed"
            value={completedContributions}
            trend="Increased from last month"
          />
          <StatCard
            label="Total Members"
            value={users.length}
            trend="Increased from last month"
          />
          <StatCard
            label="Pending"
            value={pendingContributions}
            trend="On Discuss"
          />
        </div>

        {/* Middle Row: Analytics & Reminders & Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Project Analytics Chart */}
          <div className="lg:col-span-5 card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Contribution Analytics</h2>
              <button className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">This Week</button>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-3 h-48">
              {chartData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-full relative">
                    {item.highlight && (
                      <span className="absolute -top-6 text-xs font-bold text-brand-600">
                        {item.day === 'M' ? '38%' : '54%'}
                      </span>
                    )}
                    <div
                      className={`w-full rounded-full ${item.highlight ? 'bg-brand-600' : 'dashed-decoration border border-brand-200'}`}
                      style={{ height: `${item.height}%`, minHeight: '30px' }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div className="lg:col-span-3 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Reminders</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-semibold text-sm text-gray-900 mb-1">Board Meeting</p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Calendar size={12} />
                  Time: 02:00 pm - 04:00 pm
                </p>
              </div>

              <button className="btn-primary w-full justify-center">
                <Play size={14} fill="white" />
                Start Meeting
              </button>
            </div>
          </div>

          {/* Recent Projects/Elections */}
          <div className="lg:col-span-4 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Projects</h2>
              <button className="btn-secondary text-xs px-3 py-1.5">
                <Plus size={12} />
                New
              </button>
            </div>

            <div className="space-y-3">
              {elections.slice(0, 2).map((election, i) => (
                <div key={election.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    i === 0 ? 'bg-brand-100 text-brand-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    <span className="text-xs font-bold">{election.title.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{election.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Due: {election.endDate}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-yellow-100 text-yellow-600">
                  <span className="text-xs font-bold">B</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">Build Dashboard</p>
                  <p className="text-xs text-gray-500 mt-0.5">Due: Nov 30, 2026</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100 text-green-600">
                  <span className="text-xs font-bold">O</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">Optimize Page Load</p>
                  <p className="text-xs text-gray-500 mt-0.5">Due: Dec 5, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Team Collaboration & Progress & Time Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Team Collaboration */}
          <div className="lg:col-span-5 card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
              <button className="btn-secondary text-xs px-3 py-1.5">
                <UserPlus size={12} />
                Add Member
              </button>
            </div>

            <div className="space-y-3">
              {recentMembers.map((member, i) => {
                const statuses = ['Completed', 'In Progress', 'Pending', 'In Progress']
                const colors = ['badge-success', 'badge-info', 'badge-warning', 'badge-info']
                return (
                  <div key={member.id} className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500 truncate">Working on: {member.role === 'admin' ? 'System Management' : 'Contribution Tracking'}</p>
                    </div>
                    <span className={colors[i]}>{statuses[i]}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Participation Progress (Circle) */}
          <div className="lg:col-span-4 card flex flex-col items-center">
            <h2 className="text-lg font-bold text-gray-900 mb-4 self-start">Election Progress</h2>

            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#dbeafe" strokeWidth="10" strokeDasharray="4 4" />
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${participationRate * 2.512} 251.2`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{participationRate}%</span>
                <span className="text-xs text-gray-500 mt-1">Voting Progress</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-brand-600 rounded-full"></span>
                <span className="text-gray-600">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-brand-200 rounded-full"></span>
                <span className="text-gray-600">In Progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gray-200 rounded-full"></span>
                <span className="text-gray-600">Pending</span>
              </div>
            </div>
          </div>

          {/* Time Tracker */}
          <div className="lg:col-span-3 card bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 border-4 border-white rounded-full -mt-16 -mr-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 border-4 border-white rounded-full -mb-12 -ml-12"></div>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-semibold text-gray-400 mb-4">Time Tracker</p>
              <p className="text-3xl font-bold mb-6 font-mono">01:24:08</p>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="w-3 h-3 bg-white rounded-sm"></span>
                </button>
                <button className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                  <span className="w-3 h-3 bg-white rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Quick Access</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Members', href: '/users', color: 'bg-blue-100 text-blue-600' },
              { label: 'Contributions', href: '/contributions', color: 'bg-green-100 text-green-600' },
              { label: 'Subscriptions', href: '/subscriptions', color: 'bg-purple-100 text-purple-600' },
              { label: 'Payments', href: '/payments', color: 'bg-yellow-100 text-yellow-600' },
              { label: 'Elections', href: '/elections', color: 'bg-pink-100 text-pink-600' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center text-xs font-bold`}>
                    {item.label.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
