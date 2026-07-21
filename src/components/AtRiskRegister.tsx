import Link from "next/link";
import {
  getActionableCustomers,
  getCustomerRevenueAtRisk,
  rankByRevenueAtRisk,
  type Customer,
} from "@/lib/mockData";
import { formatCurrency } from "@/lib/risk";
import { getChurnReason } from "@/lib/churnReason";
import { getPlanRecommendation } from "@/lib/planRecommendation";
import RiskBadge from "@/components/RiskBadge";
import RecommendationBadge from "@/components/RecommendationBadge";
import Avatar from "@/components/Avatar";

export default function AtRiskRegister({ customers }: { customers: Customer[] }) {
  const sorted = rankByRevenueAtRisk(getActionableCustomers(customers));

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900 text-xs font-medium uppercase tracking-wide text-neutral-400">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Monthly Value</th>
              <th className="px-5 py-3">Churn Score</th>
              <th className="px-5 py-3">Revenue at Risk</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Top Reason</th>
              <th className="px-5 py-3">Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((customer) => {
              const { reason } = getChurnReason(customer);
              const recommendation = getPlanRecommendation(customer);
              return (
                <tr
                  key={customer.id}
                  className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/60"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={customer.name} size="sm" />
                      <Link
                        href={`/customers/${customer.id}`}
                        className="font-medium text-white hover:text-sky-400 hover:underline"
                      >
                        {customer.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-400">{customer.planTier}</td>
                  <td className="px-5 py-3 text-neutral-400">
                    {formatCurrency(customer.monthlyValue)}
                  </td>
                  <td className="px-5 py-3 font-medium text-neutral-200 tabular-nums">
                    {customer.churnRisk}
                  </td>
                  <td className="px-5 py-3 font-medium text-neutral-200 tabular-nums">
                    {formatCurrency(getCustomerRevenueAtRisk(customer))}
                  </td>
                  <td className="px-5 py-3">
                    <RiskBadge category={customer.riskCategory} />
                  </td>
                  <td className="px-5 py-3 text-neutral-400">{reason}</td>
                  <td className="px-5 py-3">
                    <RecommendationBadge kind={recommendation.kind} />
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-neutral-400">
                  No at-risk or under-utilized customers right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
