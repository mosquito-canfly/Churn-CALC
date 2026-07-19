import { NextResponse } from "next/server";
import { callGemini, extractJson } from "@/lib/gemini";
import type { AICustomerContext, ExplainResult } from "@/lib/aiTypes";

function buildPrompt(c: AICustomerContext): string {
  return `You are a customer-success analyst. Based ONLY on the data below, explain why this
customer is at risk of churning, then recommend one retention action. Do not invent facts
not present in the data.

Customer: ${c.name}
Plan: ${c.planTier}
Account age: ${c.accountAgeDays} days
Daily usage: ${c.dailyUsageMins} minutes
Login frequency: ${c.loginFrequency}
Last support ticket: "${c.lastSupportTicket}"
Support ticket sentiment: ${c.ticketSentiment} (range -1 negative to +1 positive)
Churn risk score: ${c.churnRisk}/100 (${c.riskCategory})

Return STRICT JSON only, no markdown, in this exact shape:
{"explanation": "2-3 sentences", "recommendedAction": "one concrete action"}`;
}

function isExplainResult(value: unknown): value is ExplainResult {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as ExplainResult).explanation === "string" &&
    typeof (value as ExplainResult).recommendedAction === "string"
  );
}

function fallbackResult(c: AICustomerContext): ExplainResult {
  return {
    explanation: `${c.name} has a churn risk of ${c.churnRisk}/100 (${c.riskCategory}), based on ${c.dailyUsageMins} minutes of daily usage, ${c.loginFrequency.toLowerCase()} logins, and a support ticket sentiment of ${c.ticketSentiment}.`,
    recommendedAction:
      "Reach out personally to check in on their experience and address any open concerns.",
  };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<AICustomerContext>;

  if (
    typeof body.name !== "string" ||
    typeof body.churnRisk !== "number" ||
    typeof body.riskCategory !== "string"
  ) {
    return NextResponse.json({ error: "Missing required customer fields." }, { status: 400 });
  }
  const customer = body as AICustomerContext;

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
  return NextResponse.json(isExplainResult(parsed) ? parsed : fallbackResult(customer));
}
