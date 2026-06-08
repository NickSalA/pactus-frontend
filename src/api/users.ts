import type { OrganizationMember } from '@/types/ui.types';
import type { ApiUserResponse, ApiUserUpdateRequest } from '@/types/api';
import { TIMEOUTS } from './constants';
import { apiDelete, apiGet, apiPatch } from './axiosInstance';

const normalizeUser = (user: OrganizationMember): OrganizationMember => ({
  ...user,
  full_name: user.full_name ?? null,
  avatar_url: user.avatar_url ?? null,
  receives_notifications: user.receives_notifications ?? false,
  is_active: user.is_active ?? false,
});

export async function getMe(): Promise<ApiUserResponse> {
  return apiGet<ApiUserResponse>('/user/me', { timeout: TIMEOUTS.DEFAULT });
}

export async function updateUser(
  userId: number,
  payload: ApiUserUpdateRequest,
): Promise<OrganizationMember> {
  return normalizeUser(
    await apiPatch<OrganizationMember>(`/user/${userId}`, payload, {
      timeout: TIMEOUTS.AUTH,
    }),
  );
}

export async function deleteUser(userId: number): Promise<void> {
  await apiDelete<void>(`/user/${userId}`, { timeout: TIMEOUTS.AUTH });
}
