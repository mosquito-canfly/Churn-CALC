"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { type RiskCategory } from "@/lib/mockData";
import { useCustomersWithRisk } from "@/lib/useCustomersWithRisk";
import { formatDate } from "@/lib/risk";
import { getPlanRecommendation } from "@/lib/planRecommendation";
import RiskBadge from "@/components/RiskBadge";
import RiskScoreBar from "@/components/RiskScoreBar";
import RecommendationBadge from "@/components/RecommendationBadge";

type SortKey = "churnRisk" | "lastActive";
type SortDirection = "asc" | "desc";

const categoryFilters: (RiskCategory | "All")[] = ["All", "Healthy", "Under-utilized", "At-risk"];

export default function CustomersPage() {
  const { customers, error } = useCustomersWithRisk();
  const [categoryFilter, setCategoryFilter] = useState<RiskCategory | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("churnRisk");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  }

  const filteredAndSorted = useMemo(() => {
    const filtered =
      categoryFilter === "All"
        ? customers
        : customers.filter((c) => c.riskCategory === categoryFilter);

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortKey === "churnRisk") {
        comparison = a.churnRisk - b.churnRisk;
      } else {
        comparison = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [customers, categoryFilter, sortKey, sortDirection]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Customers</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {filteredAndSorted.length} of {customers.length} customers
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          {error} Showing cached risk scores instead.
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {categoryFilters.map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              categoryFilter === category
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-600 ring-1 ring-inset ring-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-medium uppercase tracking-wide text-neutral-500">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Plan Tier</th>
                <th className="px-5 py-3">
                  <button
                    onClick={() => toggleSort("churnRisk")}
                    className="flex items-center gap-1 hover:text-neutral-700"
                  >
                    Risk Score
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-5 py-3">
                  <button
                    onClick={() => toggleSort("lastActive")}
                    className="flex items-center gap-1 hover:text-neutral-700"
                  >
                    Last Active
                    <ArrowUpDown size={12} />
                  </button>
                </th>
                <th className="px-5 py-3">Risk Category</th>
                <th className="px-5 py-3">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((customer) => (
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
              {filteredAndSorted.length === 0 && (
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
    </div>
  );
}
