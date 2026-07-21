"use client";

import { useEffect, useState } from "react";
import { Sparkles, Target, Loader2, AlertTriangle } from "lucide-react";
import type { Customer, RiskCategory } from "@/lib/mockData";
import { predictChurn } from "@/lib/mlService";
import type { AICustomerContext, ExplainResult } from "@/lib/aiTypes";
import { getPlanRecommendation } from "@/lib/planRecommendation";
import { getChurnReason } from "@/lib/churnReason";
import { formatCurrency, formatDate } from "@/lib/risk";
import RiskBadge from "@/components/RiskBadge";
import RiskWhatIfPanel from "@/components/RiskWhatIfPanel";
import CustomerFeedbackPanel from "@/components/CustomerFeedbackPanel";
import DraftMessagePanel from "@/components/DraftMessagePanel";
import SectionHeading from "@/components/SectionHeading";

interface LivePrediction {
  churnRisk: number;
  riskCategory: RiskCategory;
  ticketSentiment: number;
}

export default function CustomerDetailContent({ customer: baseCustomer }: { customer: Customer }) {
  const [prediction, setPrediction] = useState<LivePrediction | null>(null);
  const [explainResult, setExplainResult] = useState<ExplainResult | null>(null);
  const [explainLoading, setExplainLoading] = useState(true);
  const [explainError, setExplainError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPrediction() {
      try {
        const [result] = await predictChurn([
          {
            customer_id: baseCustomer.id,
            account_age_days: baseCustomer.accountAgeDays,
            daily_usage_mins: baseCustomer.dailyUsageMins,
            login_frequency: baseCustomer.loginFrequency,
            last_support_ticket: baseCustomer.lastSupportTicket,
            days_since_last_login: baseCustomer.daysSinceLastLogin,
            core_feature_usage_percentage: baseCustomer.coreFeatureUsagePercentage,
          },
        ]);
        if (cancelled || !result) return;
        setPrediction({
          churnRisk: result.churn_risk,
          riskCategory: result.risk_category,
          ticketSentiment: result.ticket_sentiment,
        });
      } catch {
        if (cancelled) return;
        // ML service unreachable — fall back to the cached mock risk score.
        setPrediction({
          churnRisk: baseCustomer.churnRisk,
          riskCategory: baseCustomer.riskCategory,
          ticketSentiment: 0,
        });
      }
    }

    loadPrediction();
    return () => {
      cancelled = true;
    };
  }, [baseCustomer]);

  useEffect(() => {
    if (!prediction) return;
    let cancelled = false;

    async function loadExplanation() {
      setExplainLoading(true);
      setExplainError(null);
      try {
        const context: AICustomerContext = {
          name: baseCustomer.name,
          planTier: baseCustomer.planTier,
          accountAgeDays: baseCustomer.accountAgeDays,
          dailyUsageMins: baseCustomer.dailyUsageMins,
          loginFrequency: baseCustomer.loginFrequency,
          lastSupportTicket: baseCustomer.lastSupportTicket,
          churnRisk: prediction!.churnRisk,
          riskCategory: prediction!.riskCategory,
          ticketSentiment: prediction!.ticketSentiment,
        };
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(context),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          throw new Error(data.error ?? `Request failed with status ${res.status}.`);
        }
        setExplainResult(data);
      } catch (err) {
        if (cancelled) return;
        setExplainError(err instanceof Error ? err.message : "Failed to load AI explanation.");
      } finally {
        if (!cancelled) setExplainLoading(false);
      }
    }

    loadExplanation();
    return () => {
      cancelled = true;
    };
  }, [prediction, baseCustomer]);

  const displayCustomer: Customer = prediction
    ? { ...baseCustomer, churnRisk: prediction.churnRisk, riskCategory: prediction.riskCategory }
    : baseCustomer;

  const recommendation = getPlanRecommendation({
    planTier: baseCustomer.planTier,
    riskCategory: displayCustomer.riskCategory,
    loginFrequency: baseCustomer.loginFrequency,
    daysSinceLastLogin: baseCustomer.daysSinceLastLogin,
    coreFeatureUsagePercentage: baseCustomer.coreFeatureUsagePercentage,
  });
  const churnReason = getChurnReason(baseCustomer);

  const aiContext: AICustomerContext = {
    name: baseCustomer.name,
    planTier: baseCustomer.planTier,
    accountAgeDays: baseCustomer.accountAgeDays,
    dailyUsageMins: baseCustomer.dailyUsageMins,
    loginFrequency: baseCustomer.loginFrequency,
    lastSupportTicket: baseCustomer.lastSupportTicket,
    churnRisk: displayCustomer.churnRisk,
    riskCategory: displayCustomer.riskCategory,
    ticketSentiment: prediction?.ticketSentiment ?? 0,
  };

  return (
    <>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-white">
              {baseCustomer.name}
            </h1>
            <RiskBadge category={displayCustomer.riskCategory} />
          </div>
          <p className="mt-1 text-sm text-neutral-400">{baseCustomer.email}</p>
          <p className="mt-2 text-sm text-neutral-300">
            <span className="font-medium text-white">Top churn factor:</span>{" "}
            {churnReason.reason}
          </p>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-neutral-400">Plan Tier</dt>
              <dd className="font-medium text-neutral-200">{baseCustomer.planTier}</dd>
            </div>
            <div>
              <dt className="text-neutral-400">Monthly Value</dt>
              <dd className="font-medium text-neutral-200">
                {formatCurrency(baseCustomer.monthlyValue)}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-400">Account Age</dt>
              <dd className="font-medium text-neutral-200">{baseCustomer.accountAgeDays} days</dd>
            </div>
            <div>
              <dt className="text-neutral-400">Login Frequency</dt>
              <dd className="font-medium text-neutral-200">{baseCustomer.loginFrequency}</dd>
            </div>
            <div>
              <dt className="text-neutral-400">Daily Usage</dt>
              <dd className="font-medium text-neutral-200">{baseCustomer.dailyUsageMins} min</dd>
            </div>
            <div>
              <dt className="text-neutral-400">Last Active</dt>
              <dd className="font-medium text-neutral-200">{formatDate(baseCustomer.lastActive)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <RiskWhatIfPanel customer={displayCustomer} />
        </div>

        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border border-emerald-900 bg-emerald-950/40 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <Sparkles size={16} aria-hidden="true" />
              AI Explanation
            </div>
            {explainLoading && (
              <div className="mt-2 flex items-center gap-2 text-sm text-neutral-300">
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                Generating explanation...
              </div>
            )}
            {!explainLoading && explainError && (
              <div role="alert" className="mt-2 flex items-center gap-2 text-sm text-neutral-200">
                <AlertTriangle size={14} aria-hidden="true" />
                {explainError}
              </div>
            )}
            {!explainLoading && !explainError && explainResult && (
              <p className="mt-2 text-sm leading-relaxed text-neutral-200">
                {explainResult.explanation}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-sky-900 bg-sky-950/40 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-400">
              <Target size={16} aria-hidden="true" />
              Recommended Action
            </div>
            <p className="mt-2 text-sm font-medium text-white">{recommendation.action}</p>
            <p className="mt-1 text-sm leading-relaxed text-neutral-300">{recommendation.rationale}</p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
            <SectionHeading title="Recent support contact" />
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              {baseCustomer.lastSupportTicket}
            </p>
          </div>

          <DraftMessagePanel
            context={aiContext}
            recommendedAction={recommendation.action}
            email={baseCustomer.email}
          />

          <CustomerFeedbackPanel customer={displayCustomer} />
        </div>
      </div>
    </>
  );
}
