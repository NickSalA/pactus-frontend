"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AreaChartResponse, DocumentType } from "@/types/api.types";

type DashboardAreaChartProps = {
  data: AreaChartResponse;
  isLoading: boolean;
  documentType: DocumentType;
};

const COLORS = {
  COMPANY: "#10B981",
  LABOR: "#EF4444",
} as const;

const LoadingSkeleton = () => (
  <div className="flex flex-1 animate-pulse items-center justify-center rounded-xl bg-gray-50">
    <span className="text-sm text-gray-400">Cargando gráfico...</span>
  </div>
);

export function DashboardAreaChart({ data, isLoading, documentType }: DashboardAreaChartProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const lineColor = COLORS[documentType];
  const { props } = data;

  const formattedData = props.series.flatMap((series) =>
    series.data.map((point) => ({
      name: point.x,
      [series.name]: point.y,
      is_forecast: point.is_forecast,
    })),
  );

  const allNames = [...new Set(formattedData.map((d) => d.name as string))];

  const formattedTooltip = (value: unknown, name: unknown) => {
    if (typeof value !== "number") return ["—", String(name)];
    const formatted = new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: props.y_axis.format === "currency" ? "PEN" : "USD",
    }).format(value);
    return [formatted, String(name)];
  };

  return (
    <section className="flex flex-col rounded-2xl bg-white p-5 shadow-md">
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{props.title}</h3>
        <p className="text-sm text-slate-500">{props.subtitle}</p>
      </header>

      <div className="flex-1 relative min-h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
          <defs>
            <linearGradient id={`gradient-${documentType}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="name"
            ticks={allNames}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748B" }}
          />

          <YAxis
            ticks={props.y_axis.labels}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748B" }}
            tickFormatter={(value) =>
              value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
            }
          />

          <Tooltip formatter={formattedTooltip} />

          {props.series.map((series) => (
            <Area
              key={series.name}
              type="monotone"
              dataKey={series.name}
              name={series.name}
              stroke={lineColor}
              strokeWidth={2}
              fill={`url(#gradient-${documentType})`}
              activeDot={{ r: 6, stroke: lineColor, strokeWidth: 2, fill: "#fff" }}
            />
))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        * Datos con línea punteada son proyecciones
      </p>
    </section>
  );
}