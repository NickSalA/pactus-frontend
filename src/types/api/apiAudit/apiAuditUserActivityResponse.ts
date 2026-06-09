import type { ApiAuditUserActivityAction } from './apiAuditUserActivityAction';

export interface ApiAuditUserActivityResponse {
  id: number;
  organization_id: number;
  actor_user_id: number;
  actor_name: string | null;
  actor_role: string;
  action: ApiAuditUserActivityAction;
  target_user_id: number | null;
  target_user_email: string | null;
  target_user_name: string | null;
  previous_role: string | null;
  role: string | null;
  created_at: string;
}
