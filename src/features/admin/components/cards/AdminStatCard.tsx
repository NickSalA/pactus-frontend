type AdminStatCardProps = {
  label: string;
  value: number | string;
};

export function AdminStatCard({ label, value }: AdminStatCardProps) {
  return (
    <article className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm shadow-slate-200/70">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-4xl font-semibold text-slate-900">
        {value}
      </p>
    </article>
  );
}