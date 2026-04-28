"use client";

import { Calendar, Users, Clock, ArrowUpRight, Plus } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: number;
}
interface UpcomingMeetingsProps {
  meetings: Meeting[];
}

export default function UpcomingMeetings({ meetings }: UpcomingMeetingsProps) {
  const brandColor = "#0F3E76";

  return (
    <div className="h-full">
      <div className="space-y-3">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="group p-5 bg-white border border-slate-100 rounded-[1.8rem] hover:border-[#0F3E76] hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* Header: Title and Quick Action */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-[#0F3E76] transition-colors max-w-[80%]">
                {meeting.title}
              </h3>
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-[#0F3E76] transition-colors">
                <ArrowUpRight
                  size={14}
                  className="text-slate-400 group-hover:text-white"
                />
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Clock size={12} strokeWidth={3} className="text-[#0F3E76]" />
                <span>
                  {meeting.date} <span className="mx-1 opacity-30">|</span>{" "}
                  {meeting.time}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Users size={12} strokeWidth={3} className="text-[#0F3E76]" />
                <span>{meeting.attendees} Registered Delegates</span>
              </div>
            </div>

            {/* Join Action - Standardized Minimalist Button */}
            <button
              className="w-full py-3 rounded-xl bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-[#0F3E76] group-hover:text-white transition-all"
              style={{ color: brandColor }}
            >
              Access Briefing
            </button>
          </div>
        ))}
      </div>

      {/* Schedule Button - Dashed Utility Style */}
      <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-[1.8rem] text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:border-[#0F3E76] hover:text-[#0F3E76] transition-all flex items-center justify-center gap-2">
        <Plus size={14} strokeWidth={3} /> Propose Meeting
      </button>
    </div>
  );
}
