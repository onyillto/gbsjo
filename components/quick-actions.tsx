"use client";

import {
  Plus,
  Users,
  FileText,
  BarChart3,
  Settings,
  CreditCard,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";

export default function QuickActions() {
  const brandColor = "#0F3E76";

  const actions = [
    { id: "action_1", label: "Create Vault", icon: Plus },
    { id: "action_2", label: "Add Member", icon: Users },
    { id: "action_3", label: "Contribution", icon: CreditCard },
    { id: "action_4", label: "View Reports", icon: BarChart3 },
    { id: "action_5", label: "Bank Settings", icon: Settings },
    { id: "action_6", label: "Legal Docs", icon: FileText },
  ];

  return (
    <div className="h-full">
      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className="group flex flex-col items-center justify-center gap-3 p-5 rounded-[1.5rem] bg-white border border-slate-100 hover:border-[#0F3E76] hover:shadow-lg transition-all duration-300"
            >
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-[#0F3E76] transition-colors">
                <Icon
                  size={18}
                  className="text-[#0F3E76] group-hover:text-white transition-colors"
                />
              </div>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter text-center">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Internal Support Bento */}
      <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={16} className="text-slate-400" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Support Portal
            </h3>
          </div>
          <p className="text-sm font-bold text-slate-900 leading-snug mb-4">
            Need technical assistance or strategy documentation?
          </p>
          <button
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] transition-all hover:gap-3"
            style={{ color: brandColor }}
          >
            Enter Help Center <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Subtle Decorative Background Element */}
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
          <FileText size={100} style={{ color: brandColor }} />
        </div>
      </div>
    </div>
  );
}
