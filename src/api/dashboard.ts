import { apiGet } from './axiosInstance';
import type { CurrencyType } from '@/types/api.types';

import {
  ApiDashboardAlertCategory,
  ApiDashboardAreaChartResponse,
  ApiDashboardRecentContractResponse,
  ApiDashboardTopCompanyResponse,
  ApiDashboardTopServiceResponse,
  ApiTopRankingSortBy,
} from '@/types/api';

export async function getAreaChartCompany(
  currency?: CurrencyType,
): Promise<ApiDashboardAreaChartResponse> {
  const query = currency ? `?currency=${currency}` : '';
  return apiGet<ApiDashboardAreaChartResponse>(
    `/dashboard/area_chart/company${query}`,
  );
}

export async function getAreaChartLabor(
  currency?: CurrencyType,
): Promise<ApiDashboardAreaChartResponse> {
  const query = currency ? `?currency=${currency}` : '';
  return apiGet<ApiDashboardAreaChartResponse>(
    `/dashboard/area_chart/labor${query}`,
  );
}

export async function getAlertCenterCompany(): Promise<
  ApiDashboardAlertCategory[]
> {
  return apiGet<ApiDashboardAlertCategory[]>('/dashboard/alert_center/company');
}

export async function getAlertCenterLabor(): Promise<
  ApiDashboardAlertCategory[]
> {
  return apiGet<ApiDashboardAlertCategory[]>('/dashboard/alert_center/labor');
}

export async function getRecentContractsCompany(): Promise<
  ApiDashboardRecentContractResponse[]
> {
  return apiGet<ApiDashboardRecentContractResponse[]>(
    '/dashboard/recent_contracts/company',
  );
}

export async function getRecentContractsLabor(): Promise<
  ApiDashboardRecentContractResponse[]
> {
  return apiGet<ApiDashboardRecentContractResponse[]>(
    '/dashboard/recent_contracts/labor',
  );
}

export async function getTopCompanies(
  currency?: CurrencyType,
  sort_by?: ApiTopRankingSortBy,
): Promise<ApiDashboardTopCompanyResponse[]> {
  const params = new URLSearchParams();
  if (currency) params.set('currency', currency);
  if (sort_by) params.set('sort_by', sort_by);
  const query = params.size > 0 ? `?${params.toString()}` : '';
  return apiGet<ApiDashboardTopCompanyResponse[]>(
    `/dashboard/top_companies${query}`,
  );
}

export async function getTopServices(
  currency?: CurrencyType,
  sort_by?: ApiTopRankingSortBy,
): Promise<ApiDashboardTopServiceResponse[]> {
  const params = new URLSearchParams();
  if (currency) params.set('currency', currency);
  if (sort_by) params.set('sort_by', sort_by);
  const query = params.size > 0 ? `?${params.toString()}` : '';
  return apiGet<ApiDashboardTopServiceResponse[]>(
    `/dashboard/top_services${query}`,
  );
}
