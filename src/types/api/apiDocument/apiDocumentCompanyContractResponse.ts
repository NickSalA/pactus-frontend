import type { ApiDocumentCompanyContractRequest } from './apiDocumentCompanyContractRequest';

export interface ApiDocumentCompanyContractResponse extends ApiDocumentCompanyContractRequest {
  id: number;
  document_id: number;
  created_at: string;
  updated_at: string;
}