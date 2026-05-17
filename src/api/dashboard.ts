import { fetchAPI } from "./fetch-client";
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
  return fetchAPI<AreaChartResponse>(`/dashboard/area_chart/company${query}`, { method: "GET" });
}

export async function getAreaChartLabor(currency?: CurrencyType): Promise<AreaChartResponse> {
  const query = currency ? `?currency=${currency}` : "";
  return fetchAPI<AreaChartResponse>(`/dashboard/area_chart/labor${query}`, { method: "GET" });
}

export async function getAlertCenterCompany(): Promise<AlertCategory[]> {
  return fetchAPI<AlertCategory[]>("/dashboard/alert_center/company", { method: "GET" });
}

export async function getAlertCenterLabor(): Promise<AlertCategory[]> {
  return fetchAPI<AlertCategory[]>("/dashboard/alert_center/labor", { method: "GET" });
}

export async function getRecentContractsCompany(): Promise<RecentContractResponse[]> {
  return fetchAPI<RecentContractResponse[]>("/dashboard/recent_contracts/company", { method: "GET" });
}

export async function getRecentContractsLabor(): Promise<RecentContractResponse[]> {
  return fetchAPI<RecentContractResponse[]>("/dashboard/recent_contracts/labor", { method: "GET" });
}

export async function getTopCompanies(
  currency?: CurrencyType,
  sort_by?: TopRankingSortBy,
): Promise<TopCompanyResponse[]> {
  const params = new URLSearchParams();
  if (currency) params.set("currency", currency);
  if (sort_by) params.set("sort_by", sort_by);
  const query = params.size > 0 ? `?${params.toString()}` : "";
  return fetchAPI<TopCompanyResponse[]>(`/dashboard/top_companies${query}`, { method: "GET" });
}

export async function getTopServices(
  currency?: CurrencyType,
  sort_by?: TopRankingSortBy,
): Promise<TopServiceResponse[]> {
  const params = new URLSearchParams();
  if (currency) params.set("currency", currency);
  if (sort_by) params.set("sort_by", sort_by);
  const query = params.size > 0 ? `?${params.toString()}` : "";
  return fetchAPI<TopServiceResponse[]>(`/dashboard/top_services${query}`, { method: "GET" });
}