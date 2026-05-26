import type { ApiUserRole } from '../shared';

export interface ApiUserResponse {
  id: number;
  organization_id: number;
  supabase_user_id: string | null;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: ApiUserRole;
  receives_notifications: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}