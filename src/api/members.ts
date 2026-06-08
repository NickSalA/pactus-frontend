import type { OrganizationMember } from '@/types/ui.types';
import type {
  ApiOrganizationMemberCreateRequest,
  ApiOrganizationMemberNotificationsUpdateRequest,
  ApiUserUpdateRequest,
} from '@/types/api';
import { TIMEOUTS } from './constants';
import { apiGet, apiPatch, apiPost } from './axiosInstance';
import { deleteUser, updateUser } from './users';

const normalizeMember = (member: OrganizationMember): OrganizationMember => ({
  ...member,
  full_name: member.full_name ?? null,
  avatar_url: member.avatar_url ?? null,
  receives_notifications: member.receives_notifications ?? false,
  is_active: member.is_active ?? false,
});

export async function getMembers(): Promise<OrganizationMember[]> {
  const members = await apiGet<OrganizationMember[]>(
    '/organizations/me/members',
    { timeout: TIMEOUTS.DEFAULT },
  );
  return members.map(normalizeMember);
}

export async function createMember(
  payload: ApiOrganizationMemberCreateRequest,
): Promise<OrganizationMember> {
  return normalizeMember(
    await apiPost<OrganizationMember>('/organizations/me/members', payload, {
      timeout: TIMEOUTS.AUTH,
    }),
  );
}

export const updateMemberRole = (
  memberId: number,
  payload: ApiUserUpdateRequest,
): Promise<OrganizationMember> => updateUser(memberId, payload);

export async function updateMemberNotifications(
  memberId: number,
  payload: ApiOrganizationMemberNotificationsUpdateRequest,
): Promise<OrganizationMember> {
  return normalizeMember(
    await apiPatch<OrganizationMember>(
      `/organizations/me/members/${memberId}/notifications`,
      payload,
      { timeout: TIMEOUTS.AUTH },
    ),
  );
}

export const deleteMember = (userId: number): Promise<void> =>
  deleteUser(userId);
