import type { ApiDocumentType } from '../shared';
import type { ApiTemplateContent } from './apiTemplateContent';

export interface ApiTemplatePreviewRequest {
  document_type?: ApiDocumentType | null;
  format_code: string;
  content: ApiTemplateContent;
  sample_data?: object;
}