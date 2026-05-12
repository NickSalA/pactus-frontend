"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAlertCenterCompany,
  getAreaChartCompany,
  getRecentContractsCompany,
  getTopCompanies,
  getTopServices,
} from "@/lib/api";
import type {
  AlertCategory,
  AreaChartResponse,
  RecentContractResponse,
  TopCompanyResponse,
  TopServiceResponse,
} from "@/types/api.types";

export function useDashboardManagerPage() {
  const [areaChart, setAreaChart] = useState<AreaChartResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertCategory[]>([]);
  const [recentContracts, setRecentContracts] = useState<RecentContractResponse[]>([]);
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
      setRecentContracts(recentData);
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