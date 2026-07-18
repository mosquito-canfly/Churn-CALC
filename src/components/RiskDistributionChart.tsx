"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getRiskDistribution, type Customer } from "@/lib/mockData";

const COLORS: Record<string, string> = {
  Healthy: "#10b981",
  "Under-utilized": "#f59e0b",
  "At-risk": "#ef4444",
};

export default function RiskDistributionChart({ customers }: { customers: Customer[] }) {
  const data = getRiskDistribution(customers);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-medium text-neutral-500">Risk Distribution</h2>
      <div className="mt-2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={COLORS[entry.category]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e5e5e5",
                fontSize: 13,
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
