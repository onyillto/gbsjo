"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { CreditCard, Loader2, CheckCircle2, Users, Target, TrendingUp } from "lucide-react";

interface SubscriptionPlan {
  id: number;
  name: string;
  status: string;
  features: Record<string, boolean>;
  currency: string;
  max_users: number;
  max_plans: number;
  max_contributions: number;
  price: string;
  billing_cycle: string;
  inserted_at: string;
  updated_at: string;
}

export default function SubscriptionsPage() {
  const user = useAuthStore((s) => s.user);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/tenant/subscriptions");
      const json = await res.json();
      if (res.ok && json.status) setPlans(json.data);
      else setError("Failed to load subscription plans.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const currentSub = user?.subscription_features;

  return (
    <DashboardLayout pageTitle="Subscriptions">
      <div className="max-w-[1100px] mx-auto px-6 py-10 min-h-screen">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Subscriptions</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Manage your tenant subscription plan.</p>
        </div>

        {currentSub && (
          <div className="rounded-[2rem] p-8 mb-10 text-white relative overflow-hidden" style={{ backgroundColor: "#0F3E76" }}>
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-20 w-60 h-60 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2 block">Current Plan</span>
                  <h2 className="text-3xl font-black tracking-tight">{currentSub.title}</h2>
                  <p className="text-sm opacity-70 mt-1">
                    {currentSub.currency} {Number(currentSub.price).toFixed(2)} / {currentSub.billing_cycle}
                  </p>
                </div>
                <span
                  className={`self-start px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    currentSub.status === "active" ? "bg-green-400/20 text-green-300" : "bg-red-400/20 text-red-300"
                  }`}
                >
                  {currentSub.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white/10 rounded-2xl p-4">
                  <Users size={18} className="opacity-60 mb-2" />
                  <p className="text-2xl font-black">{currentSub.max_users}</p>
                  <p className="text-[10px] font-bold uppercase opacity-60">Max Users</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <Target size={18} className="opacity-60 mb-2" />
                  <p className="text-2xl font-black">{currentSub.max_plans}</p>
                  <p className="text-[10px] font-bold uppercase opacity-60">Max Plans</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <TrendingUp size={18} className="opacity-60 mb-2" />
                  <p className="text-2xl font-black">{currentSub.max_contributions}</p>
                  <p className="text-[10px] font-bold uppercase opacity-60">Max Contributions</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6 text-[10px] font-bold uppercase opacity-60">
                <span>Starts: {new Date(currentSub.starts_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}</span>
                <span>·</span>
                <span>Renews: {new Date(currentSub.ends_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Available Plans</h3>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 size={28} className="animate-spin text-slate-300" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <p className="text-slate-500 text-sm">{error}</p>
              <button onClick={fetchPlans} className="text-xs font-bold text-[#0F3E76] underline">Retry</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrent = currentSub?.title === plan.name;
                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-[2rem] p-7 border transition-all ${
                      isCurrent ? "border-[#0F3E76] shadow-lg shadow-blue-100" : "border-slate-100 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center">
                        <CreditCard size={20} style={{ color: "#0F3E76" }} />
                      </div>
                      <div className="flex items-center gap-2">
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-[#0F3E76] bg-blue-50 px-2 py-1 rounded-full uppercase">
                            <CheckCircle2 size={10} /> Current
                          </span>
                        )}
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-1 rounded-full ${
                            plan.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {plan.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                    <p className="text-2xl font-black text-[#0F3E76] mb-1">
                      {plan.currency} {Number(plan.price).toFixed(2)}
                      <span className="text-sm font-bold text-slate-400 ml-1">/ {plan.billing_cycle}</span>
                    </p>

                    <div className="mt-5 space-y-2">
                      {[
                        { label: "Max Users", value: plan.max_users },
                        { label: "Max Plans", value: plan.max_plans },
                        { label: "Max Contributions", value: plan.max_contributions },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-xs text-slate-600">
                          <span className="font-medium">{label}</span>
                          <span className="font-bold">{value}</span>
                        </div>
                      ))}
                    </div>

                    {Object.keys(plan.features).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Features</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(plan.features).map(([key, val]) => (
                            <span
                              key={key}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                val ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {key.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
