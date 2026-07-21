"use client";

import { useState } from "react";
import { MessageSquareText, Loader2, AlertTriangle, Mail } from "lucide-react";
import type { AICustomerContext, DraftMessageResult } from "@/lib/aiTypes";
import { buildMailtoHref } from "@/lib/mailto";
import SectionHeading from "@/components/SectionHeading";

interface DraftMessagePanelProps {
  context: AICustomerContext;
  recommendedAction?: string;
  email: string;
}

export default function DraftMessagePanel({ context, recommendedAction, email }: DraftMessagePanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftMessageResult | null>(null);

  async function handleDraft() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/draft-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...context, recommendedAction }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? `Request failed with status ${res.status}.`);
      }
      setDraft(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to draft a message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <SectionHeading
        title="Draft retention message"
        subtitle="Generate a personalized message, then review it before sending."
        action={
          <button
            onClick={handleDraft}
            disabled={loading}
            aria-label="Draft retention message"
            aria-busy={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-sky-800 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <MessageSquareText size={14} aria-hidden="true" />
            )}
            Draft message
          </button>
        }
      />

      {error && (
        <div
          role="alert"
          className="mt-4 flex items-center gap-2 rounded-lg bg-red-950 px-4 py-3 text-sm text-red-400"
        >
          <AlertTriangle size={14} aria-hidden="true" />
          {error}
        </div>
      )}

      {draft && !error && (
        <div className="mt-4 rounded-lg bg-neutral-800/60 p-4 text-sm leading-relaxed text-neutral-300">
          <p className="font-medium text-white">{draft.subject}</p>
          <p className="mt-2 whitespace-pre-line">{draft.body}</p>
          <div className="mt-4 flex flex-col items-start gap-1.5 border-t border-neutral-700 pt-4">
            <a
              href={buildMailtoHref(email, draft.subject, draft.body)}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-sky-800"
            >
              <Mail size={14} aria-hidden="true" />
              Send email
            </a>
            <p className="text-xs text-neutral-400">
              Opens this message in your default email app, pre-filled and ready to review — it
              isn&apos;t sent automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
