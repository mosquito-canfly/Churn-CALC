import { MessageSquare } from "lucide-react";
import type { Customer } from "@/lib/mockData";
import SectionHeading from "@/components/SectionHeading";

type FeedbackSentiment = "Negative" | "Neutral" | "Positive";

interface FeedbackTemplate {
  source: string;
  date: string;
  quote: string;
}

// Mock collected feedback — illustrative example quotes, not real customer data.
// At-risk/Under-utilized customers draw from NEGATIVE or NEUTRAL; Healthy customers
// draw from POSITIVE or NEUTRAL, so sentiment always stays coherent with risk category.
// Each pool has one entry per mock customer (see pickFeedback) so two customers can
// never be assigned the exact same quote, however the roster is filtered or sorted.
const NEGATIVE_FEEDBACK: FeedbackTemplate[] = [
  { source: "In-app survey", date: "Jul 12, 2026", quote: "We onboarded fast, but honestly can't find half the features we were sold on. Feels like we're paying Enterprise for a Starter experience." },
  { source: "Support ticket", date: "Jun 18, 2026", quote: "We've had three billing issues in as many months and support keeps pointing us in circles." },
  { source: "NPS follow-up", date: "Jul 5, 2026", quote: "Half my team stopped logging in after the last update broke our saved reports." },
  { source: "Renewal check-in", date: "Jun 29, 2026", quote: "I've asked twice for a walkthrough and never heard back. We're evaluating other tools now." },
  { source: "Support ticket", date: "Jul 9, 2026", quote: "The integration we were promised at signup still isn't live four months later." },
  { source: "In-app survey", date: "Jun 22, 2026", quote: "Every time we need help it's a 48-hour wait. That's not workable for us." },
  { source: "Onboarding call", date: "Jul 2, 2026", quote: "We're paying for features we can't figure out how to use, and nobody's reached out to help." },
  { source: "Support ticket", date: "Jun 14, 2026", quote: "The dashboard logged us out mid-report twice this week. It's hard to trust right now." },
  { source: "NPS follow-up", date: "Jul 15, 2026", quote: "Our renewal is coming up and honestly we haven't seen enough value to justify it." },
  { source: "Support ticket", date: "Jun 25, 2026", quote: "Support closed our ticket without actually fixing the problem." },
  { source: "In-app survey", date: "Jul 7, 2026", quote: "We were sold on the reporting tools but they still don't cover what our finance team needs." },
  { source: "Renewal check-in", date: "Jun 4, 2026", quote: "We've quietly stopped recommending this internally after the outages last quarter." },
  { source: "Support ticket", date: "Jul 17, 2026", quote: "Nobody on our team can explain what we're actually paying for anymore." },
  { source: "NPS follow-up", date: "Jun 11, 2026", quote: "The price went up but nothing about the product changed for us." },
  { source: "Onboarding call", date: "Jul 14, 2026", quote: "It's been months and we still haven't gotten past the setup checklist." },
  { source: "In-app survey", date: "Jun 7, 2026", quote: "Every workaround we've found should really just be a built-in feature by now." },
  { source: "Support ticket", date: "Jul 19, 2026", quote: "We opened a ticket about data syncing two weeks ago and haven't heard back since." },
  { source: "Renewal check-in", date: "Jun 16, 2026", quote: "Leadership is asking why we're still paying for a tool half the team has stopped using." },
  { source: "NPS follow-up", date: "Jul 4, 2026", quote: "We were promised a dedicated contact and instead we're bouncing between three different reps." },
  { source: "In-app survey", date: "Jun 30, 2026", quote: "The mobile app crashes so often we've gone back to doing this on paper." },
  { source: "Support ticket", date: "Jul 20, 2026", quote: "This is the second time a 'fix' broke something else entirely." },
  { source: "Onboarding call", date: "Jun 2, 2026", quote: "We still don't have a clear sense of what we're supposed to be getting out of this." },
  { source: "NPS follow-up", date: "Jun 26, 2026", quote: "Honestly not sure this is worth renewing at this price point." },
  { source: "In-app survey", date: "Jul 16, 2026", quote: "We've raised the same request three times and it still hasn't shipped." },
  { source: "Support ticket", date: "Jun 9, 2026", quote: "It shouldn't take a week to get a straight answer about our own account." },
];

const NEUTRAL_FEEDBACK: FeedbackTemplate[] = [
  { source: "Support ticket", date: "Jul 3, 2026", quote: "The dashboard is fine. Would be nice to have a clearer walkthrough of the reporting tools — took us a while to figure them out." },
  { source: "In-app survey", date: "Jun 27, 2026", quote: "No complaints, but we're only using a handful of the features on our plan." },
  { source: "Product feedback form", date: "Jul 8, 2026", quote: "Works fine day to day. Haven't explored much beyond the basics." },
  { source: "NPS follow-up", date: "Jun 20, 2026", quote: "It's a solid tool. Wish the mobile experience was a bit smoother." },
  { source: "Support ticket", date: "Jul 11, 2026", quote: "Nothing's broken, we just haven't had time to dig into the advanced settings." },
  { source: "Onboarding call", date: "Jun 30, 2026", quote: "Does the job. A clearer getting-started guide would help our newer team members." },
  { source: "In-app survey", date: "Jul 17, 2026", quote: "We use it weekly, mostly for the basics. Curious what else it can do." },
  { source: "Support ticket", date: "Jun 9, 2026", quote: "Fine so far — support was quick to answer our one question this month." },
  { source: "Product feedback form", date: "Jul 1, 2026", quote: "Does what it says on the tin. Nothing stands out either way yet." },
  { source: "NPS follow-up", date: "Jun 13, 2026", quote: "It's adequate for what we need right now. Might revisit the higher tier later." },
  { source: "Support ticket", date: "Jul 6, 2026", quote: "Reasonable experience overall. The search feature took some getting used to." },
  { source: "In-app survey", date: "Jun 23, 2026", quote: "We're still learning the reporting side. Everything else has been straightforward." },
  { source: "Onboarding call", date: "Jul 18, 2026", quote: "Setup was manageable. We haven't had a reason to contact support yet." },
  { source: "Product feedback form", date: "Jun 6, 2026", quote: "It covers our core use case. Wouldn't mind a few more export options." },
  { source: "NPS follow-up", date: "Jul 9, 2026", quote: "Middle of the road for us — not a problem, not a highlight either." },
  { source: "Support ticket", date: "Jun 19, 2026", quote: "Serviceable. We mostly stick to the same three screens each week." },
  { source: "In-app survey", date: "Jul 14, 2026", quote: "It's fine. We haven't compared it to alternatives in a while." },
  { source: "Onboarding call", date: "Jun 3, 2026", quote: "Got us up and running without much fuss. Still finding our footing on reporting." },
  { source: "Product feedback form", date: "Jul 20, 2026", quote: "No major issues. Would appreciate more guidance on the less obvious features." },
  { source: "NPS follow-up", date: "Jun 16, 2026", quote: "Steady, unremarkable, does the job most weeks." },
  { source: "Support ticket", date: "Jul 4, 2026", quote: "One question answered quickly, otherwise haven't needed to reach out." },
  { source: "In-app survey", date: "Jun 10, 2026", quote: "We use the core features and haven't ventured much further." },
  { source: "Onboarding call", date: "Jul 12, 2026", quote: "It works as described. Nothing has stood out as exceptional yet." },
  { source: "Product feedback form", date: "Jun 25, 2026", quote: "Fair enough for the price. We'll see how the next quarter goes." },
  { source: "NPS follow-up", date: "Jul 19, 2026", quote: "Consistent, if a little unremarkable. Gets the basics done." },
];

const POSITIVE_FEEDBACK: FeedbackTemplate[] = [
  { source: "NPS follow-up", date: "Jun 21, 2026", quote: "When it works, it works well. The core workspace is genuinely fast and the team likes the layout." },
  { source: "Onboarding call", date: "Jul 6, 2026", quote: "The team picked this up in a day. Genuinely the easiest onboarding we've had." },
  { source: "Support ticket", date: "Jun 24, 2026", quote: "Support resolved our issue in under an hour. That kind of responsiveness is rare." },
  { source: "In-app survey", date: "Jul 13, 2026", quote: "We rely on this daily now — it's become part of how the whole team works." },
  { source: "Product feedback form", date: "Jun 16, 2026", quote: "The new reporting view saved us hours last month. Really well built." },
  { source: "NPS follow-up", date: "Jul 1, 2026", quote: "Whenever we've needed help, someone's actually gotten back to us fast." },
  { source: "In-app survey", date: "Jun 11, 2026", quote: "This replaced three separate spreadsheets for us. Couldn't be happier." },
  { source: "Support ticket", date: "Jul 18, 2026", quote: "Rock solid so far — no downtime, no surprises, exactly what we needed." },
  { source: "Onboarding call", date: "Jun 5, 2026", quote: "Our whole team adopted it within a week. Adoption has never been this smooth." },
  { source: "Product feedback form", date: "Jul 10, 2026", quote: "The automation features alone have paid for the subscription twice over." },
  { source: "NPS follow-up", date: "Jun 8, 2026", quote: "Consistently reliable. It's one of the few tools nobody on the team complains about." },
  { source: "In-app survey", date: "Jul 15, 2026", quote: "The account team actually checks in proactively. That's made a real difference." },
  { source: "Support ticket", date: "Jun 28, 2026", quote: "Every ticket we've filed has been handled properly the first time." },
  { source: "Onboarding call", date: "Jul 3, 2026", quote: "We were fully live within our first week — faster than any tool we've switched to before." },
  { source: "Product feedback form", date: "Jun 20, 2026", quote: "The customization options let us build exactly the workflow our team needed." },
  { source: "NPS follow-up", date: "Jul 17, 2026", quote: "This is the rare tool where the whole team actually asked to keep using it." },
  { source: "In-app survey", date: "Jun 13, 2026", quote: "The new dashboard update genuinely made our weekly reviews faster." },
  { source: "Support ticket", date: "Jul 8, 2026", quote: "They shipped the feature we requested within a month. That's unusual and appreciated." },
  { source: "Onboarding call", date: "Jun 2, 2026", quote: "Best onboarding experience we've had with any vendor this year." },
  { source: "Product feedback form", date: "Jul 20, 2026", quote: "It just works, quietly, in the background — exactly what we want from this kind of tool." },
  { source: "NPS follow-up", date: "Jun 30, 2026", quote: "We've recommended this to two other teams internally already." },
  { source: "In-app survey", date: "Jul 2, 2026", quote: "The team's genuinely enthusiastic about using it, which says a lot." },
  { source: "Support ticket", date: "Jun 6, 2026", quote: "Fast, friendly, and it actually solved the problem — hard to ask for more." },
  { source: "Onboarding call", date: "Jul 11, 2026", quote: "We were skeptical after our last tool, but this one won us over quickly." },
  { source: "Product feedback form", date: "Jun 18, 2026", quote: "Genuinely well thought out. It's clear the team building this understands our workflow." },
];

const SENTIMENT_STYLES: Record<FeedbackSentiment, string> = {
  Negative: "bg-red-950 text-red-400 ring-red-900",
  Neutral: "bg-neutral-800 text-neutral-300 ring-neutral-700",
  Positive: "bg-emerald-950 text-emerald-400 ring-emerald-900",
};

// Extracts the mock roster's numeric suffix (e.g. "cust-018" -> 18). Each customer has
// a distinct number, so using it directly as a pool index (no modulo) guarantees no two
// customers ever land on the same slot in a given pool, however the roster is filtered
// or re-sorted elsewhere in the app.
function customerNumber(id: string): number {
  const match = id.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

// Deterministic per-customer pick: same customer always sees the same entry, every
// customer gets a distinct slot, and the sentiment stays coherent with how healthy
// their account is — never a glowing quote for an at-risk account or an angry one for
// a healthy account.
function pickFeedback(customer: Customer): { sentiment: FeedbackSentiment; entry: FeedbackTemplate } {
  const n = customerNumber(customer.id);
  const isHealthy = customer.riskCategory === "Healthy";
  const useSecondarySentiment = n % 3 === 0; // roughly 1 in 3 lean neutral either way

  const sentiment: FeedbackSentiment = useSecondarySentiment ? "Neutral" : isHealthy ? "Positive" : "Negative";
  const pool = sentiment === "Neutral" ? NEUTRAL_FEEDBACK : sentiment === "Positive" ? POSITIVE_FEEDBACK : NEGATIVE_FEEDBACK;
  const index = (n - 1) % pool.length;

  return { sentiment, entry: pool[index] };
}

export default function CustomerFeedbackPanel({ customer }: { customer: Customer }) {
  const { sentiment, entry } = pickFeedback(customer);

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <SectionHeading
        title={
          <span className="flex items-center gap-2">
            <MessageSquare size={16} className="text-neutral-400" aria-hidden="true" />
            Customer Feedback
          </span>
        }
      />

      <div className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${SENTIMENT_STYLES[sentiment]}`}
          >
            {sentiment}
          </span>
          <span className="text-xs text-neutral-500">
            {entry.source} · {entry.date}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-neutral-300">&ldquo;{entry.quote}&rdquo;</p>
      </div>
    </div>
  );
}
