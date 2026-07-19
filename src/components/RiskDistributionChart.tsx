"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getRiskDistribution, type Customer } from "@/lib/mockData";

// Darker shades than the base risk palette so each slice meets WCAG AA (3:1+) non-text
// contrast against the card's white background, rather than the lighter 500-weight hues.
const COLORS: Record<string, string> = {
  Healthy: "#047857",
  "Under-utilized": "#b45309",
  "At-risk": "#b91c1c",
};

const RADIAN = Math.PI / 180;
// Fixed pixel offset (not a percentage) beyond the slice's outer edge, so the label sits
// just outside the ring regardless of how small the ring gets at narrow container widths.
const LABEL_OFFSET = 18;

interface SliceLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  name?: string;
  value?: number;
}

// Custom, two-line, center-anchored label so long category names ("Under-utilized")
// stay inside the chart's own SVG bounds at any container width — the default
// single-line "Category: Count" label with a leader line can run past the edge of a
// narrow card and get clipped by the SVG's own overflow.
function renderSliceLabel({ cx = 0, cy = 0, midAngle = 0, outerRadius = 0, name, value }: SliceLabelProps) {
  const radius = outerRadius + LABEL_OFFSET;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={11} fill="#404040">
      <tspan x={x} dy="-0.6em">
        {name}
      </tspan>
      <tspan x={x} dy="1.2em" fontWeight={600}>
        {value}
      </tspan>
    </text>
  );
}

export default function RiskDistributionChart({ customers }: { customers: Customer[] }) {
  const data = getRiskDistribution(customers);
  const summary = data.map((d) => `${d.category}: ${d.count}`).join(", ");

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-medium text-neutral-500">Risk Distribution</h2>
      <div
        className="mt-2 h-96"
        role="img"
        aria-label={`Risk distribution by category: ${summary}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 36, right: 40, bottom: 8, left: 40 }}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              innerRadius="48%"
              outerRadius="64%"
              paddingAngle={3}
              isAnimationActive={false}
              label={renderSliceLabel}
              labelLine={false}
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
