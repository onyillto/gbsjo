"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { apiFetch } from "@/lib/api";
import { Search, Users as UsersIcon, Loader2, ShieldAlert, CheckCircle2, Clock } from "lucide-react";

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  suspended: boolean;
  verified: boolean;
  login_count: number;
  inserted_at: string;
  last_login_at: string | null;
  wallet_funded: boolean;
}

function getInitials(m: Member) {
  return `${m.first_name?.[0] ?? ""}${m.last_name?.[0] ?? ""}`.toUpperCase();
}

function StatusBadge({ suspended, verified }: { suspended: boolean; verified: boolean }) {
  if (suspended)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] font-bold uppercase">
        <ShieldAlert size={10} /> Suspended
      </span>
    );
  if (verified)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-bold uppercase">
        <CheckCircle2 size={10} /> Verified
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold uppercase">
      <Clock size={10} /> Unverified
    </span>
  );
}

export default function UsersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/tenant/members");
      const json = await res.json();
      if (res.ok && json.status) setMembers(json.data);
      else setError("Failed to load members.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filtered = members.filter((m) => {
    const fullName = `${m.first_name} ${m.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !m.suspended) ||
      (filter === "suspended" && m.suspended) ||
      (filter === "verified" && m.verified) ||
      (filter === "unverified" && !m.verified);
    return matchesSearch && matchesFilter;
  });

  const totalActive = members.filter((m) => !m.suspended).length;
  const totalSuspended = members.filter((m) => m.suspended).length;
  const totalVerified = members.filter((m) => m.verified).length;

  return (
    <DashboardLayout pageTitle="Members">
      <div className="max-w-[1300px] mx-auto px-6 py-10 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Members</h1>
            <p className="text-slate-400 font-medium text-sm mt-1">
              {members.length} registered member{members.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: members.length, color: "bg-[#0F3E76] text-white" },
            { label: "Active", value: totalActive, color: "bg-green-50 text-green-800" },
            { label: "Suspended", value: totalSuspended, color: "bg-red-50 text-red-800" },
            { label: "Verified", value: totalVerified, color: "bg-blue-50 text-blue-800" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`p-5 rounded-2xl ${color}`}>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{label}</p>
              <p className="text-3xl font-black">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 shadow-sm focus:border-blue-500 outline-none placeholder:text-slate-400"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 outline-none shadow-sm cursor-pointer hover:bg-slate-50"
          >
            <option value="all">All Members</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
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
              <button onClick={fetchMembers} className="text-xs font-bold text-[#0F3E76] underline">
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-2">
              <UsersIcon size={32} className="text-slate-200" />
              <p className="text-slate-400 text-sm">No members found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50">
                    {["Member", "Phone", "Status", "Logins", "Last Login", "Joined", "Wallet"].map((h) => (
                      <th key={h} className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => (
                    <tr
                      key={m.id}
                      className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                            {getInitials(m)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-none">
                              {m.first_name} {m.last_name}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{m.phone_number ?? "—"}</td>
                      <td className="px-6 py-4">
                        <StatusBadge suspended={m.suspended} verified={m.verified} />
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">{m.login_count}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {m.last_login_at
                          ? new Date(m.last_login_at).toLocaleDateString("en-NG", { dateStyle: "medium" })
                          : "Never"}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(m.inserted_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[9px] font-bold px-2 py-1 rounded-full ${m.wallet_funded ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                        >
                          {m.wallet_funded ? "Funded" : "Unfunded"}
                        </span>
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
