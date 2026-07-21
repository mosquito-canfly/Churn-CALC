import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "neutral" | "danger";
}

export default function MetricCard({ label, value, icon: Icon, tone = "neutral" }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-400">{label}</span>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            tone === "danger" ? "bg-red-950 text-red-400" : "bg-neutral-800 text-neutral-400"
          }`}
        >
          <Icon size={16} aria-hidden="true" />
        </span>
      </div>
      <div
        className={`mt-3 text-2xl font-semibold tracking-tight ${
          tone === "danger" ? "text-red-400" : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
