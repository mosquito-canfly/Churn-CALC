import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCustomerById, customers } from "@/lib/mockData";
import CustomerDetailContent from "@/components/CustomerDetailContent";

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
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-400 hover:text-sky-400"
      >
        <ArrowLeft size={14} />
        Back to customers
      </Link>

      <CustomerDetailContent customer={customer} />
    </div>
  );
}
