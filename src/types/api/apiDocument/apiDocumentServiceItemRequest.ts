import type { ApiCurrencyType } from '../shared';

export interface ApiDocumentServiceItemRequest {
  service_id: number;
  description?: string | null;
  value: number;
  currency: ApiCurrencyType;
  start_date: string;
  end_date: string;
}