import type { Session } from '@supabase/supabase-js';
import {
  mapBackendUserToAuthUser,
  mapSupabaseUserToAuthUser,
  type AuthDisplayUser,
} from '@/lib/authUser';

export const resolveSessionUser = async (
  session: Session,
): Promise<AuthDisplayUser> => {
  return mapSupabaseUserToAuthUser(session.user);
};
