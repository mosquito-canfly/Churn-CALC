import type { RiskCategory } from "@/lib/mockData";
import { riskColors } from "@/lib/risk";

export default function RiskBadge({ category }: { category: RiskCategory }) {
  const colors = riskColors[category];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colors.bg} ${colors.text} ${colors.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} aria-hidden="true" />
      {category}
    </span>
  );
}
