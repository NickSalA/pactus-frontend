import type { ApiDocumentType, ApiTemplateGenerationMode } from '../shared';

export interface ApiTemplateGenerateRequest {
  name?: string | null;
  description?: string | null;
  instructions?: string | null;
  jurisdiction?: string | null;
  document_type?: ApiDocumentType | null;
  format_code: string;
  generation_mode?: ApiTemplateGenerationMode;
}