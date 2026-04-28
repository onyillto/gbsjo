'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/PageHeader'
import { Save, Globe, Bell, Lock } from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    orgName: 'Gbajo Cooperative',
    orgEmail: 'admin@gbajo.com',
    maxMembers: 10,
    contributionAmount: 50000,
    timezone: 'Africa/Lagos',
    emailNotif: true,
    smsNotif: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <DashboardLayout>
      <PageHeader title="Settings" subtitle="Manage your cooperative preferences" />

      <div className="max-w-3xl space-y-5">
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Globe size={18} className="text-brand-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">General</h2>
              <p className="text-xs text-gray-500">Organization details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Organization Name</label>
              <input type="text" value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Organization Email</label>
              <input type="email" value={form.orgEmail} onChange={(e) => setForm({ ...form, orgEmail: e.target.value })} className="input-base" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Members</label>
                <input type="number" value={form.maxMembers} onChange={(e) => setForm({ ...form, maxMembers: +e.target.value })} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contribution (₦)</label>
                <input type="number" value={form.contributionAmount} onChange={(e) => setForm({ ...form, contributionAmount: +e.target.value })} className="input-base" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Timezone</label>
              <select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} className="input-base">
                <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Bell size={18} className="text-brand-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
              <p className="text-xs text-gray-500">Choose what you get notified about</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive updates by email</p>
              </div>
              <input type="checkbox" checked={form.emailNotif} onChange={(e) => setForm({ ...form, emailNotif: e.target.checked })} className="w-5 h-5 rounded cursor-pointer accent-brand-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900 text-sm">SMS Notifications</p>
                <p className="text-xs text-gray-500">Receive updates by text message</p>
              </div>
              <input type="checkbox" checked={form.smsNotif} onChange={(e) => setForm({ ...form, smsNotif: e.target.checked })} className="w-5 h-5 rounded cursor-pointer accent-brand-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Lock size={18} className="text-brand-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Security</h2>
              <p className="text-xs text-gray-500">Keep your account secure</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Two-Factor Auth</p>
                <p className="text-xs text-gray-500">Add an extra layer of protection</p>
              </div>
              <button className="btn-secondary text-xs">Enable</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Change Password</p>
                <p className="text-xs text-gray-500">Update your password</p>
              </div>
              <button className="btn-secondary text-xs">Change</button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="btn-primary"><Save size={16} />Save Changes</button>
          {saved && (
            <span className="text-sm text-green-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              Settings saved
            </span>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
