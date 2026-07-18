export type LoginFrequency = "Daily" | "Weekly" | "Rarely";
export type RiskCategory = "Healthy" | "Under-utilized" | "At-risk";

export interface Customer {
  customer_id: string;
  account_age_days: number;
  daily_usage_mins: number;
  login_frequency: LoginFrequency;
  last_support_ticket: string;
}

export interface Prediction {
  customer_id: string;
  churn_risk: number;
  risk_category: RiskCategory;
  ticket_sentiment: number;
}

export async function predictChurn(customers: Customer[]): Promise<Prediction[]> {
  const res = await fetch("/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customers }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Prediction request failed with status ${res.status}.`);
  }

  const data: { predictions: Prediction[] } = await res.json();
  return data.predictions;
}
