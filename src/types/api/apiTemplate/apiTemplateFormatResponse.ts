import type { ApiDocumentType } from '../shared';

export interface ApiTemplateFormatResponse {
  id: number;
  document_type: ApiDocumentType;
  format_code: string;
  label: string;
  default_name: string;
  default_description?: string | null;
}