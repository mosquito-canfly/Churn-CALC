import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Target } from "lucide-react";
import { getCustomerById, customers } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/risk";
import RiskBadge from "@/components/RiskBadge";
import RiskWhatIfPanel from "@/components/RiskWhatIfPanel";
import DraftMessagePanel from "@/components/DraftMessagePanel";

export function generateStaticParams() {
  return customers.map((customer) => ({ id: customer.id }));
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800"
      >
        <ArrowLeft size={14} />
        Back to customers
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              {customer.name}
            </h1>
            <RiskBadge category={customer.riskCategory} />
          </div>
          <p className="mt-1 text-sm text-neutral-500">{customer.email}</p>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-neutral-400">Plan Tier</dt>
              <dd className="font-medium text-neutral-800">{customer.planTier}</dd>
            </div>
            <div>
              <dt className="text-neutral-400">Monthly Value</dt>
              <dd className="font-medium text-neutral-800">{formatCurrency(customer.monthlyValue)}</dd>
            </div>
            <div>
              <dt className="text-neutral-400">Account Age</dt>
              <dd className="font-medium text-neutral-800">{customer.accountAgeDays} days</dd>
            </div>
            <div>
              <dt className="text-neutral-400">Login Frequency</dt>
              <dd className="font-medium text-neutral-800">{customer.loginFrequency}</dd>
            </div>
            <div>
              <dt className="text-neutral-400">Daily Usage</dt>
              <dd className="font-medium text-neutral-800">{customer.dailyUsageMins} min</dd>
            </div>
            <div>
              <dt className="text-neutral-400">Last Active</dt>
              <dd className="font-medium text-neutral-800">{formatDate(customer.lastActive)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <RiskWhatIfPanel customer={customer} />
        </div>

        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <Sparkles size={16} />
              AI Explanation
            </div>
            <p className="mt-2 text-sm leading-relaxed text-emerald-900">{customer.explanation}</p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-800">
              <Target size={16} />
              Recommended Action
            </div>
            <p className="mt-2 text-sm leading-relaxed text-blue-900">{customer.recommendedAction}</p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-800">Recent Support Contact</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {customer.lastSupportTicket}
            </p>
          </div>

          <DraftMessagePanel customer={customer} />
        </div>
      </div>
    </div>
  );
}
