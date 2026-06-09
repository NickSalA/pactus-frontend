import type { ApiAuditChatbotActivityAction } from './apiAuditChatbotActivityAction';

export interface ApiAuditChatbotActivityResponse {
  id: number;
  organization_id: number;
  actor_user_id: number;
  actor_name: string | null;
  actor_role: string;
  action: ApiAuditChatbotActivityAction;
  conversation_id: number | null;
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  input_cost_usd: number | null;
  output_cost_usd: number | null;
  total_cost_usd: number | null;
  model_used: string | null;
  created_at: string;
}
