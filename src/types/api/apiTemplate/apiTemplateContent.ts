import type { ApiTemplateField } from './apiTemplateField';
import type { ApiTemplateContractDateMapping } from './apiTemplateContractDateMapping';

export interface ApiTemplateContent {
  body_md: string;
  fields: ApiTemplateField[];
  operational_fields?: ApiTemplateField[];
  version?: string | null;
  contract_date_mapping?: ApiTemplateContractDateMapping | null;
}