import type { DraftMessageResult } from "@/lib/aiTypes";

export interface FallbackDraftInput {
  name: string;
  planTier: string;
  recommendedAction?: string;
  reason?: string;
}

/**
 * Deterministic, templated retention message — the fallback used when Gemini is
 * unavailable/rate-limited, and the only path used for batch drafting (no per-customer
 * live AI calls). `reason` is optional so the single-customer API route's existing
 * behavior (which doesn't have a churn-reason string on hand) is unchanged.
 */
export function buildFallbackDraftMessage({
  name,
  planTier,
  recommendedAction,
  reason,
}: FallbackDraftInput): DraftMessageResult {
  const firstName = name.split(" ")[0];
  const noticedClause = reason
    ? `We noticed ${reason}`
    : `We noticed you haven't been getting the most out of your ${planTier} plan lately`;

  return {
    subject: `Checking in, ${firstName}`,
    body: `Hi ${name},\n\n${noticedClause} and wanted to check in. If anything's been in the way, we're here to help.${
      recommendedAction ? ` ${recommendedAction}` : ""
    }\n\nLet us know how we can support you.\n\nBest,\nThe Team`,
  };
}
