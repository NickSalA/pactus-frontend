import type {
  CompanyContractResponse,
  Document,
  DocumentCreateRequest,
  DocumentFileUrlResponse,
  DocumentFolder,
  DocumentFolderCreateRequest,
  DocumentFolderUpdateRequest,
  DocumentFormData,
  DocumentServiceItem,
  DocumentUpdateRequest,
  LaborContractResponse,
  ServiceCatalogItem,
  ServiceCatalogItemCreateRequest,
  ServiceCatalogItemUpdateRequest,
} from '@/types/api.types';
import { TIMEOUTS } from './constants';
import { apiGet, apiPost, apiPatch, apiDelete } from './axiosInstance';
import { ApiDocumentResponse, ApiDocumentType } from '@/types/api';

const normalizeDocument = (doc: ApiDocumentResponse): Document => {
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
      | CompanyContractResponse
      | undefined,
    labor_contract: doc.labor_contract as LaborContractResponse | undefined,
    created_at: doc.created_at ?? '',
    updated_at: doc.updated_at ?? '',
    client: client ?? '',
  };
};

const appendDocumentPayload = (
  formData: FormData,
  data: {
    contract_type?: Document['contract_type'];
    company_contract?: DocumentCreateRequest['company_contract'];
    labor_contract?: DocumentCreateRequest['labor_contract'];
    start_date?: string;
    end_date?: string;
    form_data?: DocumentFormData;
    state?: Document['state'];
    folder_id?: number | null;
    service_items?: DocumentCreateRequest['service_items'];
  },
) => {
  formData.append('document', JSON.stringify(data));
};

export async function uploadDocument(
  data: DocumentCreateRequest,
): Promise<Document> {
  const formData = new FormData();
  formData.append('file', data.file);

  appendDocumentPayload(formData, {
    contract_type: data.contract_type,
    company_contract: data.company_contract,
    labor_contract: data.labor_contract,
    form_data: data.form_data,
    state: data.state,
    folder_id: data.folder_id,
    service_items: data.service_items ?? [],
  });

  const createdDocument = normalizeDocument(
    await apiPost<Document>('/documents/', formData, {
      timeout: TIMEOUTS.UPLOAD,
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  );

  return createdDocument;
}

export async function getDocuments(): Promise<Document[]> {
  const documents = await apiGet<Document[]>('/documents/', {
    timeout: TIMEOUTS.DEFAULT,
  });
  return documents.map(normalizeDocument);
}

export async function getServices(): Promise<ServiceCatalogItem[]> {
  return apiGet<ServiceCatalogItem[]>('/services', {
    timeout: TIMEOUTS.DEFAULT,
  });
}

export async function getServicesAdmin(
  includeInactive: boolean = true,
): Promise<ServiceCatalogItem[]> {
  return apiGet<ServiceCatalogItem[]>(
    `/services?include_inactive=${includeInactive ? 'true' : 'false'}`,
    {
      timeout: TIMEOUTS.DEFAULT,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}

export async function createServiceCatalogItem(
  payload: ServiceCatalogItemCreateRequest,
): Promise<ServiceCatalogItem> {
  return apiPost<ServiceCatalogItem>('/services', payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function updateServiceCatalogItem(
  serviceId: number,
  payload: ServiceCatalogItemUpdateRequest,
): Promise<ServiceCatalogItem> {
  return apiPatch<ServiceCatalogItem>(`/services/${serviceId}`, payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function deleteServiceCatalogItem(
  serviceId: number,
): Promise<void> {
  return apiDelete(`/services/${serviceId}`, { timeout: TIMEOUTS.AUTH });
}

export async function getDocumentFolders(): Promise<DocumentFolder[]> {
  return apiGet<DocumentFolder[]>('/folders', {
    timeout: TIMEOUTS.DEFAULT,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function createDocumentFolder(
  payload: DocumentFolderCreateRequest,
): Promise<DocumentFolder> {
  return apiPost<DocumentFolder>('/folders', payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function updateDocumentFolder(
  folderId: number,
  payload: DocumentFolderUpdateRequest,
): Promise<DocumentFolder> {
  return apiPatch<DocumentFolder>(`/folders/${folderId}`, payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function deleteDocumentFolder(folderId: number): Promise<void> {
  return apiDelete(`/folders/${folderId}`, { timeout: TIMEOUTS.AUTH });
}

export async function deleteDocument(id: number): Promise<void> {
  return apiDelete(`/documents/${id}`, { timeout: TIMEOUTS.AUTH });
}

export async function getDocumentById(id: number): Promise<Document> {
  const document = await apiGet<Document>(`/documents/${id}`, {
    timeout: TIMEOUTS.DEFAULT,
  });

  return normalizeDocument(document);
}

export async function getDocumentFileUrl(id: number): Promise<string> {
  const response = await apiGet<DocumentFileUrlResponse>(
    `/documents/${id}/file-url`,
    {
      timeout: TIMEOUTS.DEFAULT,
    },
  );

  return response.url;
}

export async function updateDocument(
  id: number,
  data: DocumentUpdateRequest,
): Promise<Document> {
  const formData = new FormData();

  if (data.file) {
    formData.append('file', data.file);
  }

  appendDocumentPayload(formData, {
    ...(data.contract_type !== undefined && {
      contract_type: data.contract_type,
    }),
    ...(data.company_contract !== undefined && {
      company_contract: data.company_contract,
    }),
    ...(data.labor_contract !== undefined && {
      labor_contract: data.labor_contract,
    }),
    ...(data.form_data !== undefined && { form_data: data.form_data }),
    ...(data.state !== undefined && { state: data.state }),
    ...(data.folder_id !== undefined && { folder_id: data.folder_id }),
    ...(data.service_items !== undefined && {
      service_items: data.service_items,
    }),
  });

  const updatedDocument = normalizeDocument(
    await apiPatch<Document>(`/documents/${id}`, formData, {
      timeout: TIMEOUTS.UPLOAD,
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  );

  return updatedDocument;
}
