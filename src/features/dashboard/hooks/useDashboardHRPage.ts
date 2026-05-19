'use client';

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAlertCenterLabor,
  useAreaChartLabor,
  useRecentContractsLabor,
} from '@/queries/hooks/dashboard/queries';
import { buildRecentDocumentsFromAPI } from '@/features/dashboard/lib/dashboard-data';
import type { RecentDashboardDocument } from '@/features/dashboard/lib/dashboard-data';

export function useDashboardHRPage() {
  const queryClient = useQueryClient();

  const {
    data: areaChart,
    isLoading: areaChartLoading,
    error: areaChartError,
  } = useAreaChartLabor();

  const {
    data: alerts,
    isLoading: alertsLoading,
    error: alertsError,
  } = useAlertCenterLabor();

  const {
    data: recentContractsRaw,
    isLoading: recentContractsLoading,
    error: recentContractsError,
  } = useRecentContractsLabor();

  const recentContracts = useMemo<RecentDashboardDocument[]>(
    () =>
      recentContractsRaw ? buildRecentDocumentsFromAPI(recentContractsRaw) : [],
    [recentContractsRaw],
  );

  const isLoading = areaChartLoading || alertsLoading || recentContractsLoading;

  const error = areaChartError || alertsError || recentContractsError;

  return {
    areaChart: areaChart ?? null,
    alerts: alerts ?? [],
    recentContracts,
    isLoading,
    error,
    reload: () => {
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  };
}
