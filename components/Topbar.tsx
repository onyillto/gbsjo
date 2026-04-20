'use client'

import { Search, Mail, Bell, ChevronDown } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search task"
            className="w-full pl-11 pr-20 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
            <span>⌘</span>
            <span>F</span>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors relative">
          <Mail size={18} className="text-gray-600" />
        </button>
        <button className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors relative">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
            AO
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900">Adebayo Okafor</p>
            <p className="text-xs text-gray-500">adebayo@gbajo.com</p>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  )
}
