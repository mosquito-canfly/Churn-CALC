import { NextResponse } from "next/server";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL ?? "http://localhost:8000";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  let upstream: Response;
  try {
    upstream = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json(
      { error: `Could not reach the ML service at ${ML_SERVICE_URL}. Is it running?` },
      { status: 503 }
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: `ML service responded with status ${upstream.status}.` },
      { status: 503 }
    );
  }

  const data = await upstream.json();
  return NextResponse.json(data);
}
