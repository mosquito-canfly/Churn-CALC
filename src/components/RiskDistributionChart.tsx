"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getRiskDistribution, type Customer } from "@/lib/mockData";
import SectionHeading from "@/components/SectionHeading";

// Bright -400 steps so each slice meets WCAG AA (3:1+) non-text contrast against the
// card's dark surface, matching the riskColors palette used for badges/bars elsewhere.
const COLORS: Record<string, string> = {
  Healthy: "#34d399",
  "Under-utilized": "#fbbf24",
  "At-risk": "#f87171",
};

export default function RiskDistributionChart({ customers }: { customers: Customer[] }) {
  const data = getRiskDistribution(customers);
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const summary = data.map((d) => `${d.category}: ${d.count}`).join(", ");

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <SectionHeading title="Risk distribution" subtitle="How your base breaks down by health." />
      <div
        className="mt-4 flex flex-col items-center justify-center gap-8 sm:flex-row"
        role="img"
        aria-label={`Risk distribution by category: ${summary}`}
      >
        <div className="relative h-44 w-44 shrink-0">
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold text-white">{total}</span>
            <span className="text-xs text-neutral-400">customers</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="category"
                innerRadius="68%"
                outerRadius="100%"
                paddingAngle={3}
                isAnimationActive={false}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.category} fill={COLORS[entry.category]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #404040",
                  background: "#262626",
                  fontSize: 13,
                  color: "#fafafa",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="w-full max-w-[220px] space-y-3">
          {data.map((entry) => (
            <li key={entry.category} className="flex items-center gap-3 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[entry.category] }}
                aria-hidden="true"
              />
              <span className="text-neutral-300">{entry.category}</span>
              <span className="ml-auto font-semibold text-white tabular-nums">{entry.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
