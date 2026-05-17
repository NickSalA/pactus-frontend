import { AlertTriangle, FileText, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DashboardMetric, DashboardMetricTone } from "@/features/dashboard/lib/dashboard-data";

type DashboardMetricsGridProps = {
  isLoading: boolean;
  metrics: DashboardMetric[];
};

const metricStyles: Record<
  DashboardMetricTone,
  {
    icon: LucideIcon;
    iconStyle: string;
  }
> = {
  primary: {
    icon: FileText,
    iconStyle: "bg-blue-50 text-blue-600",
  },
  warning: {
    icon: AlertTriangle,
    iconStyle: "bg-amber-50 text-amber-600",
  },
  danger: {
    icon: ShieldAlert,
    iconStyle: "bg-red-50 text-red-600",
  },
};

export function DashboardMetricsGrid({ isLoading, metrics }: DashboardMetricsGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => {
        const { icon: Icon, iconStyle } = metricStyles[metric.tone];

        return (
          <article
            key={metric.id}
            className="rounded-2xl bg-white p-5 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-medium">
                  {metric.title}
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-800">
                  {isLoading ? "..." : metric.value}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${iconStyle}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
