import type { ApiCurrencyType } from '../shared';
import type { ApiDocumentLaborContractRequest } from './apiDocumentLaborContractRequest';

export interface ApiDocumentLaborContractResponse extends ApiDocumentLaborContractRequest {
  id: number;
  document_id: number;
  created_at: string;
  updated_at: string;
}