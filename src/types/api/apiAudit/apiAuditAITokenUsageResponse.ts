import type { ApiAuditAITokenUsageSource } from './apiAuditAITokenUsageSource';

export interface ApiAuditAITokenUsageResponse {
  id: number;
  organization_id: number;
  actor_user_id: number;
  source: ApiAuditAITokenUsageSource;
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  input_cost_usd: number | null;
  output_cost_usd: number | null;
  total_cost_usd: number | null;
  model_used: string | null;
  created_at: string;
}
