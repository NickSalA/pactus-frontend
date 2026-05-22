'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { ApiDashboardAlertCategory, ApiDashboardAlertItem } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DashboardAlertCenterProps = {
  alerts: ApiDashboardAlertCategory[];
  isLoading: boolean;
};

import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

type Tab = {
  label: string;
  count: number;
  dueTo: number | null;
  color: { accent: string; bg: string };
};

function AlertCard({
  item,
  accentColor,
}: {
  item: ApiDashboardAlertItem;
  accentColor: string;
}) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    router.push('/contracts');
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border bg-gray-50 p-4 text-left transition-colors"
      style={{
        borderColor: isHovered ? `${accentColor}66` : '#e5e7eb',
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: accentColor }}
        />
        <span className="text-sm font-medium text-slate-800 truncate">
          {item.name}
        </span>
        {item.detail && (
          <span className="text-xs text-gray-500 truncate">{item.detail}</span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className="rounded-full px-2 py-1 text-xs font-medium"
          style={{
            backgroundColor: `${accentColor}26`,
            color: accentColor,
          }}
        >
          {item.status}
        </span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </button>
  );
}

export function DashboardAlertCenter({
  alerts,
  isLoading,
}: DashboardAlertCenterProps) {
  if (isLoading) {
    return (
      <Card className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-md">
        <CardContent className="flex flex-1 items-center justify-center">
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  const tabs: Tab[] = alerts.map((alert) => ({
    label: alert.label,
    count: alert.count,
    dueTo: alert.due_to,
    color: alert.color,
  }));

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);

  const selectedAlert = alerts[selectedIndex];
  const items = selectedAlert?.items ?? [];
  const accentColor = selectedAlert?.color.accent ?? '#64748B';

  return (
    <Card className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-md gap-0">
      <CardHeader className="mb-4 p-0">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Centro de Alertas
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex overflow-y-auto p-0 gap-4">
        <div className="mb-4 flex flex-col items-stretch justify-center gap-2">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              onMouseEnter={() => setHoveredTabIndex(index)}
              onMouseLeave={() => setHoveredTabIndex(null)}
              className={`flex flex-1 flex-col justify-center items-center gap-px rounded-lg p-3 text-center transition-colors ${
                selectedIndex === index ? 'font-medium' : 'text-gray-500'
              }`}
              style={
                selectedIndex === index || hoveredTabIndex === index
                  ? {
                      backgroundColor: `${tab.color.bg}3D`,
                      color: tab.color.accent,
                      borderWidth: '1px',
                      borderColor: tab.color.accent,
                    }
                  : {
                      borderWidth: '1px',
                      borderColor: tab.color.accent,
                      color: tab.color.accent,
                    }
              }
            >
              <span className="text-xl font-extrabold leading-none">
                {tab.count}
              </span>
              <span className="text-sm font-extrabold leading-tight">
                {tab.label}
              </span>
              {tab.dueTo && (
                <span className="text-sm font-extrabold leading-tight">
                  {tab.dueTo} dias
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {items.map((item: ApiDashboardAlertItem) => (
            <AlertCard key={item.id} item={item} accentColor={accentColor} />
          ))}
          {items.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-400">
              No hay alertas en esta categoría
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
