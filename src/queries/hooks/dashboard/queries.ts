import { useQuery } from '@tanstack/react-query';
import {
  getAlertCenterCompany,
  getAlertCenterLabor,
  getAreaChartCompany,
  getAreaChartLabor,
  getRecentContractsCompany,
  getRecentContractsLabor,
  getTopCompanies,
  getTopServices,
} from '@/api';
import { ApiTopRankingSortBy, ApiCurrencyType } from '@/types/api';

const DASHBOARD_KEY = ['dashboard'] as const;

export const useAreaChartCompany = (currency?: ApiCurrencyType) =>
  useQuery({
    queryKey: [...DASHBOARD_KEY, 'area-chart', 'company', currency],
    queryFn: () => getAreaChartCompany(currency),
  });

export const useAreaChartLabor = (currency?: ApiCurrencyType) =>
  useQuery({
    queryKey: [...DASHBOARD_KEY, 'area-chart', 'labor', currency],
    queryFn: () => getAreaChartLabor(currency),
  });

export const useAlertCenterCompany = () =>
  useQuery({
    queryKey: [...DASHBOARD_KEY, 'alert-center', 'company'],
    queryFn: () => getAlertCenterCompany(),
  });

export const useAlertCenterLabor = () =>
  useQuery({
    queryKey: [...DASHBOARD_KEY, 'alert-center', 'labor'],
    queryFn: () => getAlertCenterLabor(),
  });

export const useRecentContractsCompany = () =>
  useQuery({
    queryKey: [...DASHBOARD_KEY, 'recent-contracts', 'company'],
    queryFn: () => getRecentContractsCompany(),
  });

export const useRecentContractsLabor = () =>
  useQuery({
    queryKey: [...DASHBOARD_KEY, 'recent-contracts', 'labor'],
    queryFn: () => getRecentContractsLabor(),
  });

export const useTopCompanies = (
  currency?: ApiCurrencyType,
  sort_by?: ApiTopRankingSortBy,
) =>
  useQuery({
    queryKey: [...DASHBOARD_KEY, 'top-companies', currency, sort_by],
    queryFn: () => getTopCompanies(currency, sort_by),
  });

export const useTopServices = (
  currency?: ApiCurrencyType,
  sort_by?: ApiTopRankingSortBy,
) =>
  useQuery({
    queryKey: [...DASHBOARD_KEY, 'top-services', currency, sort_by],
    queryFn: () => getTopServices(currency, sort_by),
  });
