import { ShieldCheck } from "lucide-react";
import { getAtRiskCustomers, getRevenueAtRisk, type Customer } from "@/lib/mockData";
import { formatCurrency } from "@/lib/risk";

const RETENTION_RATE = 0.4;

export default function RevenueImpactPanel({ customers }: { customers: Customer[] }) {
  const atRiskCustomers = getAtRiskCustomers(customers);
  const monthlyAtRisk = getRevenueAtRisk(customers);
  const recoverable = monthlyAtRisk * RETENTION_RATE;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-green-400">
        <ShieldCheck size={16} aria-hidden="true" />
      </span>
      <p className="text-sm leading-relaxed text-neutral-300">
        Acting on your {atRiskCustomers.length} at-risk customers could protect an estimated{" "}
        <span className="font-semibold text-green-400">{formatCurrency(recoverable)}/month</span> in
        recurring revenue.
      </p>
    </div>
  );
}
