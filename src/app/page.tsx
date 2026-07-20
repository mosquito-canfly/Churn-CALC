"use client";

import { Users, AlertTriangle, DollarSign, TrendingUp } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import RevenueImpactPanel from "@/components/RevenueImpactPanel";
import RiskDistributionChart from "@/components/RiskDistributionChart";
import CustomerTable from "@/components/CustomerTable";
import AtRiskRegister from "@/components/AtRiskRegister";
import ChurnReasonSummary from "@/components/ChurnReasonSummary";
import UploadModal from "@/components/UploadModal";
import { useCustomersWithRisk } from "@/lib/useCustomersWithRisk";
import {
  getTotalCustomers,
  getPercentAtRisk,
  getRevenueAtRisk,
  getMRR,
  getActionableCustomers,
  rankByRevenueAtRisk,
} from "@/lib/mockData";
import { formatCurrency } from "@/lib/risk";

export default function OverviewPage() {
  const { customers, error } = useCustomersWithRisk();
  const rankedAtRisk = rankByRevenueAtRisk(getActionableCustomers(customers));
  const topCustomers = rankedAtRisk.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Overview</h1>
          <p className="mt-1 text-sm text-neutral-500">
            A snapshot of customer health across your subscription base.
          </p>
        </div>
        <UploadModal />
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          {error} Showing cached risk scores instead.
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Customers" value={getTotalCustomers(customers).toString()} icon={Users} />
        <MetricCard label="% At Risk" value={`${getPercentAtRisk(customers)}%`} icon={AlertTriangle} tone="danger" />
        <MetricCard label="Revenue at Risk" value={formatCurrency(getRevenueAtRisk(customers))} icon={DollarSign} tone="danger" />
        <MetricCard label="MRR" value={formatCurrency(getMRR(customers))} icon={TrendingUp} />
      </div>

      <div className="mt-6">
        <RevenueImpactPanel customers={customers} />
      </div>

      <div className="mt-6">
        <RiskDistributionChart customers={customers} />
      </div>

      <div className="mt-6">
        <ChurnReasonSummary customers={rankedAtRisk} />
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-neutral-500">Highest Risk Customers</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Top {topCustomers.length} by revenue at risk — see the full list in the
              register below.
            </p>
          </div>
          <a href="/customers" className="text-sm font-medium text-neutral-600 hover:underline">
            View all
          </a>
        </div>
        <CustomerTable customers={topCustomers} />
      </div>

      <div className="mt-6">
        <div className="mb-3">
          <h2 className="text-sm font-medium text-neutral-500">At-Risk Register</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Every at-risk and under-utilized customer, ranked by revenue at risk, with the
            top driver behind their score and the recommended action to take.
          </p>
        </div>
        <AtRiskRegister customers={customers} />
      </div>
    </div>
  );
}
