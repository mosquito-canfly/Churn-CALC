"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Customer } from "@/lib/mockData";
import { predictChurn } from "@/lib/mlService";
import { getChurnReason } from "@/lib/churnReason";

type FeedbackSentiment = "negative" | "neutral" | "positive";

// Canned ticket-style text pulled from the ML service's existing sentiment lookup
// (ml-service/artifacts/sentiment_map.json) — this reuses the SAME ticket_sentiment
// signal the model already derives from last_support_ticket. No new model feature, no
// change to the /predict contract, no ml-service change.
const FEEDBACK_TICKET_TEXT: Record<FeedbackSentiment, string> = {
  negative: "I'm very frustrated with the downtime. This is unacceptable.",
  neutral: "Just checking if my payment went through.",
  positive: "Customer support was super helpful yesterday. Thanks!",
};

const FEEDBACK_OPTIONS: FeedbackSentiment[] = ["negative", "neutral", "positive"];
const FEEDBACK_LABELS: Record<FeedbackSentiment, string> = {
  negative: "Negative",
  neutral: "Neutral",
  positive: "Positive",
};
const DEBOUNCE_MS = 300;

export default function CustomerFeedbackPanel({ customer }: { customer: Customer }) {
  const [selected, setSelected] = useState<FeedbackSentiment | null>(null);
  const [simulatedRisk, setSimulatedRisk] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) {
      setSimulatedRisk(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const [result] = await predictChurn([
          {
            customer_id: customer.id,
            account_age_days: customer.accountAgeDays,
            daily_usage_mins: customer.dailyUsageMins,
            login_frequency: customer.loginFrequency,
            last_support_ticket: FEEDBACK_TICKET_TEXT[selected],
            days_since_last_login: customer.daysSinceLastLogin,
            core_feature_usage_percentage: customer.coreFeatureUsagePercentage,
          },
        ]);
        if (cancelled) return;
        if (result) setSimulatedRisk(result.churn_risk);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to recompute risk.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [selected, customer]);

  const baselineRisk = customer.churnRisk;
  const delta = simulatedRisk === null ? null : simulatedRisk - baselineRisk;
  // Lets the same top-reason logic used everywhere else see this hypothetical ticket
  // text — it's the existing negative_ticket signal reacting to different input, not a
  // new factor stacked on top of it.
  const effectiveReason = selected
    ? getChurnReason({ ...customer, lastSupportTicket: FEEDBACK_TICKET_TEXT[selected] }).reason
    : null;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-neutral-800">Customer Feedback</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Record this customer&apos;s current satisfaction to see how it feeds the live churn
        model — the same way support-ticket sentiment already does. This is a session-only
        simulation: it isn&apos;t saved anywhere, and it doesn&apos;t retrain or otherwise
        improve the model.
      </p>

      <div
        role="group"
        aria-label="Customer feedback sentiment"
        className="mt-3 grid grid-cols-3 gap-1 rounded-lg bg-neutral-100 p-1"
      >
        {FEEDBACK_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={selected === option}
            onClick={() => setSelected((s) => (s === option ? null : option))}
            className={`rounded-md py-1.5 text-xs font-medium transition-colors ${
              selected === option
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {FEEDBACK_LABELS[option]}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-14" aria-live="polite" aria-atomic="true">
        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <Loader2 size={12} className="animate-spin" aria-hidden="true" />
            Recalculating...
          </div>
        )}
        {!loading && error && (
          <p role="alert" className="text-xs text-red-700">
            {error}
          </p>
        )}
        {!loading && !error && selected && simulatedRisk !== null && delta !== null && (
          <>
            <p className="text-sm text-neutral-700">
              Baseline {baselineRisk} → with {FEEDBACK_LABELS[selected].toLowerCase()} feedback,{" "}
              <span className="font-semibold text-neutral-900">{simulatedRisk}</span>{" "}
              <span
                className={
                  delta < 0
                    ? "font-medium text-emerald-700"
                    : delta > 0
                      ? "font-medium text-red-700"
                      : "font-medium text-neutral-600"
                }
              >
                ({delta > 0 ? "+" : ""}
                {delta})
              </span>
            </p>
            {effectiveReason && (
              <p className="mt-1 text-xs text-neutral-600">Top reason: {effectiveReason}</p>
            )}
          </>
        )}
        {!loading && !error && selected === null && (
          <p className="text-xs text-neutral-500">
            Select a sentiment to see its effect on the live score.
          </p>
        )}
      </div>
    </div>
  );
}
