type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-4 flex shrink-0 flex-col gap-1">
      <h1 className="text-display-large-bold font-semibold text-brand-primary">
        {title}
      </h1>
      {subtitle && (
        <p className="text-body-small-bold text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}
