"use client";

import { useState } from "react";
import { Search, Bell, ChevronDown, ArrowUpRight, Clock } from "lucide-react";

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(true); // Active state for demo
  const brandColor = "#0F3E76";

  const notifications = [
    {
      id: 1,
      title: "Vault Milestone",
      desc: "House Savings hit 65%",
      time: "2m ago",
    },
    {
      id: 2,
      title: "New Delegate",
      desc: "Grace Okonkwo joined",
      time: "1h ago",
    },
  ];

  return (
    <header className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between sticky top-0 z-30">
      {/* Editorial Search Bar */}
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0F3E76] transition-colors"
          />
          <input
            type="text"
            placeholder="COMMAND SEARCH..."
            className="w-full pl-12 pr-20 py-3 bg-slate-50 border border-transparent rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest focus:outline-none focus:bg-white focus:border-slate-200 transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] font-black text-slate-400 bg-white border border-slate-100 px-2 py-1 rounded-md shadow-sm pointer-events-none">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Action Suite */}
      <div className="flex items-center gap-6">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-all relative group"
          >
            <Bell
              size={18}
              className={`${
                showNotifications ? "text-[#0F3E76]" : "text-slate-400"
              } group-hover:scale-110 transition-transform`}
            />
            <span className="absolute top-3 right-3 w-2 h-2 bg-[#0F3E76] rounded-full border-2 border-white animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 bg-white border border-slate-100 rounded-[2rem] shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Live Briefings
                </h3>
                <span className="text-[9px] font-black text-[#0F3E76] uppercase bg-blue-50 px-2 py-1 rounded">
                  2 New
                </span>
              </div>

              <div className="space-y-4">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="group/item flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#0F3E76] transition-colors">
                      <ArrowUpRight
                        size={12}
                        className="text-slate-400 group-hover/item:text-white"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
                        {n.title}
                      </p>
                      <p className="text-[10px] font-bold text-slate-500 leading-tight">
                        {n.desc}
                      </p>
                      <div className="flex items-center gap-1 mt-1 opacity-50">
                        <Clock size={10} />
                        <span className="text-[8px] font-black uppercase tracking-tighter">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 border-t border-slate-50 text-[9px] font-black text-[#0F3E76] uppercase tracking-widest hover:bg-slate-50 rounded-b-xl transition-colors">
                Clear All Logs
              </button>
            </div>
          )}
        </div>

        {/* User Identity - Squircle style */}
        <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter leading-none">
              Adebayo Okafor
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1">
              Super Administrator
            </p>
          </div>
          <div className="relative group cursor-pointer">
            <div className="w-12 h-12 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white font-black text-sm border-2 border-transparent group-hover:border-[#0F3E76] transition-all">
              AO
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <ChevronDown
            size={14}
            className="text-slate-300 hover:text-[#0F3E76] cursor-pointer transition-colors"
          />
        </div>
      </div>
    </header>
  );
}
