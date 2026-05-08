"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { apiFetch } from "@/lib/api";
import {
  Search, Power, PowerOff, ArrowUpRight, Wallet, Calendar,
  Activity, ArrowLeft, Plus, X, Loader2, Archive, CheckCircle2, Clock, AlertCircle,
} from "lucide-react";

interface BackendPlan {
  id: number;
  name: string;
  status: "active" | "disabled" | "archived";
  type: string;
  description: string;
  features: { perks: string[] };
  currency: string;
  fund_locked: boolean;
  tenant_id: number;
  inserted_at: string;
  minimum_amount: string;
  target_amount: string;
  duration_in_months: number;
  start_date: string;
  end_date: string;
  target_apy: string;
  frequency: string;
  auto_renew: boolean;
  auto_pay: boolean;
  updated_at: string;
}

interface PlanContribution {
  id: number;
  plan_id: number;
  member_id?: number;
  user_id?: number;
  amount: string | number;
  status: string;
  reference?: string;
  inserted_at: string;
}

function ContribStatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  if (s === "completed" || s === "success")
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-bold uppercase"><CheckCircle2 size={9} />{status}</span>;
  if (s === "pending")
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold uppercase"><Clock size={9} />{status}</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold uppercase"><AlertCircle size={9} />{status}</span>;
}

interface CreatePlanPayload {
  name: string;
  description: string;
  minimum_amount: number;
  target_amount: number;
  start_date: string;
  end_date: string;
  currency: string;
  target_apy: string;
  frequency: string;
  type: string;
  status: string;
  auto_renew: boolean;
  auto_pay: boolean;
  fund_locked: boolean;
  features: { perks: string[] };
}

const PERK_OPTIONS = ["auto-save", "early-withdrawal-option", "monthly-interest-credit"];
const BRAND = "#0F3E76";

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

const defaultForm: CreatePlanPayload = {
  name: "", description: "", minimum_amount: 0, target_amount: 0,
  start_date: "", end_date: "", currency: "NGN", target_apy: "",
  frequency: "monthly", type: "stable", status: "active",
  auto_renew: true, auto_pay: false, fund_locked: false,
  features: { perks: [] },
};

export default function PlansPage() {
  const [plans, setPlans] = useState<BackendPlan[]>([]);
  const [myPlans, setMyPlans] = useState<BackendPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMyPlans, setLoadingMyPlans] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<BackendPlan | null>(null);
  const [planContributions, setPlanContributions] = useState<PlanContribution[]>([]);
  const [loadingContributions, setLoadingContributions] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<CreatePlanPayload>(defaultForm);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/tenant/plans");
      const json = await res.json();
      if (res.ok && json.status) setPlans(json.data);
      else setError("Failed to load plans.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyPlans = useCallback(async () => {
    setLoadingMyPlans(true);
    try {
      const res = await apiFetch("/api/tenant/plans/my_plans");
      const json = await res.json();
      if (res.ok && json.status) setMyPlans(json.data ?? []);
    } finally {
      setLoadingMyPlans(false);
    }
  }, []);

  const fetchPlanContributions = useCallback(async (planId: number) => {
    setLoadingContributions(true);
    setPlanContributions([]);
    try {
      const res = await apiFetch(`/api/tenant/contributions/${planId}`);
      const json = await res.json();
      if (res.ok && json.status) setPlanContributions(json.data ?? []);
    } finally {
      setLoadingContributions(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    if (activeTab === "my" && myPlans.length === 0) fetchMyPlans();
  }, [activeTab, myPlans.length, fetchMyPlans]);

  useEffect(() => {
    if (selectedPlan) fetchPlanContributions(selectedPlan.id);
  }, [selectedPlan, fetchPlanContributions]);

  const handleAction = async (id: number, action: "enable" | "disable" | "archive") => {
    setActionLoading(`${action}-${id}`);
    try {
      const res = await apiFetch(`/api/tenant/plans/${id}/${action}`, { method: "PUT" });
      if (res.ok) {
        await fetchPlans();
        if (selectedPlan?.id === id) {
          const updated = await apiFetch(`/api/tenant/plans/${id}`);
          const json = await updated.json();
          if (json.status) setSelectedPlan(json.data);
        }
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Permanently delete this vault?")) return;
    setActionLoading(`delete-${id}`);
    try {
      const res = await apiFetch(`/api/tenant/plans/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSelectedPlan(null);
        await fetchPlans();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");
    try {
      const res = await apiFetch("/api/tenant/plans", { method: "POST", body: JSON.stringify(createForm) });
      const json = await res.json();
      if (res.ok && json.status) {
        setShowCreateModal(false);
        setCreateForm(defaultForm);
        await fetchPlans();
      } else {
        setCreateError(json.message || json.error || "Failed to create plan.");
      }
    } catch {
      setCreateError("Network error. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  const togglePerk = (perk: string) =>
    setCreateForm((f) => ({
      ...f,
      features: {
        perks: f.features.perks.includes(perk)
          ? f.features.perks.filter((p) => p !== perk)
          : [...f.features.perks, perk],
      },
    }));

  const sourceList = activeTab === "my" ? myPlans : plans;
  const filteredPlans = sourceList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "all" || p.status === filterStatus)
  );

  // --- DETAIL VIEW ---
  if (selectedPlan) {
    const progress = timeProgress(selectedPlan.start_date, selectedPlan.end_date);
    const isActive = selectedPlan.status === "active";

    return (
      <DashboardLayout pageTitle={selectedPlan.name}>
        <div className="max-w-[1200px] mx-auto px-6 py-8 bg-[#FDFDFD] min-h-screen">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="space-y-1">
              <button
                onClick={() => setSelectedPlan(null)}
                className="group flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#0F3E76] transition-colors mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Registry
              </button>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{selectedPlan.name}</h1>
              <p className="text-sm text-slate-500 font-medium">{selectedPlan.description}</p>
            </div>
            <span
              className={`self-start px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                selectedPlan.status === "active" ? "bg-green-100 text-green-700"
                : selectedPlan.status === "archived" ? "bg-slate-100 text-slate-500"
                : "bg-red-100 text-red-600"
              }`}
            >
              {selectedPlan.status}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-8 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">Performance</h3>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-bold text-slate-900 tracking-tighter">{progress}%</span>
                <span className="text-slate-400 font-bold text-xs mb-1.5">time elapsed</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full mb-8">
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: BRAND }} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Min. Amount", value: formatCurrency(selectedPlan.minimum_amount) },
                  { label: "Target", value: formatCurrency(selectedPlan.target_amount) },
                  { label: "APY", value: selectedPlan.target_apy },
                  { label: "Duration", value: `${selectedPlan.duration_in_months}mo` },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
                    <p className="text-lg font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-5">
              <div className="bg-[#0F3E76] rounded-[2rem] p-8 text-white flex flex-col justify-between h-[160px] shadow-lg">
                <Calendar size={22} className="opacity-40" />
                <div>
                  <p className="text-lg font-bold capitalize">{selectedPlan.frequency}</p>
                  <p className="text-[10px] font-bold opacity-60 uppercase">Cycle · {selectedPlan.type}</p>
                </div>
              </div>
              <div className="bg-white rounded-[2rem] border border-slate-200 p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Features / Perks</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPlan.features.perks.map((perk) => (
                    <span key={perk} className="text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{perk}</span>
                  ))}
                </div>
                <div className="space-y-1 text-[9px] text-slate-400">
                  <p>Fund Locked: <span className="font-bold text-slate-700">{selectedPlan.fund_locked ? "Yes" : "No"}</span></p>
                  <p>Auto Renew: <span className="font-bold text-slate-700">{selectedPlan.auto_renew ? "Yes" : "No"}</span></p>
                  <p>Auto Pay: <span className="font-bold text-slate-700">{selectedPlan.auto_pay ? "Yes" : "No"}</span></p>
                </div>
              </div>
            </div>

            <div className="col-span-12 bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
              <div className="flex flex-wrap gap-6">
                {[
                  { label: "Start Date", value: new Date(selectedPlan.start_date).toLocaleDateString("en-NG", { dateStyle: "medium" }) },
                  { label: "End Date", value: new Date(selectedPlan.end_date).toLocaleDateString("en-NG", { dateStyle: "medium" }) },
                  { label: "Created", value: new Date(selectedPlan.inserted_at).toLocaleDateString("en-NG", { dateStyle: "medium" }) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
                    <p className="text-sm font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contributions</h3>
                {!loadingContributions && (
                  <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {planContributions.length} record{planContributions.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {loadingContributions ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 size={22} className="animate-spin text-slate-300" />
                </div>
              ) : planContributions.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">No contributions recorded for this vault.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-50">
                        {["Amount", "Status", "Reference", "Date"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {planContributions.slice(0, 8).map((c, i) => (
                        <tr key={c.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${i === Math.min(planContributions.length, 8) - 1 ? "border-b-0" : ""}`}>
                          <td className="px-4 py-3 text-sm font-bold text-slate-900">{formatCurrency(c.amount)}</td>
                          <td className="px-4 py-3"><ContribStatusBadge status={c.status} /></td>
                          <td className="px-4 py-3 text-xs font-mono text-slate-400">{c.reference ?? "—"}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">
                            {c.inserted_at ? new Date(c.inserted_at).toLocaleDateString("en-NG", { dateStyle: "medium" }) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="col-span-12 flex flex-wrap items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-200 gap-4">
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-slate-400" />
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Management</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAction(selectedPlan.id, isActive ? "disable" : "enable")}
                  disabled={!!actionLoading || selectedPlan.status === "archived"}
                  className="px-4 py-2 bg-white text-slate-700 rounded-xl font-bold text-xs border border-slate-200 flex items-center gap-2 hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                  {actionLoading === `${isActive ? "disable" : "enable"}-${selectedPlan.id}`
                    ? <Loader2 size={14} className="animate-spin" />
                    : isActive ? <PowerOff size={14} /> : <Power size={14} />}
                  {isActive ? "Disable" : "Enable"}
                </button>
                {selectedPlan.status !== "archived" && (
                  <button
                    onClick={() => handleAction(selectedPlan.id, "archive")}
                    disabled={!!actionLoading}
                    className="px-4 py-2 bg-white text-slate-700 rounded-xl font-bold text-xs border border-slate-200 flex items-center gap-2 hover:bg-slate-100 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === `archive-${selectedPlan.id}` ? <Loader2 size={14} className="animate-spin" /> : <Archive size={14} />}
                    Archive
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedPlan.id)}
                  disabled={!!actionLoading}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading === `delete-${selectedPlan.id}` && <Loader2 size={14} className="animate-spin" />}
                  Delete Vault
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // --- LIST VIEW ---
  return (
    <DashboardLayout pageTitle="Vaults">
      <div className="max-w-[1200px] mx-auto px-6 py-10 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Vaults</h1>
            <p className="text-slate-400 font-medium text-sm">Collective wealth management architecture.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            style={{ backgroundColor: BRAND }}
          >
            <Plus size={16} /> Create New Vault
          </button>
        </div>

        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
          {(["all", "my"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? "bg-white text-[#0F3E76] shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "all" ? "All Vaults" : "My Vaults"}
              {tab === "all" && !loading && (
                <span className="ml-1.5 text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{plans.length}</span>
              )}
              {tab === "my" && !loadingMyPlans && myPlans.length > 0 && (
                <span className="ml-1.5 text-[9px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">{myPlans.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search vaults..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 outline-none placeholder:text-slate-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 outline-none shadow-sm cursor-pointer hover:bg-slate-50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {(loading && activeTab === "all") || (loadingMyPlans && activeTab === "my") ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={32} className="animate-spin text-slate-300" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <p className="text-slate-500 text-sm">{error}</p>
            <button onClick={fetchPlans} className="text-xs font-bold text-[#0F3E76] underline">Retry</button>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-400 text-sm">No vaults found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const progress = timeProgress(plan.start_date, plan.end_date);
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className="group bg-white p-7 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-8">
                    <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all">
                      <Wallet size={20} style={{ color: BRAND }} />
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                        plan.status === "active" ? "bg-green-100 text-green-700"
                        : plan.status === "archived" ? "bg-slate-100 text-slate-500"
                        : "bg-red-100 text-red-600"
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1 group-hover:text-[#0F3E76] transition-colors">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium line-clamp-1 mb-6">{plan.description}</p>

                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Time Progress</span>
                        <span className="text-xs font-bold text-slate-900">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: BRAND }} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Target</p>
                        <p className="text-base font-bold text-slate-900">{formatCurrency(plan.target_amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">APY</p>
                        <p className="text-base font-bold text-slate-900">{plan.target_apy}</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#0F3E76] transition-all">
                        <ArrowUpRight size={16} className="group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-8 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Create New Vault</h2>
              <button
                onClick={() => { setShowCreateModal(false); setCreateForm(defaultForm); setCreateError(""); }}
                className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-8 space-y-5">
              {createError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700">{createError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Plan Name</label>
                  <input type="text" required value={createForm.name} onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="e.g. Premium Growth Plan" />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Description</label>
                  <textarea required value={createForm.description} onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
                    rows={2} placeholder="Short description" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Minimum Amount (₦)</label>
                  <input type="number" required min={0} value={createForm.minimum_amount || ""}
                    onChange={(e) => setCreateForm((f) => ({ ...f, minimum_amount: Number(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Target Amount (₦)</label>
                  <input type="number" required min={0} value={createForm.target_amount || ""}
                    onChange={(e) => setCreateForm((f) => ({ ...f, target_amount: Number(e.target.value) }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Start Date</label>
                  <input type="date" required value={createForm.start_date} onChange={(e) => setCreateForm((f) => ({ ...f, start_date: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">End Date</label>
                  <input type="date" required value={createForm.end_date} onChange={(e) => setCreateForm((f) => ({ ...f, end_date: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Target APY</label>
                  <input type="text" required value={createForm.target_apy} onChange={(e) => setCreateForm((f) => ({ ...f, target_apy: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    placeholder="e.g. 12.5 %" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Frequency</label>
                  <select value={createForm.frequency} onChange={(e) => setCreateForm((f) => ({ ...f, frequency: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Type</label>
                  <select value={createForm.type} onChange={(e) => setCreateForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white">
                    <option value="stable">Stable</option>
                    <option value="growth">Growth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Status</label>
                  <select value={createForm.status} onChange={(e) => setCreateForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white">
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-3">Perks</label>
                  <div className="flex flex-wrap gap-2">
                    {PERK_OPTIONS.map((perk) => (
                      <button key={perk} type="button" onClick={() => togglePerk(perk)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                          createForm.features.perks.includes(perk)
                            ? "bg-[#0F3E76] text-white border-[#0F3E76]"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400"
                        }`}>
                        {perk}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 flex flex-wrap gap-6">
                  {(["auto_renew", "auto_pay", "fund_locked"] as const).map((key) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={createForm[key]}
                        onChange={(e) => setCreateForm((f) => ({ ...f, [key]: e.target.checked }))}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{key.replace(/_/g, " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={createLoading}
                  className="flex-1 py-3 text-white font-bold rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: BRAND }}>
                  {createLoading && <Loader2 size={16} className="animate-spin" />}
                  {createLoading ? "Creating..." : "Create Vault"}
                </button>
                <button type="button"
                  onClick={() => { setShowCreateModal(false); setCreateForm(defaultForm); setCreateError(""); }}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
