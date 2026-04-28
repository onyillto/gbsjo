"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ChevronRight,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  Users,
  Search,
  Power,
  PowerOff,
  MoreHorizontal,
  ArrowUpRight,
  Wallet,
  Calendar,
  Activity,
  ArrowLeft,
} from "lucide-react";

// --- TYPES & INTERFACES ---
interface Plan {
  id: string;
  name: string;
  target: number;
  collected: number;
  members: number;
  status: "active" | "disabled" | "archived";
  progress: number;
  description: string;
  frequency: "weekly" | "bi-weekly" | "monthly";
  startDate: string;
  endDate: string;
}

interface Subscription {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: "active" | "paused" | "cancelled";
  joinedDate: string;
  nextDueDate: string;
}

// --- DUMMY DATA ---
const DUMMY_PLANS: Plan[] = [
  {
    id: "plan_1",
    name: "House Savings",
    target: 1000000,
    collected: 650000,
    members: 45,
    status: "active",
    progress: 65,
    description: "Collective savings for property development and housing.",
    frequency: "monthly",
    startDate: "2024-01-15",
    endDate: "2025-12-31",
  },
  {
    id: "plan_2",
    name: "Education Fund",
    target: 2000000,
    collected: 1200000,
    members: 60,
    status: "active",
    progress: 60,
    description: "Investment plan for academic fees and resources.",
    frequency: "monthly",
    startDate: "2024-02-01",
    endDate: "2026-01-31",
  },
];

const DUMMY_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub_1",
    memberId: "mem_1",
    memberName: "Chioma Adeleke",
    amount: 50000,
    status: "active",
    joinedDate: "2024-01-20",
    nextDueDate: "2026-05-01",
  },
  {
    id: "sub_2",
    memberId: "mem_2",
    memberName: "John David",
    amount: 50000,
    status: "active",
    joinedDate: "2024-02-15",
    nextDueDate: "2026-05-05",
  },
];

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(DUMMY_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const brandColor = "#0F3E76";

  const handleStatusUpdate = async (
    id: string,
    action: "enable" | "disable" | "archive"
  ) => {
    setPlans(
      plans.map((p) => {
        if (p.id === id) {
          const newStatus =
            action === "archive"
              ? "archived"
              : action === "enable"
              ? "active"
              : "disabled";
          return { ...p, status: newStatus as any };
        }
        return p;
      })
    );
    if (selectedPlan?.id === id) {
      setSelectedPlan({
        ...selectedPlan,
        status:
          action === "archive"
            ? "archived"
            : action === "enable"
            ? "active"
            : "disabled",
      } as Plan);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this vault?")) {
      setPlans(plans.filter((p) => p.id !== id));
      setSelectedPlan(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredPlans = plans.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "all" || p.status === filterStatus)
  );

  // --- DETAIL VIEW (REDUCED BENTO) ---
  if (selectedPlan) {
    return (
      <DashboardLayout pageTitle={selectedPlan.name}>
        <div className="max-w-[1200px] mx-auto px-6 py-8 bg-[#FDFDFD] min-h-screen">
          {/* Header Section - More Compact */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="space-y-1">
              <button
                onClick={() => setSelectedPlan(null)}
                className="group flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#0F3E76] transition-colors mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Registry
              </button>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">
                {selectedPlan.name}
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                {selectedPlan.description}
              </p>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all">
                Edit
              </button>
              <button
                className="px-6 py-2 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
                style={{ backgroundColor: brandColor }}
              >
                Distribute Funds
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5">
            {/* Primary Metrics */}
            <div className="col-span-12 lg:col-span-8 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">
                Performance
              </h3>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-bold text-slate-900 tracking-tighter">
                  {selectedPlan.progress}%
                </span>
                <span className="text-green-500 font-bold text-xs mb-1.5 flex items-center gap-0.5">
                  <ArrowUpRight size={14} /> +8.4%
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-100 rounded-full mb-8">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${selectedPlan.progress}%`,
                    backgroundColor: brandColor,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Liquidity
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatCurrency(selectedPlan.collected)}
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Target
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatCurrency(selectedPlan.target)}
                  </p>
                </div>
              </div>
            </div>

            {/* Side Stats */}
            <div className="col-span-12 lg:col-span-4 space-y-5">
              <div className="bg-[#0F3E76] rounded-[2rem] p-8 text-white flex flex-col justify-between h-[180px] shadow-lg">
                <Users size={24} className="opacity-40" />
                <div>
                  <p className="text-4xl font-bold tracking-tight">
                    {selectedPlan.members}
                  </p>
                  <p className="text-xs font-bold opacity-60 uppercase">
                    Members
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 flex flex-col justify-between h-[150px]">
                <Calendar size={24} className="text-slate-300" />
                <div>
                  <p className="text-lg font-bold text-slate-900 capitalize">
                    {selectedPlan.frequency}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Cycle
                  </p>
                </div>
              </div>
            </div>

            {/* Registry List */}
            <div className="col-span-12 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">
                Member Registry
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {DUMMY_SUBSCRIPTIONS.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-5 bg-slate-50 rounded-2xl flex items-center justify-between group hover:bg-white border border-transparent hover:border-slate-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-slate-900 border border-slate-100">
                        {sub.memberName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-none mb-1">
                          {sub.memberName}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {formatCurrency(sub.amount)}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase bg-white px-2 py-1 rounded-md text-slate-600 border border-slate-100">
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Actions */}
            <div className="col-span-12 flex flex-wrap items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-200 gap-4">
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-slate-400" />
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Management
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleStatusUpdate(
                      selectedPlan.id,
                      selectedPlan.status === "active" ? "disable" : "enable"
                    )
                  }
                  className="px-4 py-2 bg-white text-slate-700 rounded-xl font-bold text-xs border border-slate-200 flex items-center gap-2 hover:bg-slate-100 transition-colors"
                >
                  {selectedPlan.status === "active" ? (
                    <PowerOff size={14} />
                  ) : (
                    <Power size={14} />
                  )}
                  {selectedPlan.status === "active" ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleDelete(selectedPlan.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors"
                >
                  Delete Vault
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // --- LIST VIEW (MODERATE SIZES) ---
  return (
    <DashboardLayout pageTitle="Vaults">
      <div className="max-w-[1200px] mx-auto px-6 py-10 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Vaults
            </h1>
            <p className="text-slate-400 font-medium text-sm">
              Collective wealth management architecture.
            </p>
          </div>
          <button
            className="px-6 py-3 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:translate-y-[-2px] active:translate-y-0"
            style={{ backgroundColor: brandColor }}
          >
            + Create New Vault
          </button>
        </div>

        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search vaults..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 outline-none shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className="group bg-white p-7 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer relative"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all">
                  <Wallet size={20} style={{ color: brandColor }} />
                </div>
                <div className="text-[9px] font-bold uppercase tracking-widest bg-slate-900 text-white px-3 py-1 rounded-full">
                  {plan.status}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1 group-hover:text-[#0F3E76] transition-colors">
                {plan.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium line-clamp-1 mb-6">
                {plan.description}
              </p>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">
                      Progress
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {plan.progress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000"
                      style={{
                        width: `${plan.progress}%`,
                        backgroundColor: brandColor,
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      AUM
                    </p>
                    <p className="text-base font-bold text-slate-900">
                      {formatCurrency(plan.collected)}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#0F3E76] transition-all">
                    <ArrowUpRight
                      size={16}
                      className="group-hover:text-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
