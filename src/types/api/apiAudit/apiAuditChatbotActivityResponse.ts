import type { ApiAuditChatbotActivityAction } from './apiAuditChatbotActivityAction';

export interface ApiAuditChatbotActivityResponse {
  id: number;
  organization_id: number;
  actor_user_id: number;
  actor_name: string | null;
  actor_role: string;
  action: ApiAuditChatbotActivityAction;
  conversation_title: string | null;
  created_at: string;
}
