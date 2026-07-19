import { DollarSign, CalendarClock, ShieldCheck } from "lucide-react";
import { getAtRiskCustomers, getRevenueAtRisk, type Customer } from "@/lib/mockData";
import { formatCurrency } from "@/lib/risk";

const RETENTION_RATE = 0.4;

export default function RevenueImpactPanel({ customers }: { customers: Customer[] }) {
  const atRiskCustomers = getAtRiskCustomers(customers);
  const monthlyAtRisk = getRevenueAtRisk(customers);
  const annualAtRisk = monthlyAtRisk * 12;
  const recoverable = monthlyAtRisk * RETENTION_RATE;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-medium text-neutral-500">Revenue at Risk</h2>

      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-neutral-600">
            <DollarSign size={14} aria-hidden="true" />
            Monthly Revenue at Risk
          </div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-red-700">
            {formatCurrency(monthlyAtRisk)}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-neutral-600">
            <CalendarClock size={14} aria-hidden="true" />
            Annual Revenue at Risk
          </div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-red-700">
            {formatCurrency(annualAtRisk)}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <ShieldCheck size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          Acting on your {atRiskCustomers.length} at-risk customers could protect an estimated{" "}
          <span className="font-semibold">{formatCurrency(recoverable)}/month</span>.
        </p>
      </div>
    </div>
  );
}
