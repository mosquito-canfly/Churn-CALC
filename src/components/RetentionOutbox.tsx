"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Inbox, Mail } from "lucide-react";
import { getAtRiskCustomers, getCustomerRevenueAtRisk, type Customer } from "@/lib/mockData";
import { getPlanRecommendation } from "@/lib/planRecommendation";
import { getChurnReason } from "@/lib/churnReason";
import { buildFallbackDraftMessage } from "@/lib/draftMessage";
import { buildMailtoHref } from "@/lib/mailto";
import { formatCurrency } from "@/lib/risk";
import RecommendationBadge from "@/components/RecommendationBadge";

export default function RetentionOutbox({ customers }: { customers: Customer[] }) {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const atRisk = getAtRiskCustomers(customers);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-800">Retention Outbox</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Draft a retention email for every at-risk customer at once, then review and send
            each one individually.
          </p>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          <Inbox size={14} aria-hidden="true" />
          {open ? "Hide drafts" : `Draft retention messages (${atRisk.length})`}
        </button>
      </div>

      {open && (
        <>
          <p className="mt-4 text-xs text-neutral-500">
            Drafts are generated locally from each customer&apos;s recommended action and top
            churn reason — no AI call is made for the batch. Sending stays per-customer: each
            button opens your default email client pre-filled, nothing is sent automatically.
          </p>

          {atRisk.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-600">No at-risk customers right now.</p>
          ) : (
            <ul className="mt-3 divide-y divide-neutral-100">
              {atRisk.map((customer) => {
                const recommendation = getPlanRecommendation(customer);
                const { reason } = getChurnReason(customer);
                const draft = buildFallbackDraftMessage({
                  name: customer.name,
                  planTier: customer.planTier,
                  recommendedAction: recommendation.action,
                  reason,
                });
                const expanded = expandedId === customer.id;

                return (
                  <li key={customer.id} className="py-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-900">{customer.name}</span>
                          <RecommendationBadge kind={recommendation.kind} />
                        </div>
                        <div className="mt-0.5 text-xs text-neutral-600">
                          {customer.planTier} · {formatCurrency(getCustomerRevenueAtRisk(customer))} at
                          risk
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpandedId(expanded ? null : customer.id)}
                          aria-expanded={expanded}
                          className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                        >
                          {expanded ? "Hide draft" : "Preview draft"}
                          {expanded ? (
                            <ChevronUp size={12} aria-hidden="true" />
                          ) : (
                            <ChevronDown size={12} aria-hidden="true" />
                          )}
                        </button>
                        <a
                          href={buildMailtoHref(customer.email, draft.subject, draft.body)}
                          className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50"
                        >
                          <Mail size={12} aria-hidden="true" />
                          Send email
                        </a>
                      </div>
                    </div>

                    {expanded && (
                      <div className="mt-3 rounded-lg bg-neutral-50 p-3 text-sm leading-relaxed text-neutral-700">
                        <p className="font-medium text-neutral-900">{draft.subject}</p>
                        <p className="mt-2 whitespace-pre-line">{draft.body}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
