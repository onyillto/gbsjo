"use client";

import { ChevronRight, Wallet, ArrowUpRight, Plus } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  target: number;
  collected: number;
  members: number;
  status: "active" | "disabled" | "archived";
  progress: number;
}

interface PlansOverviewProps {
  plans: Plan[];
}

export default function PlansOverview({ plans }: PlansOverviewProps) {
  const brandColor = "#0F3E76";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statusStyle = {
    active: "bg-slate-900 text-white",
    disabled: "bg-slate-100 text-slate-400",
    archived: "bg-slate-50 text-slate-300",
  };

  return (
    <div className="h-full">
      <div className="space-y-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="group p-6 bg-slate-50/50 rounded-[2rem] border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 cursor-pointer"
          >
            {/* Plan Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-[#0F3E76] transition-colors shadow-sm">
                  <Wallet
                    size={16}
                    className="text-[#0F3E76] group-hover:text-white transition-colors"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-[#0F3E76] transition-colors">
                    {plan.name}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    {plan.members} ACTIVE CONTRIBUTORS
                  </p>
                </div>
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${
                  statusStyle[plan.status]
                }`}
              >
                {plan.status}
              </span>
            </div>

            {/* Progress Data */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Funding Progress
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    {plan.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${plan.progress}%`,
                      backgroundColor: brandColor,
                    }}
                  />
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                      Raised
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      {formatCurrency(plan.collected)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                      Target
                    </p>
                    <p className="text-sm font-black text-slate-400">
                      {formatCurrency(plan.target)}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={14} className="text-[#0F3E76]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Vault Trigger */}
      <button className="w-full mt-6 py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:border-[#0F3E76] hover:text-[#0F3E76] transition-all flex items-center justify-center gap-2">
        <Plus size={14} strokeWidth={3} /> Initialize New Vault
      </button>
    </div>
  );
}
