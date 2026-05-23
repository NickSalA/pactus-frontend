import type { ApiTemplateResponse } from './apiTemplateResponse';
import type { ApiTemplateUsage } from './apiTemplateUsage';

export interface ApiTemplatePersistedDraftResponse {
  template: ApiTemplateResponse;
  warnings: string[];
  source: object;
  usage?: ApiTemplateUsage | null;
}