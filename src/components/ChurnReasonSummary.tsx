import { getChurnReasonBreakdown } from "@/lib/churnReason";
import type { Customer } from "@/lib/mockData";
import SectionHeading from "@/components/SectionHeading";

// The app's accent color, used for chart highlights. Measures 7.3:1 against the dark
// card surface, well above the WCAG AA 3:1 minimum for non-text graphical elements.
const BAR_COLOR = "#0eb1ee";

export default function ChurnReasonSummary({ customers }: { customers: Customer[] }) {
  const data = getChurnReasonBreakdown(customers);
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const summary = data.map((d) => `${d.label}: ${d.count}`).join(", ");

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <SectionHeading
        title="What's driving churn"
        subtitle={`Top churn factor across ${total} at-risk and under-utilized customers.`}
      />

      {data.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-400">
          No at-risk or under-utilized customers right now.
        </p>
      ) : (
        // Plain labeled bars (no charting library) — avoids any tooltip/label overlap
        // risk entirely; the full breakdown is also given as one aria-label below.
        <div
          className="mt-5 space-y-5"
          role="img"
          aria-label={`Top churn reason among at-risk and under-utilized customers: ${summary}`}
        >
          {data.map((entry) => (
            <div key={entry.label}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-neutral-300">{entry.label}</span>
                <span className="font-semibold text-white tabular-nums">{entry.count}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(entry.count / maxCount) * 100}%`,
                    backgroundColor: BAR_COLOR,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
