import type { ApiDocumentState } from '../shared';
import type { ApiDocumentCompanyContractResponse } from './apiDocumentCompanyContractResponse';
import { ApiDocumentFormData } from './apiDocumentFormData';
import type { ApiDocumentLaborContractResponse } from './apiDocumentLaborContractResponse';
import type { ApiDocumentServiceItemResponse } from './apiDocumentServiceItemResponse';

export interface ApiDocumentResponse {
  id: number;
  type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  form_data?: ApiDocumentFormData;
  state?: ApiDocumentState | null;
  folder_id?: number | null;
  file_path?: string | null;
  file_name?: string | null;
  service_items?: ApiDocumentServiceItemResponse[];
  company_contract?: ApiDocumentCompanyContractResponse | null;
  labor_contract?: ApiDocumentLaborContractResponse | null;
  created_at: string;
  updated_at: string;
}
