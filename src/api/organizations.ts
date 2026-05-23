import type { OrganizationMember } from '@/types/ui.types';
import {
  ApiOrganizationListResponse,
  ApiOrganizationMemberNotificationsUpdateRequest,
  ApiOrganizationMemberCreateRequest,
  ApiOrganizationProvisionRequest,
  ApiOrganizationResponse,
  ApiOrganizationUpdateRequest,
} from '@/types/api';
import { TIMEOUTS } from './constants';
import { apiDelete, apiGet, apiPost, apiPatch } from './axiosInstance';

export type OrganizationListFilters = {
  is_active?: boolean | null;
  limit?: number;
  name?: string | null;
  offset?: number;
  ruc?: string | null;
};

const normalizeMember = (member: OrganizationMember): OrganizationMember => ({
  ...member,
  full_name: member.full_name ?? null,
  avatar_url: member.avatar_url ?? null,
  receives_notifications: member.receives_notifications ?? false,
  is_active: member.is_active ?? false,
});

export async function getOrganizationMembers(): Promise<OrganizationMember[]> {
  const members = await apiGet<OrganizationMember[]>(
    '/organizations/me/members',
    { timeout: TIMEOUTS.DEFAULT },
  );
  return members.map(normalizeMember);
}

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

export async function createOrganizationMember(
  payload: ApiOrganizationMemberCreateRequest,
): Promise<OrganizationMember> {
  const member = normalizeMember(
    await apiPost<OrganizationMember>('/organizations/me/members', payload, {
      timeout: TIMEOUTS.AUTH,
    }),
  );
  return member;
}

export async function updateOrganizationMemberNotifications(
  memberId: number,
  payload: ApiOrganizationMemberNotificationsUpdateRequest,
): Promise<OrganizationMember> {
  const member = normalizeMember(
    await apiPatch<OrganizationMember>(
      `/organizations/me/members/${memberId}/notifications`,
      payload,
      {
        timeout: TIMEOUTS.AUTH,
      },
    ),
  );
  return member;
}
