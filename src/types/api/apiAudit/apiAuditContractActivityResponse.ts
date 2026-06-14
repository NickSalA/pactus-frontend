import type { ApiAuditContractActivityAction } from './apiAuditContractActivityAction';

export interface ApiAuditContractActivityResponse {
  id: number;
  organization_id: number;
  actor_user_id: number;
  actor_name: string | null;
  actor_role: string;
  action: ApiAuditContractActivityAction;
  document_id: number | null;
  company_contract_id: number | null;
  labor_contract_id: number | null;
  document_name: string | null;
  document_type: string | null;
  previous_state: string | null;
  state: string | null;
  created_at: string;
}
