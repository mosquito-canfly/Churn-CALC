import Link from "next/link";
import { getCustomerRevenueAtRisk, type Customer } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/risk";
import { getPlanRecommendation } from "@/lib/planRecommendation";
import RiskBadge from "@/components/RiskBadge";
import RiskScoreBar from "@/components/RiskScoreBar";
import RecommendationBadge from "@/components/RecommendationBadge";
import Avatar from "@/components/Avatar";

export default function CustomerTable({ customers }: { customers: Customer[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900 text-xs font-medium uppercase tracking-wide text-neutral-400">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Churn Score</th>
              <th className="px-5 py-3">Revenue at Risk</th>
              <th className="px-5 py-3">Last Active</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/60"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={customer.name} size="sm" />
                    <div>
                      <Link
                        href={`/customers/${customer.id}`}
                        className="font-medium text-white hover:text-sky-400 hover:underline"
                      >
                        {customer.name}
                      </Link>
                      <div className="text-xs text-neutral-400">{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-neutral-400">{customer.planTier}</td>
                <td className="px-5 py-3">
                  <RiskScoreBar score={customer.churnRisk} category={customer.riskCategory} />
                </td>
                <td className="px-5 py-3 font-medium text-neutral-200 tabular-nums">
                  {formatCurrency(getCustomerRevenueAtRisk(customer))}
                </td>
                <td className="px-5 py-3 text-neutral-400">{formatDate(customer.lastActive)}</td>
                <td className="px-5 py-3">
                  <RiskBadge category={customer.riskCategory} />
                </td>
                <td className="px-5 py-3">
                  <RecommendationBadge kind={getPlanRecommendation(customer).kind} />
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-neutral-400">
                  No customers match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
