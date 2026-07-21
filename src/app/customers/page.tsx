"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Search } from "lucide-react";
import { type Customer, type PlanTier, type RiskCategory } from "@/lib/mockData";
import { useCustomersWithRisk } from "@/lib/useCustomersWithRisk";
import { formatDate } from "@/lib/risk";
import { getPlanRecommendation } from "@/lib/planRecommendation";
import RiskBadge from "@/components/RiskBadge";
import RiskScoreBar from "@/components/RiskScoreBar";
import RecommendationBadge from "@/components/RecommendationBadge";
import Avatar from "@/components/Avatar";

const categoryFilters: (RiskCategory | "All")[] = ["All", "Healthy", "Under-utilized", "At-risk"];

const PLAN_TIER_RANK: Record<PlanTier, number> = { Basic: 0, Pro: 1, Enterprise: 2 };

interface SortOption {
  value: string;
  label: string;
  compare: (a: Customer, b: Customer) => number;
}

const SORT_OPTIONS: SortOption[] = [
  { value: "churn-desc", label: "Churn Score (high → low)", compare: (a, b) => b.churnRisk - a.churnRisk },
  { value: "churn-asc", label: "Churn Score (low → high)", compare: (a, b) => a.churnRisk - b.churnRisk },
  {
    value: "plan-desc",
    label: "Plan tier (high → low)",
    compare: (a, b) => PLAN_TIER_RANK[b.planTier] - PLAN_TIER_RANK[a.planTier],
  },
  {
    value: "plan-asc",
    label: "Plan tier (low → high)",
    compare: (a, b) => PLAN_TIER_RANK[a.planTier] - PLAN_TIER_RANK[b.planTier],
  },
  {
    value: "active-newest",
    label: "Last active (newest)",
    compare: (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime(),
  },
  {
    value: "active-oldest",
    label: "Last active (oldest)",
    compare: (a, b) => new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime(),
  },
];

export default function CustomersPage() {
  const { customers, error } = useCustomersWithRisk();
  const [categoryFilter, setCategoryFilter] = useState<RiskCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState(SORT_OPTIONS[0].value);

  const filteredAndSorted = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = customers.filter((c) => {
      const matchesCategory = categoryFilter === "All" || c.riskCategory === categoryFilter;
      const matchesQuery =
        query === "" ||
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    const sortOption = SORT_OPTIONS.find((o) => o.value === sortValue) ?? SORT_OPTIONS[0];
    return [...filtered].sort(sortOption.compare);
  }, [customers, categoryFilter, searchQuery, sortValue]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Customers</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {filteredAndSorted.length} of {customers.length} customers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              aria-label="Search customers by name or email"
              className="w-64 rounded-lg border border-neutral-800 bg-neutral-900 py-2 pl-9 pr-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none"
            />
          </div>

          <div className="relative">
            <ArrowUpDown
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500"
              aria-hidden="true"
            />
            <select
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
              aria-label="Sort customers"
              className="appearance-none rounded-lg border border-neutral-800 bg-neutral-900 py-2 pr-3 pl-9 text-sm font-medium text-white focus:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-amber-900 bg-amber-950 px-4 py-2 text-sm text-amber-300">
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
                ? "bg-white text-neutral-900"
                : "bg-neutral-900 text-neutral-400 ring-1 ring-inset ring-neutral-800 hover:bg-neutral-800"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900 text-xs font-medium uppercase tracking-wide text-neutral-400">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Plan Tier</th>
                <th className="px-5 py-3">Churn Score</th>
                <th className="px-5 py-3">Last Active</th>
                <th className="px-5 py-3">Risk Category</th>
                <th className="px-5 py-3">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((customer) => (
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
                  <td className="px-5 py-3 text-neutral-400">{formatDate(customer.lastActive)}</td>
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
