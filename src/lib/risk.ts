import type { RiskCategory } from "@/lib/mockData";

// Dark-theme badge convention: a near-black tinted background with a bright -400 step
// for text/bar/dot. text-{color}-400 against bg-{color}-950 measures 5.8:1+ (WCAG AA,
// verified for the red family; the amber/emerald families use the same light-on-dark
// relationship and clear it by an even wider margin).
export const riskColors: Record<
  RiskCategory,
  { text: string; bg: string; ring: string; bar: string; dot: string }
> = {
  Healthy: {
    text: "text-emerald-400",
    bg: "bg-emerald-950",
    ring: "ring-emerald-900",
    bar: "bg-emerald-400",
    dot: "bg-emerald-400",
  },
  "Under-utilized": {
    text: "text-amber-400",
    bg: "bg-amber-950",
    ring: "ring-amber-900",
    bar: "bg-amber-400",
    dot: "bg-amber-400",
  },
  "At-risk": {
    text: "text-red-400",
    bg: "bg-red-950",
    ring: "ring-red-900",
    bar: "bg-red-400",
    dot: "bg-red-400",
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
