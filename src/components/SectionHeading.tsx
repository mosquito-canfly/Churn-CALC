import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: string;
  action?: ReactNode;
  id?: string;
}

export default function SectionHeading({ title, subtitle, action, id }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 id={id} className="text-base font-semibold text-white">
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-sm text-neutral-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
