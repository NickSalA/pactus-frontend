import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createDocumentFolder,
  createServiceCatalogItem,
  deleteDocument,
  deleteDocumentFolder,
  deleteServiceCatalogItem,
  importGoogleDriveFiles,
  updateDocument,
  updateDocumentFolder,
  updateServiceCatalogItem,
  uploadDocument,
} from '@/api';
import type {
  ApiDocumentCreateRequest,
  ApiDocumentMultipartCreateRequest,
  ApiDocumentMultipartUpdateRequest,
  ApiFolderCreateRequest,
  ApiFolderUpdateRequest,
  ApiServiceCreateRequest,
  ApiServiceResponse,
  ApiServiceUpdateRequest,
} from '@/types/api';
import type { GooglePickerFile } from '@/lib/googlePicker';
import type { DocumentFlatten, DocumentFolder } from '@/types/ui.types';

const CONTRACTS_KEY = ['contracts'] as const;
const FOLDERS_KEY = [...CONTRACTS_KEY, 'folders'] as const;
const SERVICES_ADMIN_KEY = [...CONTRACTS_KEY, 'services-admin'] as const;

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApiDocumentMultipartCreateRequest) =>
      uploadDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTRACTS_KEY });
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: ApiDocumentMultipartUpdateRequest;
    }) => updateDocument(id, data),
    onSuccess: (document) => {
      queryClient.setQueryData<DocumentFlatten>(
        [...CONTRACTS_KEY, document.id] as const,
        document,
      );
      queryClient.invalidateQueries({ queryKey: CONTRACTS_KEY });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTRACTS_KEY });
    },
  });
};

export const useCreateDocumentFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApiFolderCreateRequest) =>
      createDocumentFolder(payload),
    onSuccess: (folder) => {
      queryClient.setQueryData<DocumentFolder[]>(FOLDERS_KEY, (old) =>
        old ? [...old, folder] : [folder],
      );
    },
  });
};

export const useUpdateDocumentFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      folderId,
      payload,
    }: {
      folderId: number;
      payload: ApiFolderUpdateRequest;
    }) => updateDocumentFolder(folderId, payload),
    onSuccess: (updatedFolder) => {
      queryClient.setQueryData<DocumentFolder[]>(FOLDERS_KEY, (old) =>
        old?.map((f) => (f.id === updatedFolder.id ? updatedFolder : f)),
      );
    },
  });
};

export const useDeleteDocumentFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folderId: number) => deleteDocumentFolder(folderId),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<DocumentFolder[]>(FOLDERS_KEY, (old) =>
        old?.filter((f) => f.id !== deletedId),
      );
    },
  });
};

export const useImportGoogleDriveFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accessToken,
      document,
      files,
      folderId,
    }: {
      accessToken: string;
      document?: ApiDocumentCreateRequest;
      files: GooglePickerFile[];
      folderId?: number | null;
    }) => importGoogleDriveFiles(accessToken, files, { document, folderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTRACTS_KEY });
    },
  });
};

export const useCreateServiceCatalogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApiServiceCreateRequest) =>
      createServiceCatalogItem(payload),
    onSuccess: (newService) => {
      queryClient.setQueryData<ApiServiceResponse[]>(
        [...SERVICES_ADMIN_KEY, true],
        (old) => (old ? [...old, newService] : [newService]),
      );
    },
  });
};

export const useUpdateServiceCatalogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceId,
      payload,
    }: {
      serviceId: number;
      payload: ApiServiceUpdateRequest;
    }) => updateServiceCatalogItem(serviceId, payload),
    onSuccess: (updatedService) => {
      queryClient.setQueryData<ApiServiceResponse[]>(
        [...SERVICES_ADMIN_KEY, true],
        (old) => old?.map((s) => (s.id === updatedService.id ? updatedService : s)),
      );
    },
  });
};

export const useDeleteServiceCatalogItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: number) => deleteServiceCatalogItem(serviceId),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ApiServiceResponse[]>(
        [...SERVICES_ADMIN_KEY, true],
        (old) => old?.filter((s) => s.id !== deletedId),
      );
    },
  });
};
