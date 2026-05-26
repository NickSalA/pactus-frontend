import type { ApiDocumentType, ApiTemplateState } from '../shared';
import type { ApiTemplateContent } from './apiTemplateContent';

export interface ApiTemplateResponse {
  id: number;
  organization_id: number;
  name: string;
  description: string | null;
  document_type: ApiDocumentType;
  template_format_id: number | null;
  format_code: string | null;
  format_label: string | null;
  content: ApiTemplateContent;
  created_at: string | null;
  state: ApiTemplateState;
}