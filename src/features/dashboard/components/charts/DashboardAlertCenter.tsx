"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AlertCategory, AlertItem } from "@/types/api.types";

type DashboardAlertCenterProps = {
  alerts: AlertCategory[];
  isLoading: boolean;
};

const LoadingSkeleton = () => (
  <div className="flex flex-1 animate-pulse items-center justify-center rounded-xl bg-gray-50">
    <span className="text-sm text-gray-400">Cargando alertas...</span>
  </div>
);

type Tab = {
  label: string;
  count: number;
  color: { accent: string; bg: string };
};

function AlertCard({ item }: { item: AlertItem }) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/contracts");
  };

  return (
    <button
      onClick={handleClick}
      className="flex w-full items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 text-left hover:shadow-md"
    >
      <span className="text-sm font-medium text-slate-800">{item.name}</span>
      {item.detail && (
        <span className="text-xs text-gray-500">{item.detail}</span>
      )}
      <span className="ml-auto whitespace-nowrap text-xs font-medium text-slate-500">
        {item.status}
      </span>
    </button>
  );
}

export function DashboardAlertCenter({ alerts, isLoading }: DashboardAlertCenterProps) {
  if (isLoading) {
    return (
      <section className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-md">
        <LoadingSkeleton />
      </section>
    );
  }

  const tabs: Tab[] = alerts.map((alert) => ({
    label: alert.label,
    count: alert.count,
    color: alert.color,
  }));

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedAlert = alerts[selectedIndex];
  const items = selectedAlert?.items ?? [];

  return (
    <section className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">Centro de Alertas</h3>

      <div className="mb-4 flex flex-wrap gap-4">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setSelectedIndex(index)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
              selectedIndex === index
                ? "bg-gray-100 font-medium text-slate-800"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: tab.color.accent }}
            />
            <span>{tab.label}</span>
            <span className="text-xs font-medium text-gray-400">({tab.count})</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {items.map((item: AlertItem) => (
            <AlertCard key={item.id} item={item} />
          ))}
          {items.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-400">
              No hay alertas en esta categoría
            </p>
          )}
        </div>
      </div>
    </section>
  );
}