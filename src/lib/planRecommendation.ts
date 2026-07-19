import type { Customer, PlanTier } from "@/lib/mockData";

export type RecommendationKind = "upsell" | "downgrade" | "reengage" | "retain" | "monitor";

export interface PlanRecommendation {
  action: string;
  rationale: string;
  kind: RecommendationKind;
}

export type RecommendationInput = Pick<
  Customer,
  "planTier" | "riskCategory" | "loginFrequency" | "daysSinceLastLogin" | "coreFeatureUsagePercentage"
>;

// Thresholds are tuned against the mock dataset's spread of usage%/staleness values.
const HIGH_USAGE_PCT = 70;
const LOW_USAGE_PCT = 30;
const RECENTLY_ACTIVE_DAYS = 3;
const STALE_DAYS = 14;

const NEXT_TIER: Record<PlanTier, PlanTier | null> = {
  Basic: "Pro",
  Pro: "Enterprise",
  Enterprise: null,
};

function isDisengaged(input: RecommendationInput): boolean {
  return (
    input.loginFrequency === "Rarely" ||
    input.daysSinceLastLogin >= STALE_DAYS ||
    input.coreFeatureUsagePercentage < LOW_USAGE_PCT
  );
}

function isHighlyEngaged(input: RecommendationInput): boolean {
  const highUsage = input.coreFeatureUsagePercentage >= HIGH_USAGE_PCT;
  const frequentLogin = input.loginFrequency === "Daily";
  const recentlyActive = input.daysSinceLastLogin <= RECENTLY_ACTIVE_DAYS;
  return (highUsage || frequentLogin) && recentlyActive;
}

/**
 * Deterministic, rules-based retention recommendation layered on top of the model's
 * score/category plus the customer's plan and engagement fields. The churn model has
 * no pricing or plan signal — it never picks a plan; this is a fixed business-rules
 * heuristic that runs entirely locally (no network call), so it still produces a real
 * recommendation when the AI explanation service is unreachable.
 */
export function getPlanRecommendation(input: RecommendationInput): PlanRecommendation {
  const { planTier, riskCategory, loginFrequency, daysSinceLastLogin, coreFeatureUsagePercentage } = input;
  const usagePct = Math.round(coreFeatureUsagePercentage);

  if (riskCategory === "At-risk") {
    if (isDisengaged(input)) {
      return {
        kind: "reengage",
        action: "Re-engagement outreach",
        rationale: `${daysSinceLastLogin} days since last login and ${usagePct}% feature usage on a ${planTier} plan — reach out before they churn.`,
      };
    }
    return {
      kind: "retain",
      action: "Retention check-in",
      rationale: `Still logging in ${loginFrequency.toLowerCase()} with ${usagePct}% feature usage despite being flagged at-risk — a proactive check-in or offer can address the underlying issue.`,
    };
  }

  if (riskCategory === "Under-utilized" && planTier !== "Basic") {
    const targetTier = planTier === "Enterprise" ? "Pro" : "Basic";
    return {
      kind: "downgrade",
      action: `Downgrade to ${targetTier} to retain`,
      rationale: `${usagePct}% feature usage on a ${planTier} plan — right-size the plan so cost doesn't drive them to cancel.`,
    };
  }

  const nextTier = NEXT_TIER[planTier];
  if (nextTier && isHighlyEngaged(input)) {
    return {
      kind: "upsell",
      action: `Upsell to ${nextTier}`,
      rationale: `${usagePct}% feature usage with ${loginFrequency.toLowerCase()} logins on a ${planTier} plan — they're getting full value and may be ready for more.`,
    };
  }

  return {
    kind: "monitor",
    action: "Monitor",
    rationale: `No urgent signal — ${usagePct}% feature usage on a ${planTier} plan is within the expected range.`,
  };
}
