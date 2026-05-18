import type { ApiCurrencyType } from '../shared';

export interface ApiDocumentLaborContractRequest {
  worker_name?: string | null;
  worker_document_number?: string | null;
  position?: string | null;
  salary_value?: number | null;
  salary_currency?: ApiCurrencyType | null;
  salary_periodicity?: string | null;
  contract_modality?: string | null;
}