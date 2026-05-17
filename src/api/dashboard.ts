import { apiGet } from "./axiosInstance";
import type {
  AlertCategory,
  AreaChartResponse,
  CurrencyType,
  RecentContractResponse,
  TopCompanyResponse,
  TopRankingSortBy,
  TopServiceResponse,
} from "@/types/api.types";

export async function getAreaChartCompany(currency?: CurrencyType): Promise<AreaChartResponse> {
  const query = currency ? `?currency=${currency}` : "";
  return apiGet<AreaChartResponse>(`/dashboard/area_chart/company${query}`);
}

export async function getAreaChartLabor(currency?: CurrencyType): Promise<AreaChartResponse> {
  const query = currency ? `?currency=${currency}` : "";
  return apiGet<AreaChartResponse>(`/dashboard/area_chart/labor${query}`);
}

export async function getAlertCenterCompany(): Promise<AlertCategory[]> {
  return apiGet<AlertCategory[]>("/dashboard/alert_center/company");
}

export async function getAlertCenterLabor(): Promise<AlertCategory[]> {
  return apiGet<AlertCategory[]>("/dashboard/alert_center/labor");
}

export async function getRecentContractsCompany(): Promise<RecentContractResponse[]> {
  return apiGet<RecentContractResponse[]>("/dashboard/recent_contracts/company");
}

export async function getRecentContractsLabor(): Promise<RecentContractResponse[]> {
  return apiGet<RecentContractResponse[]>("/dashboard/recent_contracts/labor");
}

export async function getTopCompanies(
  currency?: CurrencyType,
  sort_by?: TopRankingSortBy
): Promise<TopCompanyResponse[]> {
  const params = new URLSearchParams();
  if (currency) params.set("currency", currency);
  if (sort_by) params.set("sort_by", sort_by);
  const query = params.size > 0 ? `?${params.toString()}` : "";
  return apiGet<TopCompanyResponse[]>(`/dashboard/top_companies${query}`);
}

export async function getTopServices(
  currency?: CurrencyType,
  sort_by?: TopRankingSortBy
): Promise<TopServiceResponse[]> {
  const params = new URLSearchParams();
  if (currency) params.set("currency", currency);
  if (sort_by) params.set("sort_by", sort_by);
  const query = params.size > 0 ? `?${params.toString()}` : "";
  return apiGet<TopServiceResponse[]>(`/dashboard/top_services${query}`);
}