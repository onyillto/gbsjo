"use client";

import {
  Activity,
  ArrowUpRight,
  Wallet,
  UserPlus,
  Target,
  Circle,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "contribution" | "member" | "plan" | string;
  message: string;
  timestamp: string;
  icon?: string; // Kept for prop compatibility, but using internal logic for icons
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const brandColor = "#0F3E76";

  // Helper to map activity types to Lucide Icons
  const getIcon = (type: string) => {
    switch (type) {
      case "contribution":
        return <Wallet size={18} className="text-[#0F3E76]" />;
      case "member":
        return <UserPlus size={18} className="text-[#0F3E76]" />;
      case "plan":
        return <Target size={18} className="text-[#0F3E76]" />;
      default:
        return <Circle size={18} className="text-[#0F3E76]" />;
    }
  };

  return (
    <div className="h-full">
      <div className="space-y-2">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-5 p-4 rounded-[1.5rem] bg-white border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all group"
          >
            {/* Functional Squircle Icon */}
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-100 group-hover:bg-white transition-all shadow-sm">
              <div className="group-hover:scale-110 transition-transform duration-300">
                {getIcon(item.type)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 leading-tight tracking-tight mb-1">
                {item.message}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {item.timestamp}
                </span>
                <div className="h-1 w-1 bg-slate-200 rounded-full" />
                <span
                  className="text-[9px] font-black uppercase tracking-tighter"
                  style={{ color: brandColor }}
                >
                  {item.type}
                </span>
              </div>
            </div>

            {/* Subtle Action Indicator */}
            <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 pr-2">
              <ArrowUpRight size={14} className="text-slate-300" />
            </div>
          </div>
        ))}
      </div>

      {/* View All Utility */}
      <button className="w-full mt-4 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#0F3E76] transition-colors border-t border-slate-50 pt-6">
        View Full Audit Log
      </button>
    </div>
  );
}
