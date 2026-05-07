"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import ContributionChart from "@/components/contribution-chart";
import QuickActions from "@/components/quick-actions";
import { useAuthStore } from "@/store/authStore";
import { apiFetch } from "@/lib/api";
import { Users, Target, AlertCircle, TrendingUp, Plus, Loader2, Wallet, ArrowUpRight } from "lucide-react";

interface BackendPlan {
  id: number;
  name: string;
  status: string;
  description: string;
  minimum_amount: string;
  target_amount: string;
  start_date: string;
  end_date: string;
  target_apy: string;
  frequency: string;
}

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  suspended: boolean;
  inserted_at: string;
  last_login_at: string | null;
}


function formatCurrency(amount: string | number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(Number(amount));
}

function timeProgress(start: string, end: string) {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const now = Date.now();
  if (now <= s) return 0;
  if (now >= e) return 100;
  return Math.round(((now - s) / (e - s)) * 100);
}

function getInitials(m: Member) {
  return `${m.first_name?.[0] ?? ""}${m.last_name?.[0] ?? ""}`.toUpperCase();
}

const BRAND = "#0F3E76";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);

  const [plans, setPlans] = useState<BackendPlan[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await apiFetch("/api/tenant/plans");
      const json = await res.json();
      if (res.ok && json.status) setPlans(json.data);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await apiFetch("/api/tenant/members");
      const json = await res.json();
      if (res.ok && json.status) setMembers(json.data);
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
    fetchMembers();
  }, [fetchPlans, fetchMembers]);

  const activePlans = plans.filter((p) => p.status === "active");
  const activeMembers = members.filter((m) => !m.suspended);
  const subFeatures = user?.subscription_features;

  return (
    <DashboardLayout pageTitle="Overview">
      <div className="max-w-[1400px] mx-auto px-6 py-8 min-h-screen bg-[#FDFDFD]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Dashboard</h1>
            <p className="text-sm text-slate-500 font-medium">
              Welcome back{user ? `, ${user.first_name}` : ""}
              {user?.company_name ? ` · ${user.company_name}` : ""}
            </p>
          </div>
          <a
            href="/dashboard/plans"
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95"
            style={{ backgroundColor: BRAND }}
          >
            <Plus size={14} strokeWidth={3} /> New Vault
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            label="Active Plans"
            value={loadingPlans ? "—" : activePlans.length}
            subtitle={loadingPlans ? "" : `${activePlans.length}/${plans.length} Total`}
            icon={<Target size={20} />}
          />
          <StatCard
            label="Total Members"
            value={loadingMembers ? "—" : members.length}
            trend={loadingMembers ? "" : `${activeMembers.length} Active`}
            icon={<Users size={20} />}
          />
          <StatCard
            label="Max Users Allowed"
            value={subFeatures ? subFeatures.max_users : "—"}
            subtitle={subFeatures ? subFeatures.title : ""}
            icon={<TrendingUp size={20} />}
          />
          <StatCard
            label="Max Contributions"
            value={subFeatures ? subFeatures.max_contributions : "—"}
            trend={subFeatures?.status === "active" ? "Plan Active" : "Check Plan"}
            icon={<AlertCircle size={20} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm h-[400px] overflow-hidden">
              <ContributionChart
                data={plans.map((p) => ({
                  day: p.name.split(" ").slice(0, 2).join(" "),
                  value: Number(p.target_amount),
                }))}
                title="Vault Targets"
                stat={formatCurrency(plans.reduce((s, p) => s + Number(p.target_amount), 0))}
                statBadge={`${activePlans.length} active`}
                formatValue={formatCurrency}
              />
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Vaults</h3>
                <a href="/dashboard/plans" className="text-[9px] font-black text-[#0F3E76] uppercase tracking-widest hover:underline">
                  View All
                </a>
              </div>

              {loadingPlans ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 size={24} className="animate-spin text-slate-300" />
                </div>
              ) : activePlans.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">No active vaults.</p>
              ) : (
                <div className="space-y-3">
                  {activePlans.slice(0, 4).map((plan) => {
                    const progress = timeProgress(plan.start_date, plan.end_date);
                    return (
                      <a
                        key={plan.id}
                        href="/dashboard/plans"
                        className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-all">
                          <Wallet size={18} style={{ color: BRAND }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-bold text-slate-900 text-sm truncate">{plan.name}</p>
                            <span className="text-xs font-bold text-slate-500 ml-2 flex-shrink-0">{progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full">
                            <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: BRAND }} />
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] text-slate-400">Target: {formatCurrency(plan.target_amount)}</span>
                            <span className="text-[10px] text-slate-400 capitalize">{plan.frequency}</span>
                          </div>
                        </div>
                        <ArrowUpRight size={14} className="text-slate-300 group-hover:text-[#0F3E76] flex-shrink-0 transition-colors" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200/50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Operations</h3>
              <QuickActions />
            </div> */}

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Member Registry</h3>
                <a href="/dashboard/users" className="text-[9px] font-black text-[#0F3E76] uppercase tracking-widest hover:underline">
                  View All
                </a>
              </div>

              {loadingMembers ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 size={24} className="animate-spin text-slate-300" />
                </div>
              ) : members.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">No members yet.</p>
              ) : (
                <div className="space-y-3">
                  {members.slice(0, 5).map((m) => (
                    <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="w-9 h-9 bg-[#0F172A] rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                        {getInitials(m)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm leading-none truncate">
                          {m.first_name} {m.last_name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{m.email}</p>
                      </div>
                      <span
                        className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                          m.suspended ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                        }`}
                      >
                        {m.suspended ? "Suspended" : "Active"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {subFeatures && (
              <div className="rounded-[2.5rem] p-8 text-white" style={{ backgroundColor: BRAND }}>
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Your Plan</h3>
                <p className="text-2xl font-black mb-1">{subFeatures.title}</p>
                <p className="text-sm opacity-70 mb-6">
                  {subFeatures.currency} {Number(subFeatures.price).toFixed(2)} / {subFeatures.billing_cycle}
                </p>
                <div className="flex justify-between text-xs">
                  <div>
                    <p className="opacity-60 font-bold uppercase text-[9px]">Expires</p>
                    <p className="font-black">
                      {new Date(subFeatures.ends_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}
                    </p>
                  </div>
                  <span
                    className={`self-end px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                      subFeatures.status === "active" ? "bg-green-400/20 text-green-300" : "bg-red-400/20 text-red-300"
                    }`}
                  >
                    {subFeatures.status}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
