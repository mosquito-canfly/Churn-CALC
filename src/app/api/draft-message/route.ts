import { NextResponse } from "next/server";
import { callGemini, extractJson } from "@/lib/gemini";
import { buildFallbackDraftMessage } from "@/lib/draftMessage";
import type { AICustomerContext, DraftMessageResult } from "@/lib/aiTypes";

interface DraftMessageInput extends AICustomerContext {
  recommendedAction?: string;
}

function buildPrompt(c: DraftMessageInput): string {
  return `You are a customer-success copywriter. Based ONLY on the data below, write a short,
warm, personalized retention email from the company to this customer, addressing their
specific situation. Weave the recommended action below into the email naturally as the
concrete next step — the email should be consistent with it, not generic. Do not invent
facts not present in the data. Keep the body under 120 words, professional but friendly.

Customer: ${c.name}
Plan: ${c.planTier}
Account age: ${c.accountAgeDays} days
Daily usage: ${c.dailyUsageMins} minutes
Login frequency: ${c.loginFrequency}
Last support ticket: "${c.lastSupportTicket}"
Support ticket sentiment: ${c.ticketSentiment} (range -1 negative to +1 positive)
Churn risk score: ${c.churnRisk}/100 (${c.riskCategory})
Recommended action: ${c.recommendedAction ?? "none provided"}

Return STRICT JSON only, no markdown, in this exact shape:
{"subject": "...", "body": "..."}`;
}

function isDraftMessageResult(value: unknown): value is DraftMessageResult {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as DraftMessageResult).subject === "string" &&
    typeof (value as DraftMessageResult).body === "string"
  );
}

function fallbackResult(c: DraftMessageInput): DraftMessageResult {
  return buildFallbackDraftMessage({
    name: c.name,
    planTier: c.planTier,
    recommendedAction: c.recommendedAction,
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<DraftMessageInput>;

  if (
    typeof body.name !== "string" ||
    typeof body.churnRisk !== "number" ||
    typeof body.riskCategory !== "string"
  ) {
    return NextResponse.json({ error: "Missing required customer fields." }, { status: 400 });
  }
  const customer = body as DraftMessageInput;

  let text: string;
  try {
    text = await callGemini(buildPrompt(customer));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gemini request failed." },
      { status: 503 }
    );
  }

  const parsed = extractJson(text);
  return NextResponse.json(isDraftMessageResult(parsed) ? parsed : fallbackResult(customer));
}
