"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LifeBuoy, LogOut, Sparkles, Users } from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:overflow-y-auto md:border-r md:border-neutral-800 md:bg-neutral-950 md:shrink-0">
      <div className="px-6 py-6">
        <span className="text-2xl font-semibold tracking-tight text-white">
          Churn<span className="text-sky-400">-CALC</span>
        </span>
      </div>

      <div className="px-6">
        <span className="text-[11px] font-semibold tracking-wider text-neutral-400">
          WORKSPACE
        </span>
      </div>

      <nav className="flex-1 px-3 pt-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
              }`}
            >
              <Icon size={18} className={isActive ? "text-sky-400" : ""} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-4">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles size={15} className="text-sky-400" aria-hidden="true" />
            AI Retention
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
            Your at-risk accounts are ready for outreach — see who on the Overview.
          </p>
        </div>

        <div className="mt-3 space-y-1 border-t border-neutral-800 pt-3">
          <div className="flex items-center gap-2.5 px-2 py-1.5 text-sm text-neutral-400">
            <LifeBuoy size={16} aria-hidden="true" />
            Support
          </div>
          <div className="flex items-center gap-2.5 px-2 py-1.5 text-sm text-neutral-400">
            <LogOut size={16} aria-hidden="true" />
            Sign out
          </div>
        </div>
      </div>
    </aside>
  );
}
