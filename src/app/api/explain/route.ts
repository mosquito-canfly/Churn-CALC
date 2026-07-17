import { NextResponse } from "next/server";
import { getCustomerById } from "@/lib/mockData";

// TODO: replace with a real AI-generated explanation (e.g. Gemini call).
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const customer = typeof body.customerId === "string" ? getCustomerById(body.customerId) : undefined;

  return NextResponse.json({
    customerId: body.customerId ?? null,
    explanation:
      customer?.explanation ??
      "Placeholder AI explanation: this customer's usage and support history suggest moderate churn risk.",
  });
}
