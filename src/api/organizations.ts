import type {
  ApiOrganizationListResponse,
  ApiOrganizationProvisionRequest,
  ApiOrganizationResponse,
  ApiOrganizationUpdateRequest,
} from '@/types/api';
import { TIMEOUTS } from './constants';
import { apiDelete, apiGet, apiPatch, apiPost } from './axiosInstance';

export type OrganizationListFilters = {
  is_active?: boolean | null;
  limit?: number;
  name?: string | null;
  offset?: number;
  ruc?: string | null;
};

export async function listOrganizations(
  filters: OrganizationListFilters = {},
): Promise<ApiOrganizationListResponse> {
  return apiGet<ApiOrganizationListResponse>('/organizations', {
    params: filters,
    timeout: TIMEOUTS.DEFAULT,
  });
}

export async function createOrganization(
  payload: ApiOrganizationProvisionRequest,
): Promise<ApiOrganizationResponse> {
  return apiPost<ApiOrganizationResponse>('/organizations', payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function getMyOrganization(): Promise<ApiOrganizationResponse> {
  return apiGet<ApiOrganizationResponse>('/organizations/me', {
    timeout: TIMEOUTS.DEFAULT,
  });
}

export async function updateMyOrganization(
  payload: ApiOrganizationUpdateRequest,
): Promise<ApiOrganizationResponse> {
  return apiPatch<ApiOrganizationResponse>('/organizations/me', payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function getOrganization(
  organizationId: number,
): Promise<ApiOrganizationResponse> {
  return apiGet<ApiOrganizationResponse>(`/organizations/${organizationId}`, {
    timeout: TIMEOUTS.DEFAULT,
  });
}

export async function updateOrganization(
  organizationId: number,
  payload: ApiOrganizationUpdateRequest,
): Promise<ApiOrganizationResponse> {
  return apiPatch<ApiOrganizationResponse>(
    `/organizations/${organizationId}`,
    payload,
    { timeout: TIMEOUTS.AUTH },
  );
}

export async function deleteOrganization(organizationId: number): Promise<void> {
  await apiDelete<void>(`/organizations/${organizationId}`, {
    timeout: TIMEOUTS.AUTH,
  });
}
