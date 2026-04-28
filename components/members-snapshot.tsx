"use client";

import { Users, Plus } from "lucide-react";

interface Member {
  id: string;
  name: string;
  role: "Admin" | "Manager" | "Member";
  status: "active" | "suspended" | "inactive";
  avatar: string;
}

interface MembersSnapshotProps {
  members: Member[];
}

// Updated to use brand-consistent colors and neutral slates
const roleColors = {
  Admin: "bg-blue-50 text-[#0F3E76]",
  Manager: "bg-slate-100 text-slate-700",
  Member: "bg-slate-50 text-slate-500",
};

const statusDot = {
  active: "bg-green-500",
  suspended: "bg-amber-500",
  inactive: "bg-slate-300",
};

export default function MembersSnapshot({ members }: MembersSnapshotProps) {
  const brandColor = "#0F3E76";

  return (
    <div className="h-full">
      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all cursor-pointer group"
          >
            {/* Avatar - Removed Gradient for Clean Solid Look */}
            <div className="relative flex-shrink-0">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-sm transition-transform group-hover:scale-105"
                style={{ backgroundColor: brandColor }}
              >
                {member.avatar}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                  statusDot[member.status]
                }`}
              ></div>
            </div>

            {/* Member Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate tracking-tight">
                {member.name}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {member.role}
              </p>
            </div>

            {/* Role Badge - Simplified */}
            <span
              className={`text-[9px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-lg ${
                roleColors[member.role]
              } whitespace-nowrap border border-transparent group-hover:border-slate-100`}
            >
              {member.role}
            </span>
          </div>
        ))}
      </div>

      {/* Action Button - Minimalist Style */}
      <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:border-[#0F3E76] hover:text-[#0F3E76] transition-all flex items-center justify-center gap-2">
        <Plus size={14} strokeWidth={3} /> Add Colleague
      </button>
    </div>
  );
}
