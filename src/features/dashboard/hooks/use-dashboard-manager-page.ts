"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAlertCenterCompany,
  getAreaChartCompany,
  getRecentContractsCompany,
  getTopCompanies,
  getTopServices,
} from "@/lib/api";
import { buildRecentDocumentsFromAPI } from "@/features/dashboard/lib/dashboard-data";
import type { RecentDashboardDocument } from "@/features/dashboard/lib/dashboard-data";
import type {
  AlertCategory,
  AreaChartResponse,
  TopCompanyResponse,
  TopServiceResponse,
} from "@/types/api.types";

export function useDashboardManagerPage() {
  const [areaChart, setAreaChart] = useState<AreaChartResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertCategory[]>([]);
  const [recentContracts, setRecentContracts] = useState<RecentDashboardDocument[]>([]);
  const [topCompanies, setTopCompanies] = useState<TopCompanyResponse[]>([]);
  const [topServices, setTopServices] = useState<TopServiceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [areaChartData, alertData, recentData, topCompaniesData, topServicesData] = await Promise.all([
        getAreaChartCompany(),
        getAlertCenterCompany(),
        getRecentContractsCompany(),
        getTopCompanies(),
        getTopServices(),
      ]);
      setAreaChart(areaChartData);
      setAlerts(alertData);
      setRecentContracts(buildRecentDocumentsFromAPI(recentData));
      setTopCompanies(topCompaniesData);
      setTopServices(topServicesData);
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
    topCompanies,
    topServices,
    isLoading,
    error,
    reload: load,
  };
}