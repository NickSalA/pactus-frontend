'use client';

import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ApiChartData } from '@/types/api';

type ChartRendererProps = {
  chart: ApiChartData;
};

const DEFAULT_COLOR = '#6366F1';

function BarChartWidget({ chart }: { chart: ApiChartData }) {
  const color = chart.config.series[0]?.color ?? DEFAULT_COLOR;
  const dataKey = chart.config.series[0]?.dataKey ?? 'value';
  const categoryKey = chart.config.categoryKey;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={chart.data}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 60, bottom: 8 }}
      >
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#64748B' }}
        />
        <YAxis
          type="category"
          dataKey={categoryKey}
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
              {String(payload.value).length > 12
                ? `${String(payload.value).substring(0, 12)}...`
                : payload.value}
            </text>
          )}
          width={60}
        />
        <Tooltip
          cursor={{ fill: 'transparent' }}
          contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />
        <Bar dataKey={dataKey} radius={[0, 4, 4, 0]}>
          {chart.data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={color} fillOpacity={0.85 - index * 0.05} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function LineChartWidget({ chart }: { chart: ApiChartData }) {
  const color = chart.config.series[0]?.color ?? DEFAULT_COLOR;
  const dataKey = chart.config.series[0]?.dataKey ?? 'value';
  const categoryKey = chart.config.categoryKey;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={chart.data}
        margin={{ top: 8, right: 16, left: 40, bottom: 8 }}
      >
        <XAxis
          dataKey={categoryKey}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#64748B' }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#64748B' }}
          width={40}
        />
        <Tooltip
          cursor={{ fill: 'transparent' }}
          contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function PieChartWidget({ chart }: { chart: ApiChartData }) {
  const color = chart.config.series[0]?.color ?? DEFAULT_COLOR;
  const dataKey = chart.config.series[0]?.dataKey ?? 'value';
  const categoryKey = chart.config.categoryKey;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chart.data}
          dataKey={dataKey}
          nameKey={categoryKey}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={75}
          paddingAngle={2}
        >
          {chart.data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={color}
              fillOpacity={0.85 - index * 0.05}
            />
          ))}
        </Pie>
        <Tooltip
          cursor={{ fill: 'transparent' }}
          contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ChartRenderer({ chart }: ChartRendererProps) {
  switch (chart.type) {
    case 'bar':
      return <BarChartWidget chart={chart} />;
    case 'line':
      return <LineChartWidget chart={chart} />;
    case 'pie':
      return <PieChartWidget chart={chart} />;
  }
}
