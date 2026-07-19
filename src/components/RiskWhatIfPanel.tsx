"use client";

import { useEffect, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import type { Customer, LoginFrequency, RiskCategory } from "@/lib/mockData";
import { riskColors } from "@/lib/risk";
import { predictChurn } from "@/lib/mlService";
import { FEATURE_RANGES } from "@/lib/featureSchema";

function categoryForScore(score: number): RiskCategory {
  if (score >= 65) return "At-risk";
  if (score >= 35) return "Under-utilized";
  return "Healthy";
}

const RING_COLOR: Record<RiskCategory, string> = {
  Healthy: "#10b981",
  "Under-utilized": "#f59e0b",
  "At-risk": "#ef4444",
};

const LOGIN_FREQUENCIES: LoginFrequency[] = ["Rarely", "Weekly", "Daily"];
const RESOLVED_TICKET_TEXT = "Thanks, my issue was resolved.";
const DEBOUNCE_MS = 300;
// Slider caps a practical, human-relevant window; the backend accepts a wider range.
const DAYS_SINCE_LOGIN_SLIDER_MAX = 90;
const USAGE_PCT_MIN = FEATURE_RANGES.core_feature_usage_percentage.min;
const USAGE_PCT_MAX = FEATURE_RANGES.core_feature_usage_percentage.max;

export default function RiskWhatIfPanel({ customer }: { customer: Customer }) {
  const baselineRisk = customer.churnRisk;

  const [dailyUsageMins, setDailyUsageMins] = useState(customer.dailyUsageMins);
  const [loginFrequency, setLoginFrequency] = useState<LoginFrequency>(customer.loginFrequency);
  const [resolveTicket, setResolveTicket] = useState(false);
  const [daysSinceLastLogin, setDaysSinceLastLogin] = useState(customer.daysSinceLastLogin);
  const [coreFeatureUsagePercentage, setCoreFeatureUsagePercentage] = useState(
    customer.coreFeatureUsagePercentage
  );

  const [simulatedRisk, setSimulatedRisk] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty =
    dailyUsageMins !== customer.dailyUsageMins ||
    loginFrequency !== customer.loginFrequency ||
    resolveTicket ||
    daysSinceLastLogin !== customer.daysSinceLastLogin ||
    coreFeatureUsagePercentage !== customer.coreFeatureUsagePercentage;

  useEffect(() => {
    if (!isDirty) {
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
            daily_usage_mins: dailyUsageMins,
            login_frequency: loginFrequency,
            last_support_ticket: resolveTicket ? RESOLVED_TICKET_TEXT : customer.lastSupportTicket,
            days_since_last_login: daysSinceLastLogin,
            core_feature_usage_percentage: coreFeatureUsagePercentage,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDirty,
    dailyUsageMins,
    loginFrequency,
    resolveTicket,
    daysSinceLastLogin,
    coreFeatureUsagePercentage,
    customer.id,
    customer.accountAgeDays,
    customer.lastSupportTicket,
  ]);

  function handleReset() {
    setDailyUsageMins(customer.dailyUsageMins);
    setLoginFrequency(customer.loginFrequency);
    setResolveTicket(false);
    setDaysSinceLastLogin(customer.daysSinceLastLogin);
    setCoreFeatureUsagePercentage(customer.coreFeatureUsagePercentage);
  }

  const displayedRisk = simulatedRisk ?? baselineRisk;
  const delta = displayedRisk - baselineRisk;
  const category = categoryForScore(displayedRisk);
  const colors = riskColors[category];

  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - displayedRisk / 100);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-500">Churn Risk Score</h2>
        {isDirty && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-neutral-700"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#f0f0f0" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={RING_COLOR[category]}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tracking-tight text-neutral-900">
              {displayedRisk}
            </span>
            <span className="text-xs text-neutral-400">/ 100</span>
          </div>
        </div>
        <span
          className={`mt-3 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colors.bg} ${colors.text} ${colors.ring}`}
        >
          {category}
        </span>

        <p className="mt-3 text-xs text-neutral-500">
          Baseline {baselineRisk} → {displayedRisk},{" "}
          <span
            className={
              delta < 0
                ? "font-medium text-emerald-600"
                : delta > 0
                  ? "font-medium text-red-600"
                  : "font-medium text-neutral-500"
            }
          >
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
        </p>

        {loading && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400">
            <Loader2 size={12} className="animate-spin" />
            Recalculating...
          </div>
        )}
        {!loading && error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>

      <div className="mt-6 space-y-5 border-t border-neutral-100 pt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          What-if simulator
        </p>

        <div>
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="usage-slider" className="text-neutral-600">
              Daily usage
            </label>
            <span className="font-medium text-neutral-800">{dailyUsageMins} min</span>
          </div>
          <input
            id="usage-slider"
            type="range"
            min={0}
            max={120}
            step={1}
            value={dailyUsageMins}
            onChange={(e) => setDailyUsageMins(Number(e.target.value))}
            className="mt-2 w-full accent-neutral-900"
          />
        </div>

        <div>
          <div className="text-sm text-neutral-600">Login frequency</div>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-neutral-100 p-1">
            {LOGIN_FREQUENCIES.map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => setLoginFrequency(freq)}
                className={`rounded-md py-1.5 text-xs font-medium transition-colors ${
                  loginFrequency === freq
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="days-since-login-slider" className="text-neutral-600">
              Days since last login
            </label>
            <span className="font-medium text-neutral-800">{daysSinceLastLogin}d</span>
          </div>
          <input
            id="days-since-login-slider"
            type="range"
            min={0}
            max={DAYS_SINCE_LOGIN_SLIDER_MAX}
            step={1}
            value={daysSinceLastLogin}
            onChange={(e) => setDaysSinceLastLogin(Number(e.target.value))}
            className="mt-2 w-full accent-neutral-900"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="usage-pct-slider" className="text-neutral-600">
              Core feature usage
            </label>
            <span className="font-medium text-neutral-800">{coreFeatureUsagePercentage}%</span>
          </div>
          <input
            id="usage-pct-slider"
            type="range"
            min={USAGE_PCT_MIN}
            max={USAGE_PCT_MAX}
            step={1}
            value={coreFeatureUsagePercentage}
            onChange={(e) => setCoreFeatureUsagePercentage(Number(e.target.value))}
            className="mt-2 w-full accent-neutral-900"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Resolve support ticket</span>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium ${
                resolveTicket ? "text-emerald-600" : "text-neutral-400"
              }`}
            >
              {resolveTicket ? "Resolved" : "Unresolved"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={resolveTicket}
              aria-label="Resolve support ticket"
              onClick={() => setResolveTicket((v) => !v)}
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                resolveTicket ? "bg-emerald-500" : "bg-neutral-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  resolveTicket ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-neutral-400">
          Adjust the inputs above to re-run the churn model with hypothetical values and see how
          the risk score responds.
        </p>
      </div>
    </div>
  );
}
