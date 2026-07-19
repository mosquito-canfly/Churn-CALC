"use client";

import { useState } from "react";
import { MessageSquareText, Loader2, AlertTriangle } from "lucide-react";
import type { AICustomerContext, DraftMessageResult } from "@/lib/aiTypes";

interface DraftMessagePanelProps {
  context: AICustomerContext;
  recommendedAction?: string;
}

export default function DraftMessagePanel({ context, recommendedAction }: DraftMessagePanelProps) {
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
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-neutral-800">Draft Retention Message</h2>
        <button
          onClick={handleDraft}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-60"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <MessageSquareText size={14} />}
          Draft message
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={14} />
          {error}
        </div>
      )}

      {draft && !error && (
        <div className="mt-4 rounded-lg bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700">
          <p className="font-medium text-neutral-900">{draft.subject}</p>
          <p className="mt-2 whitespace-pre-line">{draft.body}</p>
        </div>
      )}
    </div>
  );
}
