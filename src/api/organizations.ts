import type { OrganizationMember } from '@/types/api.types';
import {
  ApiOrganizationMemberNotificationsUpdateRequest,
  ApiOrganizationMemberCreateRequest,
} from '@/types/api';
import { TIMEOUTS } from './constants';
import { apiGet, apiPost, apiPatch } from './axiosInstance';

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
