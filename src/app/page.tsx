"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { Users, AlertTriangle, DollarSign, TrendingUp, LineChart, Zap } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import RevenueImpactPanel from "@/components/RevenueImpactPanel";
import RiskDistributionChart from "@/components/RiskDistributionChart";
import NetSubscribersChart from "@/components/NetSubscribersChart";
import CustomerTable from "@/components/CustomerTable";
import AtRiskRegister from "@/components/AtRiskRegister";
import ChurnReasonSummary from "@/components/ChurnReasonSummary";
import RetentionOutbox from "@/components/RetentionOutbox";
import UploadModal from "@/components/UploadModal";
import SectionHeading from "@/components/SectionHeading";
import { useCustomersWithRisk } from "@/lib/useCustomersWithRisk";
import {
  getTotalCustomers,
  getPercentAtRisk,
  getRevenueAtRisk,
  getMRR,
  getAtRiskCustomers,
  getActionableCustomers,
  rankByRevenueAtRisk,
} from "@/lib/mockData";
import { formatCurrency } from "@/lib/risk";

const TABS = [
  { id: "insights", label: "Executive Insights", icon: LineChart },
  { id: "actions", label: "Action Center", icon: Zap },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function OverviewPage() {
  const { customers, error } = useCustomersWithRisk();
  const rankedAtRisk = rankByRevenueAtRisk(getActionableCustomers(customers));
  const topCustomers = rankedAtRisk.slice(0, 5);
  const atRiskCount = getAtRiskCustomers(customers).length;

  const [activeTab, setActiveTab] = useState<TabId>("insights");

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % TABS.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = TABS.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();
    setActiveTab(TABS[nextIndex].id);
    document.getElementById(`tab-${TABS[nextIndex].id}`)?.focus();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Overview</h1>
          <p className="mt-1 text-sm text-neutral-400">
            A snapshot of customer health across your subscription base.
          </p>
        </div>
        <UploadModal />
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-amber-900 bg-amber-950 px-4 py-2 text-sm text-amber-300">
          {error} Showing cached risk scores instead.
        </div>
      )}

      <div
        role="tablist"
        aria-label="Overview sections"
        className="mt-6 inline-flex gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-1"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={handleTabKeyDown}
              className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <Icon size={14} className={isActive ? "text-sky-400" : ""} aria-hidden="true" />
              {tab.label}
              {tab.id === "actions" && atRiskCount > 0 && (
                <span
                  className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                    isActive ? "bg-sky-950 text-sky-400" : "bg-neutral-800 text-neutral-300"
                  }`}
                >
                  {atRiskCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        id="panel-insights"
        role="tabpanel"
        aria-labelledby="tab-insights"
        hidden={activeTab !== "insights"}
        tabIndex={0}
      >
        {activeTab === "insights" && (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Total Customers" value={getTotalCustomers(customers).toString()} icon={Users} />
              <MetricCard label="% At Risk" value={`${getPercentAtRisk(customers)}%`} icon={AlertTriangle} tone="danger" />
              <MetricCard label="Revenue at Risk" value={formatCurrency(getRevenueAtRisk(customers))} icon={DollarSign} tone="danger" />
              <MetricCard label="MRR" value={formatCurrency(getMRR(customers))} icon={TrendingUp} />
            </div>

            <div className="mt-6">
              <RevenueImpactPanel customers={customers} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <RiskDistributionChart customers={customers} />
              <ChurnReasonSummary customers={rankedAtRisk} />
            </div>

            <div className="mt-6">
              <NetSubscribersChart customers={customers} />
            </div>

            <div className="mt-6">
              <div className="mb-3">
                <SectionHeading
                  title="Highest risk customers"
                  subtitle={`Top ${topCustomers.length} by revenue at risk — see the full list in the register below.`}
                  action={
                    <Link href="/customers" className="text-sm font-medium text-sky-400 hover:text-sky-300 hover:underline">
                      View all
                    </Link>
                  }
                />
              </div>
              <CustomerTable customers={topCustomers} />
            </div>
          </>
        )}
      </div>

      <div
        id="panel-actions"
        role="tabpanel"
        aria-labelledby="tab-actions"
        hidden={activeTab !== "actions"}
        tabIndex={0}
      >
        {activeTab === "actions" && (
          <>
            <div className="mt-6">
              <RetentionOutbox customers={customers} />
            </div>

            <div className="mt-6">
              <div className="mb-3">
                <SectionHeading
                  title="At-risk register"
                  subtitle="Every at-risk and under-utilized customer, ranked by revenue at risk, with the top driver behind their score and the recommended action to take."
                />
              </div>
              <AtRiskRegister customers={customers} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
