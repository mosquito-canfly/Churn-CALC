"use client";

import { useState } from "react";
import { MessageSquareText, Loader2 } from "lucide-react";
import type { Customer } from "@/lib/mockData";

export default function DraftMessagePanel({ customer }: { customer: Customer }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleDraft() {
    setLoading(true);
    // TODO: this currently hits a mock API route; swap in a real Gemini-backed
    // draft once the integration exists.
    try {
      const res = await fetch("/api/draft-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id }),
      });
      const data = await res.json();
      setMessage(data.message);
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

      {message && (
        <div className="mt-4 rounded-lg bg-neutral-50 p-4 text-sm leading-relaxed whitespace-pre-line text-neutral-700">
          {message}
        </div>
      )}
    </div>
  );
}
