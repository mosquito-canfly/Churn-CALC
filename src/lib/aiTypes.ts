export interface AICustomerContext {
  name: string;
  planTier: string;
  accountAgeDays: number;
  dailyUsageMins: number;
  loginFrequency: string;
  lastSupportTicket: string;
  churnRisk: number;
  riskCategory: string;
  ticketSentiment: number;
}

export interface ExplainResult {
  explanation: string;
  recommendedAction: string;
}

export interface DraftMessageResult {
  subject: string;
  body: string;
}
