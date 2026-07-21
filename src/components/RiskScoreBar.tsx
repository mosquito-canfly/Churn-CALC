import type { RiskCategory } from "@/lib/mockData";
import { riskColors } from "@/lib/risk";

export default function RiskScoreBar({
  score,
  category,
}: {
  score: number;
  category: RiskCategory;
}) {
  const colors = riskColors[category];
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-neutral-800" aria-hidden="true">
        <div
          className={`h-full rounded-full ${colors.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-medium text-neutral-200 tabular-nums">{score}</span>
    </div>
  );
}
