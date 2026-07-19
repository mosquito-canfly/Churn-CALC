import type { RiskCategory } from "@/lib/mockData";

// bar/dot use a darker shade than the base 500-weight hue so these small graphical
// indicators meet WCAG AA non-text contrast (3:1+) against their light backgrounds.
export const riskColors: Record<
  RiskCategory,
  { text: string; bg: string; ring: string; bar: string; dot: string }
> = {
  Healthy: {
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    bar: "bg-emerald-700",
    dot: "bg-emerald-700",
  },
  "Under-utilized": {
    text: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    bar: "bg-amber-700",
    dot: "bg-amber-700",
  },
  "At-risk": {
    text: "text-red-700",
    bg: "bg-red-50",
    ring: "ring-red-200",
    bar: "bg-red-700",
    dot: "bg-red-700",
  },
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
