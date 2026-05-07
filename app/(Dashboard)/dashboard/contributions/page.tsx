"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { apiFetch } from "@/lib/api";
import {
  Search, Loader2, TrendingUp, CheckCircle2, Clock, AlertCircle, Filter,
} from "lucide-react";

interface Contribution {
  id: number;
  plan_id: number;
  member_id?: number;
  user_id?: number;
  amount: string | number;
  status: string;
  reference?: string;
  inserted_at: string;
  [key: string]: unknown;
}

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Plan {
  id: number;
  name: string;
}

const BRAND = "#0F3E76";

function formatCurrency(amount: string | number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(Number(amount));
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  if (s === "completed" || s === "success")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-bold uppercase">
        <CheckCircle2 size={10} /> {status}
      </span>
    );
  if (s === "pending")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold uppercase">
        <Clock size={10} /> {status}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold uppercase">
      <AlertCircle size={10} /> {status}
    </span>
  );
}

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [contribRes, memberRes, planRes] = await Promise.all([
        apiFetch("/api/tenant/contributions"),
        apiFetch("/api/tenant/members"),
        apiFetch("/api/tenant/plans"),
      ]);
      const [contribJson, memberJson, planJson] = await Promise.all([
        contribRes.json(),
        memberRes.json(),
        planRes.json(),
      ]);
      if (contribRes.ok && contribJson.status) setContributions(contribJson.data ?? []);
      else setError("Failed to load contributions.");
      if (memberRes.ok && memberJson.status) setMembers(memberJson.data ?? []);
      if (planRes.ok && planJson.status) setPlans(planJson.data ?? []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getMemberName = (c: Contribution) => {
    const mid = c.member_id ?? c.user_id;
    const m = members.find((x) => x.id === mid);
    return m ? `${m.first_name} ${m.last_name}` : `Member #${mid ?? "—"}`;
  };

  const getPlanName = (c: Contribution) => {
    const p = plans.find((x) => x.id === c.plan_id);
    return p?.name ?? `Plan #${c.plan_id ?? "—"}`;
  };

  const filtered = contributions.filter((c) => {
    const name = getMemberName(c).toLowerCase();
    const plan = getPlanName(c).toLowerCase();
    const ref = String(c.reference ?? "").toLowerCase();
    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      plan.includes(search.toLowerCase()) ||
      ref.includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || c.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const total = contributions.reduce((s, c) => s + Number(c.amount), 0);
  const completed = contributions.filter(
    (c) => c.status?.toLowerCase() === "completed" || c.status?.toLowerCase() === "success"
  ).length;
  const pending = contributions.filter(
    (c) => c.status?.toLowerCase() === "pending"
  ).length;

  return (
    <DashboardLayout pageTitle="Contributions">
      <div className="max-w-[1300px] mx-auto px-6 py-10 min-h-screen">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Contributions</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">
            {contributions.length} contribution{contributions.length !== 1 ? "s" : ""} recorded
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Value"
            value={formatCurrency(total)}
            trend="All contributions"
            icon={<TrendingUp size={20} />}
            highlight
          />
          <StatCard
            label="Total Count"
            value={contributions.length}
            trend="Recorded entries"
            icon={<Filter size={20} />}
          />
          <StatCard
            label="Completed"
            value={completed}
            trend="Paid in full"
            icon={<CheckCircle2 size={20} />}
          />
          <StatCard
            label="Pending"
            value={pending}
            trend="Awaiting payment"
            icon={<Clock size={20} />}
          />
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by member, plan or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 outline-none placeholder:text-slate-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 outline-none shadow-sm cursor-pointer hover:bg-slate-50"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 size={32} className="animate-spin text-slate-300" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <p className="text-slate-500 text-sm">{error}</p>
              <button onClick={fetchAll} className="text-xs font-bold text-[#0F3E76] underline">
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-2">
              <TrendingUp size={32} className="text-slate-200" />
              <p className="text-slate-400 text-sm">No contributions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50">
                    {["Member", "Plan", "Amount", "Status", "Reference", "Date"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                        i === filtered.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                            style={{ backgroundColor: BRAND }}
                          >
                            {getMemberName(c)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <p className="font-bold text-slate-900 text-sm">{getMemberName(c)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {getPlanName(c)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        {formatCurrency(c.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        {c.reference ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {c.inserted_at
                          ? new Date(c.inserted_at).toLocaleDateString("en-NG", {
                              dateStyle: "medium",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
