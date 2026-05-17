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
import { createCacheEntry, hasFreshCache, type CacheEntry } from "./cache";
import { DOCUMENTS_CACHE_TTL_MS, TIMEOUTS } from "./constants";
import { fetchAPI, fetchWithFormData } from "./fetch-client";
import { onApiSessionChange } from "./token-store";

let documentsCache: CacheEntry<Document[]> | null = null;
let documentsInFlight: Promise<Document[]> | null = null;
let servicesCache: CacheEntry<ServiceCatalogItem[]> | null = null;
let servicesInFlight: Promise<ServiceCatalogItem[]> | null = null;
let foldersCache: CacheEntry<DocumentFolder[]> | null = null;
let foldersInFlight: Promise<DocumentFolder[]> | null = null;

const resetDocumentsCache = () => {
  documentsCache = null;
  documentsInFlight = null;
};

const resetServicesCache = () => {
  servicesCache = null;
  servicesInFlight = null;
};

const resetFoldersCache = () => {
  foldersCache = null;
  foldersInFlight = null;
};

const resetDocumentApiState = () => {
  resetDocumentsCache();
  resetServicesCache();
  resetFoldersCache();
};

const updateFoldersCache = (updater: (folders: DocumentFolder[]) => DocumentFolder[]) => {
  if (!foldersCache) {
    return;
  }

  foldersCache = createCacheEntry(updater(foldersCache.data));
};

onApiSessionChange(resetDocumentApiState);

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
  },
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
    await fetchWithFormData<Document>("/documents/", "POST", formData, TIMEOUTS.UPLOAD),
  );

  resetDocumentsCache();
  resetFoldersCache();
  resetServicesCache();
  return createdDocument;
}

export async function getDocuments(): Promise<Document[]> {
  if (hasFreshCache(documentsCache, DOCUMENTS_CACHE_TTL_MS)) {
    return documentsCache.data;
  }

  if (documentsInFlight) {
    return documentsInFlight;
  }

  documentsInFlight = fetchAPI<Document[]>(
    "/documents/",
    {
      method: "GET",
    },
    TIMEOUTS.DEFAULT,
  )
    .then((documents) => {
      const normalizedDocuments = documents.map(normalizeDocument);
      documentsCache = createCacheEntry(normalizedDocuments);
      return normalizedDocuments;
    })
    .finally(() => {
      documentsInFlight = null;
    });

  return documentsInFlight;
}

export async function getServices(): Promise<ServiceCatalogItem[]> {
  if (hasFreshCache(servicesCache, DOCUMENTS_CACHE_TTL_MS)) {
    return servicesCache.data;
  }

  if (servicesInFlight) {
    return servicesInFlight;
  }

  servicesInFlight = fetchAPI<ServiceCatalogItem[]>(
    "/services",
    {
      method: "GET",
    },
    TIMEOUTS.DEFAULT,
  )
    .then((services) => {
      servicesCache = createCacheEntry(services);
      return services;
    })
    .finally(() => {
      servicesInFlight = null;
    });

  return servicesInFlight;
}

export async function getServicesAdmin(includeInactive: boolean = true): Promise<ServiceCatalogItem[]> {
  return fetchAPI<ServiceCatalogItem[]>(
    `/services?include_inactive=${includeInactive ? "true" : "false"}`,
    { method: "GET", cache: "no-store" },
    TIMEOUTS.DEFAULT,
  );
}

export async function createServiceCatalogItem(
  payload: ServiceCatalogItemCreateRequest,
): Promise<ServiceCatalogItem> {
  const service = await fetchAPI<ServiceCatalogItem>(
    "/services",
    { method: "POST", body: JSON.stringify(payload) },
    TIMEOUTS.AUTH,
  );

  resetServicesCache();
  return service;
}

export async function updateServiceCatalogItem(
  serviceId: number,
  payload: ServiceCatalogItemUpdateRequest,
): Promise<ServiceCatalogItem> {
  const service = await fetchAPI<ServiceCatalogItem>(
    `/services/${serviceId}`,
    { method: "PATCH", body: JSON.stringify(payload) },
    TIMEOUTS.AUTH,
  );

  resetServicesCache();
  return service;
}

export async function deleteServiceCatalogItem(serviceId: number): Promise<void> {
  const result = await fetchAPI<void>(`/services/${serviceId}`, { method: "DELETE" }, TIMEOUTS.AUTH);
  resetServicesCache();
  return result;
}

export async function getDocumentFolders(): Promise<DocumentFolder[]> {
  if (hasFreshCache(foldersCache, DOCUMENTS_CACHE_TTL_MS)) {
    return foldersCache.data;
  }

  if (foldersInFlight) {
    return foldersInFlight;
  }

  foldersInFlight = fetchAPI<DocumentFolder[]>(
    "/folders",
    { method: "GET", cache: "no-store" },
    TIMEOUTS.DEFAULT,
  )
    .then((folders) => {
      foldersCache = createCacheEntry(folders);
      return folders;
    })
    .finally(() => {
      foldersInFlight = null;
    });

  return foldersInFlight;
}

export async function createDocumentFolder(payload: DocumentFolderCreateRequest): Promise<DocumentFolder> {
  const folder = await fetchAPI<DocumentFolder>(
    "/folders",
    { method: "POST", body: JSON.stringify(payload) },
    TIMEOUTS.AUTH,
  );

  if (foldersCache) {
    updateFoldersCache((previousFolders) =>
      [...previousFolders, folder].sort((left, right) => left.name.localeCompare(right.name, "es")),
    );
  }

  return folder;
}

export async function updateDocumentFolder(
  folderId: number,
  payload: DocumentFolderUpdateRequest,
): Promise<DocumentFolder> {
  const folder = await fetchAPI<DocumentFolder>(
    `/folders/${folderId}`,
    { method: "PATCH", body: JSON.stringify(payload) },
    TIMEOUTS.AUTH,
  );

  updateFoldersCache((previousFolders) =>
    previousFolders
      .map((currentFolder) => (currentFolder.id === folder.id ? folder : currentFolder))
      .sort((left, right) => left.name.localeCompare(right.name, "es")),
  );
  return folder;
}

export async function deleteDocumentFolder(folderId: number): Promise<void> {
  const result = await fetchAPI<void>(`/folders/${folderId}`, { method: "DELETE" }, TIMEOUTS.AUTH);
  updateFoldersCache((previousFolders) => previousFolders.filter((folder) => folder.id !== folderId));
  return result;
}

export async function deleteDocument(id: number): Promise<void> {
  const result = await fetchAPI<void>(
    `/documents/${id}`,
    {
      method: "DELETE",
    },
    TIMEOUTS.AUTH,
  );

  resetDocumentApiState();
  return result;
}

export async function getDocumentById(id: number): Promise<Document> {
  const document = await fetchAPI<Document>(
    `/documents/${id}`,
    {
      method: "GET",
    },
    TIMEOUTS.DEFAULT,
  );

  return normalizeDocument(document);
}

export async function getDocumentFileUrl(id: number): Promise<string> {
  const response = await fetchAPI<DocumentFileUrlResponse>(
    `/documents/${id}/file-url`,
    {
      method: "GET",
    },
    TIMEOUTS.DEFAULT,
  );

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
    await fetchWithFormData<Document>(`/documents/${id}`, "PATCH", formData, TIMEOUTS.UPLOAD),
  );

  resetDocumentsCache();
  resetFoldersCache();
  resetServicesCache();
  return updatedDocument;
}
