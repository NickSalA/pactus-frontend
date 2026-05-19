import type { Session } from '@supabase/supabase-js';
import {
  mapBackendUserToAuthUser,
  mapSupabaseUserToAuthUser,
  type AuthDisplayUser,
} from '@/lib/authUser';
import { apiGet } from '@/api/axiosInstance';
import { User } from '@/types/ui.types';
import { TIMEOUTS } from '@/api';

// TODO Reubicate function
export async function getCurrentUser(): Promise<User> {
  return apiGet<User>('/user/me', { timeout: TIMEOUTS.DEFAULT });
}

export const resolveSessionUser = async (
  session: Session,
): Promise<AuthDisplayUser> => {
  try {
    const backendUser = await getCurrentUser();
    return mapBackendUserToAuthUser(backendUser);
  } catch {
    return mapSupabaseUserToAuthUser(session.user);
  }
};
