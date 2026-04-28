"use client";

import { ReactNode } from "react";
import Navbar from "../../../components/Sidebar";
export interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}

/**
 * DashboardLayout Component
 *
 * Wraps the entire dashboard application with:
 * - Fixed sidebar navigation
 * - Top header bar with user menu
 * - Responsive design (sidebar collapses on mobile)
 * - Consistent spacing and layout
 *
 * Usage:
 * ```tsx
 * export default function PlansPage() {
 *   return (
 *     <DashboardLayout pageTitle="Plans" pageDescription="Manage your savings plans">
 *       <PlansContent />
 *     </DashboardLayout>
 *   )
 * }
 * ```
 */
export function DashboardLayout({
  children,
  pageTitle,
  pageDescription,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Navbar includes sidebar + top header */}


      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Content Section - Scrollable */}
        <div className="flex-1 overflow-auto">
          {/* Page Header (Optional) */}
          {pageTitle && (
            <div className="border-b border-slate-200 bg-white">
              <div className="max-w-7xl mx-auto px-6 py-6">
                <h1 className="text-3xl font-bold text-slate-900">
                  {pageTitle}
                </h1>
                {pageDescription && (
                  <p className="mt-2 text-slate-600">{pageDescription}</p>
                )}
              </div>
            </div>
          )}

          {/* Page Content */}
          <div className="flex-1">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
