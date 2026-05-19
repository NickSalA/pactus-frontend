import type { DocumentFlatten } from '@/types/api.types';
import type { ApiDocumentResponse, ApiDocumentType } from '@/types/api';
import type {
  ApiDocumentCompanyContractResponse,
  ApiDocumentLaborContractResponse,
} from '@/types/api';

export const normalizeDocument = (
  doc: ApiDocumentResponse,
): DocumentFlatten => {
  const hasCompanyContract = Boolean(doc.company_contract);
  const hasLaborContract = Boolean(doc.labor_contract);

  const contract_type = hasLaborContract
    ? 'LABOR'
    : hasCompanyContract
      ? 'COMPANY'
      : undefined;

  const client = hasLaborContract
    ? doc.labor_contract?.worker_name
    : hasCompanyContract
      ? doc.company_contract?.client
      : undefined;

  return {
    id: doc.id,
    name: doc.type + ' - ' + doc.id,
    type: doc.type as ApiDocumentType,
    contract_type: contract_type ?? 'COMPANY',
    start_date: doc.start_date ?? '',
    end_date: doc.end_date ?? '',
    form_data: doc.form_data ?? {},
    state: doc.state ?? 'DRAFT',
    service_items: Array.isArray(doc.service_items) ? doc.service_items : [],
    folder_id: doc.folder_id ?? null,
    file_path: doc.file_path ?? null,
    file_name: doc.file_name ?? null,
    company_contract: doc.company_contract as
      | ApiDocumentCompanyContractResponse
      | undefined,
    labor_contract: doc.labor_contract as
      | ApiDocumentLaborContractResponse
      | undefined,
    created_at: doc.created_at ?? '',
    updated_at: doc.updated_at ?? '',
    client: client ?? '',
  };
};
