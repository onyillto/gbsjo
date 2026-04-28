"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Home,
  FileText,
  Users,
  UserCheck,
  DollarSign,
  Landmark,
  Settings,
  ArrowUpRight,
} from "lucide-react";

export interface NavbarProps {
  cooperativeName?: string;
  userName?: string;
  userRole?: string;
}

export function Navbar({
  cooperativeName = "GBAJO",
  userName = "Admin User",
  userRole = "Administrator",
}: NavbarProps) {
  const pathname = usePathname();
  const brandColor = "#0F3E76";

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Plans", href: "/dashboard/plans", icon: FileText },
    { name: "Members", href: "/members", icon: Users },
    { name: "Subscriptions", href: "/subscriptions", icon: UserCheck },
    { name: "Contributions", href: "/contributions", icon: DollarSign },
    { name: "Settlements", href: "/bank-accounts", icon: Landmark },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0F172A] text-white flex flex-col h-screen sticky top-0 border-r border-slate-800">
      {/* Logo Section - Squircle Geometry */}
      <div className="p-8 h-24 flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-900/20"
          style={{ backgroundColor: brandColor }}
        >
          G
        </div>
        <div>
          <h1 className="font-black text-lg tracking-tighter leading-none">
            {cooperativeName}
          </h1>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">
            Registry v1.0
          </p>
        </div>
      </div>

      {/* Navigation - High Contrast Editorial Style */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-white text-[#0F172A] shadow-xl"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${
                  isActive
                    ? "text-[#0F3E76]"
                    : "group-hover:scale-110 transition-transform"
                }`}
              />
              <span className="text-[10px] font-black uppercase tracking-widest flex-1">
                {item.name}
              </span>
              {isActive && <ArrowUpRight size={14} className="opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* User Section - Structural Block */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <div className="bg-slate-800/40 rounded-[1.5rem] p-4 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center font-black text-xs border border-slate-600">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-white uppercase tracking-tight truncate">
                {userName}
              </p>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.1em]">
                {userRole}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/settings"
              className="flex items-center justify-center py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[9px] font-black uppercase tracking-tighter text-slate-300 transition-colors border border-slate-700"
            >
              Profile
            </Link>
            <button className="flex items-center justify-center py-2 bg-red-950/20 hover:bg-red-900/40 rounded-lg text-[9px] font-black uppercase tracking-tighter text-red-400 transition-colors border border-red-900/30">
              Exit
            </button>
          </div>
        </div>

        <p className="text-[8px] font-black text-slate-600 text-center mt-4 tracking-[0.3em] uppercase">
          Internal System
        </p>
      </div>
    </aside>
  );
}

export default Navbar;
