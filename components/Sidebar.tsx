'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Building2, TrendingUp, CreditCard,
  Wallet, DollarSign, CheckSquare, BarChart3, Vote, Settings,
  HelpCircle, LogOut, Download
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const mainNav = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/users', icon: Users, label: 'Members' },
    { href: '/tenants', icon: Building2, label: 'Tenants' },
    { href: '/contributions', icon: TrendingUp, label: 'Contributions' },
    { href: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { href: '/wallets', icon: Wallet, label: 'Wallets' },
    { href: '/payments', icon: DollarSign, label: 'Payments' },
    { href: '/withdrawals', icon: CheckSquare, label: 'Withdrawals' },
    { href: '/elections', icon: BarChart3, label: 'Elections' },
    { href: '/votes', icon: Vote, label: 'Votes' },
  ]

  const generalNav = [
    { href: '/settings', icon: Settings, label: 'Settings' },
    { href: '/help', icon: HelpCircle, label: 'Help' },
  ]

  return (
    <aside className="w-64 bg-white h-screen sticky top-0 flex flex-col border-r border-gray-100">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">Ì</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Gbajo</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto pb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">MENU</p>
        <div className="space-y-1 mb-6">
          {mainNav.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                <Icon size={18} strokeWidth={2} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">GENERAL</p>
        <div className="space-y-1">
          {generalNav.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                <Icon size={18} strokeWidth={2} />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <button className="nav-link w-full text-left">
            <LogOut size={18} strokeWidth={2} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Promotional card */}
      {/* <div className="p-4">
        <div className="bg-brand-600 rounded-2xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500 rounded-full -mt-8 -mr-8 opacity-50"></div>
          <div className="relative z-10">
            <p className="font-bold text-sm mb-1">Upgrade your</p>
            <p className="font-bold text-sm mb-3">experience</p>
            <p className="text-xs text-brand-100 mb-3">Get premium features today</p>
            <button className="bg-white text-brand-600 text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5">
              <Download size={12} />
              Upgrade
            </button>
          </div>
        </div>
      </div> */}
    </aside>
  )
}
