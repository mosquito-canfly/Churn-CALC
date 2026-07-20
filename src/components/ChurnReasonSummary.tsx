"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getChurnReasonBreakdown } from "@/lib/churnReason";
import type { Customer } from "@/lib/mockData";

// Blue-700 — meets WCAG AA (3:1+) non-text contrast against the card's white background,
// same standard applied to the risk-category colors elsewhere.
const BAR_COLOR = "#1d4ed8";
const ROW_HEIGHT = 44;

export default function ChurnReasonSummary({ customers }: { customers: Customer[] }) {
  const data = getChurnReasonBreakdown(customers);
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const summary = data.map((d) => `${d.label}: ${d.count}`).join(", ");

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-medium text-neutral-500">What&apos;s Driving Churn</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Top churn factor across {total} at-risk and under-utilized customers.
      </p>

      {data.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-600">
          No at-risk or under-utilized customers right now.
        </p>
      ) : (
        <div
          className="mt-4"
          style={{ height: Math.max(data.length * ROW_HEIGHT, 120) }}
          role="img"
          aria-label={`Top churn reason among at-risk and under-utilized customers: ${summary}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#525252" }} />
              <YAxis
                type="category"
                dataKey="label"
                width={180}
                tick={{ fontSize: 12, fill: "#404040" }}
              />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 13 }} />
              <Bar dataKey="count" fill={BAR_COLOR} isAnimationActive={false} barSize={20}>
                <LabelList dataKey="count" position="right" fontSize={12} fill="#171717" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
