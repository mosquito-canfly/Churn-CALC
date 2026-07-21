export interface IllustrativeMonthlyNet {
  month: string;
  shortMonth: string;
  net: number;
}

// Fixed illustrative net-add figures (signups minus churn) for a sample trailing
// 12-month view. Churn-CALC has no historical/time-series data yet (mock roster, no
// database) — these numbers are NOT derived from the real customer roster and must
// never be presented as actual history. See NetSubscribersChart.tsx, which labels
// this data as a sample in the UI.
const ILLUSTRATIVE_NET_VALUES = [8, -4, 15, 22, -10, 5, 18, -6, 12, 9, -15, 20];

function monthDate(monthsAgo: number): Date {
  const date = new Date();
  date.setDate(1); // pin to the 1st so subtracting months can't roll over unevenly
  date.setMonth(date.getMonth() - monthsAgo);
  return date;
}

// Trailing 12 months ending with the current month, oldest first. `month` is the full
// label (used in the chart's aria-label summary); `shortMonth` is the 3-letter axis tick.
export const ILLUSTRATIVE_NET_SUBSCRIBERS_SAMPLE: IllustrativeMonthlyNet[] =
  ILLUSTRATIVE_NET_VALUES.map((net, index) => {
    const date = monthDate(ILLUSTRATIVE_NET_VALUES.length - 1 - index);
    return {
      month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      shortMonth: date.toLocaleDateString("en-US", { month: "short" }),
      net,
    };
  });
