import { NextResponse } from "next/server";
import { getCustomerById } from "@/lib/mockData";

// TODO: replace with a real churn prediction model call.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const customer = typeof body.customerId === "string" ? getCustomerById(body.customerId) : undefined;

  return NextResponse.json({
    customerId: body.customerId ?? null,
    churnRisk: customer?.churnRisk ?? Math.floor(Math.random() * 100),
    riskCategory: customer?.riskCategory ?? "Under-utilized",
  });
}
