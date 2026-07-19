/**
 * Mirrors ml-service/feature_schema.py — the backend's single source of truth for the
 * churn model's feature set (see ml-service/artifacts/v2/feature_config.json). Field
 * names and ranges here must match it exactly; this file transcribes the backend
 * contract rather than defining its own. Update both together.
 */
import type { LoginFrequency } from "@/lib/mockData";

export interface FeatureRange {
  min: number;
  max: number;
  whatifDefault: number | null;
}

export const FEATURE_RANGES = {
  account_age_days: { min: 0, max: 3650, whatifDefault: null },
  daily_usage_mins: { min: 0, max: 1440, whatifDefault: 0 },
  days_since_last_login: { min: 0, max: 3650, whatifDefault: 0 },
  core_feature_usage_percentage: { min: 0, max: 100, whatifDefault: 100 },
} as const satisfies Record<string, FeatureRange>;

export const LOGIN_FREQ_ENCODING: Record<LoginFrequency, number> = {
  Rarely: 0,
  Weekly: 1,
  Daily: 2,
};
