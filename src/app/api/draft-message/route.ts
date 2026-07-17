import { NextResponse } from "next/server";
import { getCustomerById } from "@/lib/mockData";

// TODO: replace with a real Gemini-drafted retention message.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const customer = typeof body.customerId === "string" ? getCustomerById(body.customerId) : undefined;
  const name = customer?.name ?? "there";

  const message = `Hi ${name},\n\nWe noticed you haven't been getting the most out of your plan lately, and we'd love to help. Is there anything blocking you right now, or a feature you're trying to use that isn't working the way you'd expect?\n\nWe're happy to jump on a quick call or offer a tailored plan adjustment if that would help.\n\nBest,\nThe Team`;

  return NextResponse.json({
    customerId: body.customerId ?? null,
    message,
  });
}
