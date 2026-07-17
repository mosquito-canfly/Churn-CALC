import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "neutral" | "danger";
}

export default function MetricCard({ label, value, icon: Icon, tone = "neutral" }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500">{label}</span>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            tone === "danger" ? "bg-red-50 text-red-600" : "bg-neutral-100 text-neutral-600"
          }`}
        >
          <Icon size={16} />
        </span>
      </div>
      <div
        className={`mt-3 text-2xl font-semibold tracking-tight ${
          tone === "danger" ? "text-red-600" : "text-neutral-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
