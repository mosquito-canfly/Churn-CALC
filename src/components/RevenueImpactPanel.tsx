import { ShieldCheck } from "lucide-react";
import { getAtRiskCustomers, getRevenueAtRisk, type Customer } from "@/lib/mockData";
import { formatCurrency } from "@/lib/risk";

const RETENTION_RATE = 0.4;

export default function RevenueImpactPanel({ customers }: { customers: Customer[] }) {
  const atRiskCustomers = getAtRiskCustomers(customers);
  const monthlyAtRisk = getRevenueAtRisk(customers);
  const recoverable = monthlyAtRisk * RETENTION_RATE;

  return (
    <div className="flex items-start gap-2 rounded-lg border border-emerald-900 bg-emerald-950 px-4 py-3 text-sm text-neutral-300">
      <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden="true" />
      <p>
        <span className="font-semibold text-white">Smart Insight:</span> Acting on your{" "}
        {atRiskCustomers.length} at-risk customers could protect an estimated{" "}
        <span className="font-semibold text-emerald-400">{formatCurrency(recoverable)}/month</span> in
        recurring revenue.
      </p>
    </div>
  );
}
