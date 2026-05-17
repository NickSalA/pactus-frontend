import type {
  Document,
  DocumentCreateRequest,
  DocumentFileUrlResponse,
  DocumentFolder,
  DocumentFolderCreateRequest,
  DocumentFolderUpdateRequest,
  DocumentFormData,
  DocumentServiceItem,
  DocumentUpdateRequest,
  ServiceCatalogItem,
  ServiceCatalogItemCreateRequest,
  ServiceCatalogItemUpdateRequest,
} from "@/types/api.types";
import { TIMEOUTS } from "./constants";
import { apiGet, apiPost, apiPatch, apiDelete } from "./axiosInstance";

const normalizeDocument = (document: Document): Document => ({
  ...document,
  form_data: (document.form_data ?? {}) as DocumentFormData,
  service_items: Array.isArray(document.service_items)
    ? document.service_items
    : ([] as DocumentServiceItem[]),
  file_path: document.file_path ?? null,
  file_name: document.file_name ?? null,
});

const appendDocumentPayload = (
  formData: FormData,
  data: {
    name?: string;
    client?: string;
    type?: Document["type"];
    start_date?: string;
    end_date?: string;
    form_data?: DocumentFormData;
    state?: Document["state"];
    folder_id?: number | null;
    service_items?: DocumentCreateRequest["service_items"];
  }
) => {
  formData.append("document", JSON.stringify(data));
};

export async function uploadDocument(data: DocumentCreateRequest): Promise<Document> {
  const formData = new FormData();
  formData.append("file", data.file);

  appendDocumentPayload(formData, {
    name: data.name,
    client: data.client,
    type: data.type,
    start_date: data.start_date,
    end_date: data.end_date,
    form_data: data.form_data,
    state: data.state,
    folder_id: data.folder_id,
    service_items: data.service_items ?? [],
  });

  const createdDocument = normalizeDocument(
    await apiPost<Document>("/documents/", formData, {
      timeout: TIMEOUTS.UPLOAD,
      headers: { "Content-Type": "multipart/form-data" },
    })
  );

  return createdDocument;
}

export async function getDocuments(): Promise<Document[]> {
  const documents = await apiGet<Document[]>("/documents/", { timeout: TIMEOUTS.DEFAULT });
  return documents.map(normalizeDocument);
}

export async function getServices(): Promise<ServiceCatalogItem[]> {
  return apiGet<ServiceCatalogItem[]>("/services", { timeout: TIMEOUTS.DEFAULT });
}

export async function getServicesAdmin(includeInactive: boolean = true): Promise<ServiceCatalogItem[]> {
  return apiGet<ServiceCatalogItem[]>(`/services?include_inactive=${includeInactive ? "true" : "false"}`, {
    timeout: TIMEOUTS.DEFAULT,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function createServiceCatalogItem(
  payload: ServiceCatalogItemCreateRequest
): Promise<ServiceCatalogItem> {
  return apiPost<ServiceCatalogItem>("/services", payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function updateServiceCatalogItem(
  serviceId: number,
  payload: ServiceCatalogItemUpdateRequest
): Promise<ServiceCatalogItem> {
  return apiPatch<ServiceCatalogItem>(`/services/${serviceId}`, payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function deleteServiceCatalogItem(serviceId: number): Promise<void> {
  return apiDelete(`/services/${serviceId}`, { timeout: TIMEOUTS.AUTH });
}

export async function getDocumentFolders(): Promise<DocumentFolder[]> {
  return apiGet<DocumentFolder[]>("/folders", {
    timeout: TIMEOUTS.DEFAULT,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function createDocumentFolder(payload: DocumentFolderCreateRequest): Promise<DocumentFolder> {
  return apiPost<DocumentFolder>("/folders", payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function updateDocumentFolder(
  folderId: number,
  payload: DocumentFolderUpdateRequest
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
  const response = await apiGet<DocumentFileUrlResponse>(`/documents/${id}/file-url`, {
    timeout: TIMEOUTS.DEFAULT,
  });

  return response.url;
}

export async function updateDocument(id: number, data: DocumentUpdateRequest): Promise<Document> {
  const formData = new FormData();

  if (data.file) {
    formData.append("file", data.file);
  }

  appendDocumentPayload(formData, {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.client !== undefined && { client: data.client }),
    ...(data.type !== undefined && { type: data.type }),
    ...(data.start_date !== undefined && { start_date: data.start_date }),
    ...(data.end_date !== undefined && { end_date: data.end_date }),
    ...(data.form_data !== undefined && { form_data: data.form_data }),
    ...(data.state !== undefined && { state: data.state }),
    ...(data.folder_id !== undefined && { folder_id: data.folder_id }),
    ...(data.service_items !== undefined && { service_items: data.service_items }),
  });

  const updatedDocument = normalizeDocument(
    await apiPatch<Document>(`/documents/${id}`, formData, {
      timeout: TIMEOUTS.UPLOAD,
      headers: { "Content-Type": "multipart/form-data" },
    })
  );

  return updatedDocument;
}