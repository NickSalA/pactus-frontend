import type { ApiAuditTemplateActivityAction } from './apiAuditTemplateActivityAction';

export interface ApiAuditTemplateActivityResponse {
  id: number;
  organization_id: number;
  actor_user_id: number;
  actor_name: string | null;
  actor_role: string;
  action: ApiAuditTemplateActivityAction;
  template_id: number | null;
  template_format_id: number | null;
  template_name: string | null;
  document_type: string | null;
  previous_state: string | null;
  state: string | null;
  created_at: string;
}
