import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

type AdminModuleCardProps = {
  description: string;
  href?: string;
  icon: ReactNode;
  title: string;
};

export function AdminModuleCard({ description, href, icon, title }: AdminModuleCardProps) {
  const content = (
    <>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-blue-600">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-slate-300" />
    </>
  );

  if (!href) {
    return (
      <article className="flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm shadow-slate-200/70">
        {content}
      </article>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-3xl border border-slate-200/80 bg-white px-6 py-5 shadow-sm shadow-slate-200/70 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      {content}
    </Link>
  );
}
