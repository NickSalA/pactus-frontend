"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAlertCenterLabor,
  getAreaChartLabor,
  getRecentContractsLabor,
} from "@/lib/api";
import type {
  AlertCategory,
  AreaChartResponse,
  RecentContractResponse,
} from "@/types/api.types";

export function useDashboardHRPage() {
  const [areaChart, setAreaChart] = useState<AreaChartResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertCategory[]>([]);
  const [recentContracts, setRecentContracts] = useState<RecentContractResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [areaChartData, alertData, recentData] = await Promise.all([
        getAreaChartLabor(),
        getAlertCenterLabor(),
        getRecentContractsLabor(),
      ]);
      setAreaChart(areaChartData);
      setAlerts(alertData);
      setRecentContracts(recentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    areaChart,
    alerts,
    recentContracts,
    isLoading,
    error,
    reload: load,
  };
}