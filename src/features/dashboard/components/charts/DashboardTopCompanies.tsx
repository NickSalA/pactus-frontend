'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ApiDocumentType } from '@/types/api';
import { ApiDashboardTopCompanyResponse } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DashboardTopCompaniesProps = {
  data: ApiDashboardTopCompanyResponse[];
  isLoading: boolean;
  documentType: ApiDocumentType;
};

type MetricKey = 'contracts' | 'amount';

const COLORS = {
  COMPANY: '#3B82F6',
  LABOR: '#EF4444',
} as const;

const LoadingSkeleton = () => (
  <div className="flex flex-1 animate-pulse items-center justify-center rounded-xl bg-gray-50">
    <span className="text-sm text-gray-400">Cargando ranking...</span>
  </div>
);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export function DashboardTopCompanies({
  data,
  isLoading,
  documentType,
}: DashboardTopCompaniesProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('amount');

  if (isLoading) {
    return (
      <Card className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-md">
        <CardContent className="flex flex-1 items-center justify-center">
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  const barColor = COLORS[documentType];

  const chartData = data.map((item) => ({
    name: item.name,
    [activeMetric]: activeMetric === 'amount' ? item.amount : item.contracts,
  }));

  const tooltipFormatter = (value: unknown, name: unknown) => {
    if (typeof value !== 'number') return ['—', String(name)];
    if (String(name) === 'amount') {
      return [formatCurrency(value), 'Monto'];
    }
    return [value, 'Contratos'];
  };

  return (
    <Card className="flex flex-col rounded-2xl bg-white p-5 shadow-md">
      <CardHeader className="mb-4 flex items-center justify-between p-0">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Top Empresas
        </CardTitle>
        <div className="flex rounded-lg bg-gray-100 p-0.5">
          <button
            onClick={() => setActiveMetric('contracts')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              activeMetric === 'contracts'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            VOL
          </button>
          <button
            onClick={() => setActiveMetric('amount')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              activeMetric === 'amount'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            VALOR
          </button>
        </div>
      </CardHeader>

      <div className="flex-1 relative min-h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 80, bottom: 0 }}
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748B' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y}
                  dy={4}
                  fill="#64748B"
                  fontSize={11}
                  textAnchor="end"
                >
                  {payload.value.length > 12
                    ? `${payload.value.substring(0, 12)}...`
                    : payload.value}
                </text>
              )}
              width={80}
            />
            <Tooltip
              formatter={tooltipFormatter}
              cursor={{ fill: 'transparent' }}
            />
            <Bar dataKey={activeMetric} radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColor}
                  fillOpacity={0.85 - index * 0.1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
