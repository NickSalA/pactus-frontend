export interface ApiNotificationRuleResponse {
  id: number;
  organization_id: number;
  document_id: number | null;
  days_before_due: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}