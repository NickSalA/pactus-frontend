import type { ApiNotificationType } from '../shared';

export interface ApiNotificationResponse {
  id: string;
  document_id: number;
  type: ApiNotificationType;
  title: string;
  description: string;
  days_remaining: number;
}