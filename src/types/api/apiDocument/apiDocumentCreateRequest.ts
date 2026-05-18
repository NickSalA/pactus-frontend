import type { ApiDocumentType, ApiDocumentState } from '../shared';
import type { ApiDocumentCompanyContractRequest } from './apiDocumentCompanyContractRequest';
import type { ApiDocumentLaborContractRequest } from './apiDocumentLaborContractRequest';
import type { ApiDocumentServiceItemRequest } from './apiDocumentServiceItemRequest';

export interface ApiDocumentCreateRequest {
  type?: string | null;
  contract_type?: ApiDocumentType | null;
  name?: string | null;
  client?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  form_data?: object;
  company_contract?: ApiDocumentCompanyContractRequest;
  labor_contract?: ApiDocumentLaborContractRequest;
  state?: ApiDocumentState | null;
  folder_id?: number | null;
  service_items?: ApiDocumentServiceItemRequest[];
}