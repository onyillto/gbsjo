"use client";

import { TrendingUp, ArrowUpRight } from "lucide-react";

interface ChartDataPoint {
  day: string;
  value: number;
}

interface ContributionChartProps {
  data: ChartDataPoint[];
  title?: string;
  stat?: string;
  statBadge?: string;
  formatValue?: (v: number) => string;
  viewAllHref?: string;
}

export default function ContributionChart({
  data,
  title = "Vault Targets",
  stat,
  statBadge,
  formatValue,
  viewAllHref = "/dashboard/plans",
}: ContributionChartProps) {
  const brandColor = "#0F3E76";
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const displayStat = stat ?? (data.length > 0 ? String(data.length) : "—");
  const displayBadge = statBadge ?? `${data.length} vault${data.length !== 1 ? "s" : ""}`;
  const tooltipLabel = (v: number) => (formatValue ? formatValue(v) : String(v));

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all h-[420px] flex flex-col overflow-hidden">
      <div className="flex items-end justify-between mb-10 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-slate-400" />
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {title}
            </h2>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tighter">
              {displayStat}
            </span>
            <span className="text-[10px] font-black text-green-600 flex items-center bg-green-50 px-2 py-0.5 rounded-md">
              <ArrowUpRight size={10} /> {displayBadge}
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar Chart - flex-1 ensures it fills the 420px container perfectly */}
      <div className="flex-1 flex items-end justify-between gap-4 min-h-0 relative">
        {/* Structural Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
          <div className="w-full border-t border-slate-50" />
          <div className="w-full border-t border-slate-50" />
          <div className="w-full border-t border-slate-50" />
        </div>

        {data.map((point, index) => {
          const heightPercent = (point.value / maxValue) * 100;
          const isHighest = point.value === maxValue;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-4 h-full group relative"
            >
              <div className="w-full flex flex-col items-center justify-end h-full relative z-10">
                {/* Minimalist Hover Tooltip */}
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="text-[10px] font-black text-white bg-slate-900 px-2 py-1 rounded-md">
                    {tooltipLabel(point.value)}
                  </span>
                </div>

                <div
                  className="w-full max-w-[40px] rounded-t-xl transition-all duration-500 ease-out cursor-pointer"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: isHighest ? brandColor : "#E2E8F0",
                    minHeight: "8px",
                  }}
                />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex-shrink-0">
                {point.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Meta */}
      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: brandColor }}
            ></div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">
              Peak Volume
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm bg-slate-200"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              Baseline
            </span>
          </div>
        </div>
        <a href={viewAllHref} className="text-[10px] font-black text-[#0F3E76] uppercase tracking-widest hover:underline">
          View All Vaults
        </a>
      </div>
    </div>
  );
}
