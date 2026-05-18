import type { ApiTemplateContent } from './apiTemplateContent';

export interface ApiTemplateUpdateRequest {
  name?: string | null;
  description?: string | null;
  content?: ApiTemplateContent | null;
}