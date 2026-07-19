import type { RecommendationKind } from "@/lib/planRecommendation";

const KIND_LABELS: Record<RecommendationKind, string> = {
  upsell: "Upsell",
  downgrade: "Downgrade",
  reengage: "Re-engage",
  retain: "Retain",
  monitor: "Monitor",
};

const KIND_COLORS: Record<RecommendationKind, { bg: string; text: string; ring: string }> = {
  upsell: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200" },
  downgrade: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
  reengage: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" },
  retain: { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200" },
  monitor: { bg: "bg-neutral-100", text: "text-neutral-500", ring: "ring-neutral-200" },
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
