import type {
  ApiTemplateResponse,
  ApiTemplateField,
  ApiTemplateUsage,
} from '@/types/api';
import { normalizeTemplateFieldType } from '@/lib/template-fields';

export const normalizeTemplateField = (
  field: ApiTemplateField,
): ApiTemplateField => ({
  key: field.key,
  label: field.label,
  type: normalizeTemplateFieldType(field.type),
  required: field.required ?? false,
  placeholder: field.placeholder ?? null,
});

export const normalizeTemplateUsage = (
  usage: ApiTemplateUsage | null | undefined,
): ApiTemplateUsage | null => {
  if (!usage) return null;
  return {
    input_tokens: usage.input_tokens ?? 0,
    output_tokens: usage.output_tokens ?? 0,
    total_tokens: usage.total_tokens ?? 0,
  };
};

export const normalizeTemplate = (
  apiTemplate: ApiTemplateResponse,
): ApiTemplateResponse => ({
  id: apiTemplate.id,
  organization_id: apiTemplate.organization_id,
  name: apiTemplate.name,
  description: apiTemplate.description ?? null,
  document_type:
    apiTemplate.document_type as ApiTemplateResponse['document_type'],
  template_format_id: apiTemplate.template_format_id ?? null,
  format_code: apiTemplate.format_code ?? null,
  format_label: apiTemplate.format_label ?? null,
  content: {
    body_md: apiTemplate.content.body_md,
    fields: apiTemplate.content.fields.map(normalizeTemplateField),
    operational_fields: apiTemplate.content.operational_fields?.map(
      normalizeTemplateField,
    ),
    version: apiTemplate.content.version ?? null,
    contract_date_mapping: apiTemplate.content.contract_date_mapping ?? null,
  },
  state: apiTemplate.state as ApiTemplateResponse['state'],
  created_at: apiTemplate.created_at ?? '',
});
