'use client';

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAlertCenterCompany,
  useAreaChartCompany,
  useRecentContractsCompany,
  useTopCompanies,
  useTopServices,
} from '@/queries/hooks/dashboard/queries';
import { buildRecentDocumentsFromAPI } from '@/features/admin/dashboard/lib/dashboard-data';
import type { RecentDashboardDocument } from '@/features/admin/dashboard/lib/dashboard-data';

export function useDashboardManagerPage() {
  const queryClient = useQueryClient();

  const {
    data: areaChart,
    isLoading: areaChartLoading,
    error: areaChartError,
  } = useAreaChartCompany();

  const {
    data: alerts,
    isLoading: alertsLoading,
    error: alertsError,
  } = useAlertCenterCompany();

  const {
    data: recentContractsRaw,
    isLoading: recentContractsLoading,
    error: recentContractsError,
  } = useRecentContractsCompany();

  const {
    data: topCompanies,
    isLoading: topCompaniesLoading,
    error: topCompaniesError,
  } = useTopCompanies();

  const {
    data: topServices,
    isLoading: topServicesLoading,
    error: topServicesError,
  } = useTopServices();

  const recentContracts = useMemo<RecentDashboardDocument[]>(
    () =>
      recentContractsRaw ? buildRecentDocumentsFromAPI(recentContractsRaw) : [],
    [recentContractsRaw],
  );

  const isLoading =
    areaChartLoading ||
    alertsLoading ||
    recentContractsLoading ||
    topCompaniesLoading ||
    topServicesLoading;

  const error =
    areaChartError ||
    alertsError ||
    recentContractsError ||
    topCompaniesError ||
    topServicesError;

  return {
    areaChart: areaChart ?? null,
    alerts: alerts ?? [],
    recentContracts,
    topCompanies: topCompanies ?? [],
    topServices: topServices ?? [],
    isLoading,
    error,
    reload: () => {
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  };
}
