"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import ContributionChart from "@/components/contribution-chart";
import RecentActivity from "@/components/recent-activity";
import PlansOverview from "@/components/plans-overview";
import MembersSnapshot from "@/components/members-snapshot";
import QuickActions from "@/components/quick-actions";
import UpcomingMeetings from "@/components/upcoming-meetings";
import { TrendingUp, Users, Target, AlertCircle, Plus } from "lucide-react";

// Dummy data remains same as provided in your prompt...
const DUMMY_STATS = {
  totalPlans: 5,
  activePlans: 4,
  totalMembers: 120,
  totalContributions: "₦5,200,000",
  pendingContributions: "₦800,000",
  completionRate: 78,
};
const DUMMY_PLANS = [
  {
    id: "plan_1",
    name: "House Savings",
    target: 1000000,
    collected: 650000,
    members: 45,
    status: "active" as const,
    progress: 65,
  },
  {
    id: "plan_2",
    name: "Education Fund",
    target: 2000000,
    collected: 1200000,
    members: 60,
    status: "active" as const,
    progress: 60,
  },
  {
    id: "plan_3",
    name: "Wedding Fund",
    target: 500000,
    collected: 250000,
    members: 30,
    status: "active" as const,
    progress: 50,
  },
];
const DUMMY_RECENT_ACTIVITY = [
  {
    id: "activity_1",
    type: "contribution",
    message: "Chioma Adeleke contributed ₦50,000 to House Savings",
    timestamp: "2 hours ago",
    icon: "💰",
  },
  {
    id: "activity_2",
    type: "member",
    message: "New member Grace Okonkwo joined the cooperative",
    timestamp: "4 hours ago",
    icon: "👤",
  },
  {
    id: "activity_3",
    type: "plan",
    message: "House Savings plan reached 65% completion",
    timestamp: "1 day ago",
    icon: "🎯",
  },
  {
    id: "activity_4",
    type: "contribution",
    message: "John David contributed ₦30,000 to Education Fund",
    timestamp: "2 days ago",
    icon: "💰",
  },
];
const DUMMY_MEMBERS = [
  {
    id: "member_1",
    name: "Chioma Adeleke",
    role: "Admin" as const,
    status: "active" as const,
    avatar: "CA",
  },
  {
    id: "member_2",
    name: "John David",
    role: "Member" as const,
    status: "active" as const,
    avatar: "JD",
  },
  {
    id: "member_3",
    name: "Jane Smith",
    role: "Manager" as const,
    status: "active" as const,
    avatar: "JS",
  },
];
const DUMMY_CHART_DATA = [
  { day: "Mon", value: 35 },
  { day: "Tue", value: 85 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 45 },
  { day: "Sat", value: 65 },
  { day: "Sun", value: 40 },
];
const DUMMY_MEETINGS = [
  {
    id: "meeting_1",
    title: "Board Meeting",
    date: "Today",
    time: "2:00 PM - 4:00 PM",
    attendees: 8,
  },
  {
    id: "meeting_2",
    title: "Members Contribution Review",
    date: "Tomorrow",
    time: "10:00 AM - 11:00 AM",
    attendees: 120,
  },
];

export default function Dashboard() {
  const brandColor = "#0F3E76";

  return (
    <DashboardLayout pageTitle="Overview">
      <div className="max-w-[1400px] mx-auto px-6 py-8 min-h-screen bg-[#FDFDFD]">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Welcome back! Here is your cooperative overview.
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95"
            style={{ backgroundColor: brandColor }}
          >
            <Plus size={14} strokeWidth={3} /> New Entry
          </button>
        </div>

        {/* KPI Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            label="Total Contributions"
            value={DUMMY_STATS.totalContributions}
            trend="+12%"
            icon={<TrendingUp size={20} />}
          />
          <StatCard
            label="Active Plans"
            value={DUMMY_STATS.activePlans}
            subtitle={`${DUMMY_STATS.activePlans}/${DUMMY_STATS.totalPlans} Total`}
            icon={<Target size={20} />}
          />
          <StatCard
            label="Total Members"
            value={DUMMY_STATS.totalMembers}
            trend="+8 New"
            icon={<Users size={20} />}
          />
          <StatCard
            label="Pending Assets"
            value={DUMMY_STATS.pendingContributions}
            trend="Critical"
            icon={<AlertCircle size={20} />}
          />
        </div>

        {/* Main Grid: Using items-start and fixed heights to prevent layout shifts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Main Data */}
          <div className="lg:col-span-8 space-y-6">
            {/* Chart - Fixed Height prevents jumping */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm h-[400px] overflow-hidden">
              <ContributionChart data={DUMMY_CHART_DATA} />
            </div>

            {/* Plans - Self-contained */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Active Vaults
                </h3>
              </div>
              <PlansOverview plans={DUMMY_PLANS} />
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Operations */}
          <div className="lg:col-span-4 space-y-6">
            {/* Upcoming Meetings */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                Briefings
              </h3>
              <UpcomingMeetings meetings={DUMMY_MEETINGS} />
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200/50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                Operations
              </h3>
              <QuickActions />
            </div>

            {/* Activity - Fixed height with internal scroll to keep grid balanced */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm h-[480px] flex flex-col overflow-hidden">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                Live Activity
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <RecentActivity activities={DUMMY_RECENT_ACTIVITY} />
              </div>
            </div>

            {/* Members Snapshot */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                Member Registry
              </h3>
              <MembersSnapshot members={DUMMY_MEMBERS} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
