import type { RecommendationKind } from "@/lib/planRecommendation";

const KIND_LABELS: Record<RecommendationKind, string> = {
  upsell: "Upsell",
  downgrade: "Downgrade",
  reengage: "Re-engage",
  retain: "Retain",
  monitor: "Monitor",
};

const KIND_COLORS: Record<RecommendationKind, { bg: string; text: string; ring: string }> = {
  upsell: { bg: "bg-blue-950", text: "text-blue-400", ring: "ring-blue-900" },
  downgrade: { bg: "bg-amber-950", text: "text-amber-400", ring: "ring-amber-900" },
  reengage: { bg: "bg-red-950", text: "text-red-400", ring: "ring-red-900" },
  retain: { bg: "bg-orange-950", text: "text-orange-400", ring: "ring-orange-900" },
  monitor: { bg: "bg-neutral-800", text: "text-neutral-400", ring: "ring-neutral-700" },
};

export default function RecommendationBadge({ kind }: { kind: RecommendationKind }) {
  const colors = KIND_COLORS[kind];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colors.bg} ${colors.text} ${colors.ring}`}
    >
      {KIND_LABELS[kind]}
    </span>
  );
}
