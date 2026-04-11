import type { ReactNode } from "react";

type AdminSummaryCardProps = {
  icon: ReactNode;
  subtitle: string;
  title: string;
  tone: "amber" | "blue" | "emerald" | "indigo" | "violet";
  value: number;
};

const TONE_STYLES: Record<AdminSummaryCardProps["tone"], string> = {
  amber: "bg-amber-50 text-amber-500",
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  indigo: "bg-indigo-50 text-indigo-500",
  violet: "bg-violet-50 text-violet-600",
};

export function AdminSummaryCard({ icon, subtitle, title, tone, value }: AdminSummaryCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{title}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-800">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${TONE_STYLES[tone]}`}>
          {icon}
        </div>
      </div>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </article>
  );
}
