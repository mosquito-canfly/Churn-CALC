import type { RecommendationKind } from "@/lib/planRecommendation";

const KIND_LABELS: Record<RecommendationKind, string> = {
  upsell: "Upsell",
  downgrade: "Downgrade",
  reengage: "Re-engage",
  retain: "Retain",
  monitor: "Monitor",
};

// A recommendation kind is a different question from a risk category (what to do,
// not how healthy the account is), so it deliberately avoids the emerald/amber/red
// hues riskColors owns in risk.ts — violet/indigo/rose/teal all clear ≥5:1 for
// text-400 on bg-950, matching the risk badges' own verified contrast.
const KIND_COLORS: Record<RecommendationKind, { bg: string; text: string; ring: string }> = {
  upsell: { bg: "bg-violet-950", text: "text-violet-400", ring: "ring-violet-900" },
  downgrade: { bg: "bg-indigo-950", text: "text-indigo-400", ring: "ring-indigo-900" },
  reengage: { bg: "bg-rose-950", text: "text-rose-400", ring: "ring-rose-900" },
  retain: { bg: "bg-teal-950", text: "text-teal-400", ring: "ring-teal-900" },
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
