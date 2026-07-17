import type { RiskCategory } from "@/lib/mockData";

export const riskColors: Record<
  RiskCategory,
  { text: string; bg: string; ring: string; bar: string; dot: string }
> = {
  Healthy: {
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
  },
  "Under-utilized": {
    text: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    bar: "bg-amber-500",
    dot: "bg-amber-500",
  },
  "At-risk": {
    text: "text-red-700",
    bg: "bg-red-50",
    ring: "ring-red-200",
    bar: "bg-red-500",
    dot: "bg-red-500",
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
