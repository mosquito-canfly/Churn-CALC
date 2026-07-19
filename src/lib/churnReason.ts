import type { Customer } from "@/lib/mockData";

export type ChurnFactor = "stale_login" | "low_usage" | "rare_login" | "negative_ticket" | "none";

export interface ChurnReason {
  reason: string;
  factor: ChurnFactor;
}

// Below this, staleness isn't yet a meaningful signal; at/above the max it's maximally severe.
const STALE_MIN_DAYS = 7;
const STALE_MAX_DAYS = 90;

// Below this usage percentage, low engagement becomes a signal worth surfacing.
const LOW_USAGE_THRESHOLD = 30;

// Fixed severities (0-100) for signals that aren't naturally continuous.
const RARE_LOGIN_SEVERITY = 40;
const NEGATIVE_TICKET_SEVERITY = 55;

// Simple, local keyword read of the ticket text — not a sentiment model, just enough
// to flag a support contact that's plausibly a churn signal without any network call.
const NEGATIVE_TICKET_KEYWORDS = [
  "unresolved",
  "frustrat",
  "complain",
  "cancel",
  "refund",
  "confus",
  "crash",
  "bug",
  "waiting",
  "unacceptable",
  "angry",
  "disappoint",
  "competitor",
  "missing data",
  "blocked",
  "broken",
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function article(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function hasNegativeTicketSignal(ticket: string): boolean {
  const text = ticket.toLowerCase();
  return NEGATIVE_TICKET_KEYWORDS.some((keyword) => text.includes(keyword));
}

interface Candidate {
  factor: ChurnFactor;
  severity: number;
  reason: string;
}

/**
 * Deterministic, locally-computed "top risk factor" for a customer — a short, always
 * available structured reason (distinct from Gemini's free-text explanation) picked by
 * scoring each engagement/usage/ticket signal for severity and returning the strongest
 * one. No network call, so it renders even when the AI explanation service is down.
 */
export function getChurnReason(customer: Customer): ChurnReason {
  const usagePct = Math.round(customer.coreFeatureUsagePercentage);

  const staleSeverity = clamp(
    ((customer.daysSinceLastLogin - STALE_MIN_DAYS) / (STALE_MAX_DAYS - STALE_MIN_DAYS)) * 100,
    0,
    100
  );

  const usageSeverity =
    customer.coreFeatureUsagePercentage >= LOW_USAGE_THRESHOLD
      ? 0
      : ((LOW_USAGE_THRESHOLD - customer.coreFeatureUsagePercentage) / LOW_USAGE_THRESHOLD) * 100;

  const loginSeverity = customer.loginFrequency === "Rarely" ? RARE_LOGIN_SEVERITY : 0;

  const ticketSeverity = hasNegativeTicketSignal(customer.lastSupportTicket)
    ? NEGATIVE_TICKET_SEVERITY
    : 0;

  // Order also breaks ties: staleness (hardest data) outranks the ticket-text heuristic
  // (fuzziest signal) when severities happen to match exactly.
  const candidates: Candidate[] = [
    {
      factor: "stale_login",
      severity: staleSeverity,
      reason: `${customer.daysSinceLastLogin} days since last login`,
    },
    {
      factor: "low_usage",
      severity: usageSeverity,
      reason: `${usagePct}% feature usage on ${article(customer.planTier)} ${customer.planTier} plan`,
    },
    {
      factor: "rare_login",
      severity: loginSeverity,
      reason: "rarely logs in",
    },
    {
      factor: "negative_ticket",
      severity: ticketSeverity,
      reason: "unresolved support ticket",
    },
  ];

  const top = candidates.reduce((best, candidate) => (candidate.severity > best.severity ? candidate : best));

  if (top.severity <= 0) {
    return { reason: "No significant risk signal — engagement looks healthy.", factor: "none" };
  }

  return { reason: top.reason, factor: top.factor };
}
