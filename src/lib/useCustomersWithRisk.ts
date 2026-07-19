"use client";

import { useEffect, useState } from "react";
import { customers as mockCustomers, type Customer } from "@/lib/mockData";
import { predictChurn } from "@/lib/mlService";

export function useCustomersWithRisk() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRisk() {
      try {
        const predictions = await predictChurn(
          mockCustomers.map((c) => ({
            customer_id: c.id,
            account_age_days: c.accountAgeDays,
            daily_usage_mins: c.dailyUsageMins,
            login_frequency: c.loginFrequency,
            last_support_ticket: c.lastSupportTicket,
            days_since_last_login: c.daysSinceLastLogin,
            core_feature_usage_percentage: c.coreFeatureUsagePercentage,
          }))
        );
        if (cancelled) return;

        const predictionById = new Map(predictions.map((p) => [p.customer_id, p]));
        setCustomers(
          mockCustomers.map((c) => {
            const prediction = predictionById.get(c.id);
            return prediction
              ? { ...c, churnRisk: prediction.churn_risk, riskCategory: prediction.risk_category }
              : c;
          })
        );
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load churn predictions.");
      }
    }

    loadRisk();
    return () => {
      cancelled = true;
    };
  }, []);

  return { customers, error };
}
