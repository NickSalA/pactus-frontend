import type { ApiUserRole } from '../shared';

export interface ApiFolderResponse {
  id: number;
  organization_id: number;
  name: string;
  owner_role: ApiUserRole;
  created_by: number;
  created_by_name: string | null;
  created_by_email: string | null;
  documents_count: number;
  created_at: string;
  updated_at: string;
}