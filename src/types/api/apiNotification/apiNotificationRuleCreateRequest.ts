export interface ApiNotificationRuleCreateRequest {
  document_id?: number | null;
  days_before_due: number;
  is_active?: boolean;
}