"use client";

import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  subtitle?: string;
  icon?: ReactNode;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

export default function StatCard({
  label,
  value,
  trend,
  subtitle,
  icon,
  color = "blue",
}: StatCardProps) {
  const brandColor = "#0F3E76";

  // Check if the trend indicates growth to style it appropriately
  const isPositiveTrend = trend?.includes("↑") || trend?.includes("+");

  return (
    <div className="group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-500 relative overflow-hidden">
      {/* Background Decorative Icon - Very Subtle */}
      <div className="absolute -right-2 -top-2 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-700 pointer-events-none">
        {icon}
      </div>

      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex items-start justify-between mb-8">
          {/* Label: Editorial High-Contrast Style */}
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
            {label}
          </p>

          {/* Icon: Squircle Container */}
          <div
            className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-[#0F3E76] group-hover:text-white transition-all duration-300"
            style={{ color: color === "blue" ? brandColor : "inherit" }}
          >
            {icon}
          </div>
        </div>

        <div>
          {/* Main Value: Bold & Tight */}
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 group-hover:text-[#0F3E76] transition-colors">
            {value}
          </h3>

          {/* Contextual Subtext */}
          <div className="flex items-center gap-1.5 min-h-[1rem]">
            {trend ? (
              <p
                className={`text-[10px] font-black uppercase tracking-tight flex items-center gap-0.5 ${
                  isPositiveTrend ? "text-green-600" : "text-slate-400"
                }`}
              >
                {isPositiveTrend && <ArrowUpRight size={12} />}
                {trend}
              </p>
            ) : (
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
