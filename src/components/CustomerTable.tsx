import Link from "next/link";
import type { Customer } from "@/lib/mockData";
import { formatDate } from "@/lib/risk";
import { getPlanRecommendation } from "@/lib/planRecommendation";
import RiskBadge from "@/components/RiskBadge";
import RiskScoreBar from "@/components/RiskScoreBar";
import RecommendationBadge from "@/components/RecommendationBadge";

export default function CustomerTable({ customers }: { customers: Customer[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-medium uppercase tracking-wide text-neutral-500">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Risk Score</th>
              <th className="px-5 py-3">Last Active</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="font-medium text-neutral-900 hover:underline"
                  >
                    {customer.name}
                  </Link>
                  <div className="text-xs text-neutral-400">{customer.email}</div>
                </td>
                <td className="px-5 py-3 text-neutral-600">{customer.planTier}</td>
                <td className="px-5 py-3">
                  <RiskScoreBar score={customer.churnRisk} category={customer.riskCategory} />
                </td>
                <td className="px-5 py-3 text-neutral-600">{formatDate(customer.lastActive)}</td>
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
                <td colSpan={6} className="px-5 py-10 text-center text-neutral-400">
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
