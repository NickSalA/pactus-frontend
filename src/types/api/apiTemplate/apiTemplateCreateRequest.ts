import type { ApiDocumentType } from '../shared';
import type { ApiTemplateContent } from './apiTemplateContent';

export interface ApiTemplateCreateRequest {
  name?: string | null;
  description?: string | null;
  document_type?: ApiDocumentType | null;
  format_code: string;
  content: ApiTemplateContent;
}