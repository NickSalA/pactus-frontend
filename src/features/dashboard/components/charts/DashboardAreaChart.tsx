'use client';

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ApiDashboardAreaChartResponse, ApiDocumentType } from '@/types/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

type DashboardAreaChartProps = {
  data: ApiDashboardAreaChartResponse;
  isLoading: boolean;
  documentType: ApiDocumentType;
};

const COLORS = {
  COMPANY: '#10B981',
  LABOR: '#EF4444',
} as const;

import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export function DashboardAreaChart({
  data,
  isLoading,
  documentType,
}: DashboardAreaChartProps) {
  if (isLoading) {
    return (
      <Card className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-md">
        <CardContent className="flex flex-1 items-center justify-center">
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
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
    if (typeof value !== 'number') return ['—', String(name)];
    const formatted = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: props.y_axis.format === 'currency' ? 'PEN' : 'USD',
    }).format(value);
    return [formatted, String(name)];
  };

  return (
    <Card className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-md">
      <CardHeader className="mb-4 p-0">
        <CardTitle className="text-lg font-semibold text-slate-800">
          {props.title}
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          {props.subtitle}
        </CardDescription>
      </CardHeader>

      <div className="flex flex-1 justify-center items-center relative w-full">
        <ResponsiveContainer width="90%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={`gradient-${documentType}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              ticks={allNames}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
            />

            <YAxis
              ticks={props.y_axis.labels}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
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
                activeDot={{
                  r: 6,
                  stroke: lineColor,
                  strokeWidth: 2,
                  fill: '#fff',
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        * Datos con línea punteada son proyecciones
      </p>
    </Card>
  );
}
