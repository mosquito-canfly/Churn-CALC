"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ILLUSTRATIVE_NET_SUBSCRIBERS_SAMPLE } from "@/lib/sampleTrendData";
import { getTotalCustomers, type Customer } from "@/lib/mockData";
import SectionHeading from "@/components/SectionHeading";

// Same semantic hexes used for "Healthy" and "At-risk" everywhere else in the app
// (RiskDistributionChart, RiskWhatIfPanel) — green for growth, red for decline.
const GROWTH_COLOR = "#34d399";
const DECLINE_COLOR = "#f87171";
const CHART_HEIGHT = 220;

function formatNet(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

export default function NetSubscribersChart({ customers }: { customers: Customer[] }) {
  const data = ILLUSTRATIVE_NET_SUBSCRIBERS_SAMPLE;
  const summary = data.map((d) => `${d.month}: ${formatNet(d.net)}`).join(", ");

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <SectionHeading
        title="Net Subscribers by Month"
        subtitle="New signups minus churn over the trailing 12 months."
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300">
            <span className="text-neutral-400">Now</span> {getTotalCustomers(customers)} active
          </span>
        }
      />

      <div
        className="mt-3"
        style={{ height: CHART_HEIGHT }}
        role="img"
        aria-label={`Net subscribers by month: ${summary}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 8, bottom: 4, left: 8 }} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
            <XAxis dataKey="shortMonth" tick={{ fontSize: 12, fill: "#a3a3a3" }} interval={0} />
            <YAxis tick={{ fontSize: 12, fill: "#a3a3a3" }} allowDecimals={false} />
            <Tooltip
              cursor={false}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #404040",
                background: "#262626",
                fontSize: 13,
                color: "#fafafa",
              }}
              labelStyle={{ color: "#fafafa" }}
              itemStyle={{ color: "#fafafa" }}
            />
            <Bar dataKey="net" isAnimationActive={false} radius={[3, 3, 0, 0]} maxBarSize={28}>
              {data.map((entry) => (
                <Cell key={entry.month} fill={entry.net >= 0 ? GROWTH_COLOR : DECLINE_COLOR} />
              ))}
              <LabelList
                dataKey="net"
                position="top"
                formatter={(value: unknown) => formatNet(value as number)}
                fontSize={11}
                fill="#fafafa"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GROWTH_COLOR }} aria-hidden="true" />
          Net growth month
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DECLINE_COLOR }} aria-hidden="true" />
          Net decline month
        </span>
      </div>
    </div>
  );
}
