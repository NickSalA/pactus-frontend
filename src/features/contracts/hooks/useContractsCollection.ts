'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useDocumentFolders,
  useDocuments,
} from '@/queries/hooks/contracts/queries';
import {
  useCreateDocumentFolder,
  useDeleteDocumentFolder,
  useUpdateDocumentFolder,
} from '@/queries/hooks/contracts/mutations';
import { filterVisibleDocuments } from '@/lib/permissions';
import { useAuthStore } from '@/store';
import type { DocumentFlatten } from '@/types/ui.types';
import type { ContractFolder } from '@/features/contracts/lib/contractsUtils';

const UNASSIGNED_FOLDER_ID = 0;
const UNASSIGNED_FOLDER: ContractFolder = {
  documents_count: 0,
  id: UNASSIGNED_FOLDER_ID,
  isSystem: true,
  name: 'Sin carpeta',
};

const createTemporaryFolderId = (): number => -Date.now();

export function useContractsCollection() {
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const [documents, setDocuments] = useState<DocumentFlatten[]>([]);
  const [folderState, setFolderState] = useState<ContractFolder[]>([
    UNASSIGNED_FOLDER,
  ]);
  const [activeFolderId, setActiveFolderId] =
    useState<number>(UNASSIGNED_FOLDER_ID);

  const { data: documentsData, isLoading, error, refetch } = useDocuments();
  const { data: foldersData } = useDocumentFolders();

  const { mutateAsync: createFolderMutation } = useCreateDocumentFolder();
  const { mutateAsync: updateFolderMutation } = useUpdateDocumentFolder();
  const { mutateAsync: deleteFolderMutation } = useDeleteDocumentFolder();

  useEffect(() => {
    if (documentsData) {
      setDocuments(filterVisibleDocuments(documentsData, userRole));
    }
  }, [documentsData, userRole]);

  const folders = useMemo(() => {
    const counts = documents.reduce<Map<number, number>>(
      (nextCounts, document) => {
        if (document.folder_id == null) {
          nextCounts.set(
            UNASSIGNED_FOLDER_ID,
            (nextCounts.get(UNASSIGNED_FOLDER_ID) ?? 0) + 1,
          );
          return nextCounts;
        }

        nextCounts.set(
          document.folder_id,
          (nextCounts.get(document.folder_id) ?? 0) + 1,
        );
        return nextCounts;
      },
      new Map<number, number>(),
    );

    return folderState.map((folder) => ({
      ...folder,
      documents_count: counts.get(folder.id) ?? 0,
    }));
  }, [documents, folderState]);

  useEffect(() => {
    if (foldersData) {
      const apiFolders: ContractFolder[] = foldersData.map((folder) => ({
        documents_count: folder.documents_count,
        id: folder.id,
        isEditable: true,
        name: folder.name,
        owner_role: folder.owner_role,
      }));
      setFolderState([UNASSIGNED_FOLDER, ...apiFolders]);
    }
  }, [foldersData]);

  useEffect(() => {
    if (!folders.some((folder) => folder.id === activeFolderId)) {
      setActiveFolderId(UNASSIGNED_FOLDER_ID);
    }
  }, [activeFolderId, folders]);

  const activeFolder = useMemo(
    () =>
      folders.find((folder) => folder.id === activeFolderId) ??
      UNASSIGNED_FOLDER,
    [activeFolderId, folders],
  );

  const activeContracts = useMemo(() => {
    if (activeFolderId === UNASSIGNED_FOLDER_ID) {
      return documents.filter((document) => document.folder_id == null);
    }

    return documents.filter(
      (document) => document.folder_id === activeFolderId,
    );
  }, [activeFolderId, documents]);

  const reloadContracts = useCallback(() => {
    void refetch();
  }, [refetch]);

  const addContract = useCallback((newContract: DocumentFlatten) => {
    setDocuments((previousDocuments) => [...previousDocuments, newContract]);
  }, []);

  const updateContract = useCallback((updatedContract: DocumentFlatten) => {
    setDocuments((previousDocuments) =>
      previousDocuments.map((contract) =>
        contract.id === updatedContract.id ? updatedContract : contract,
      ),
    );
  }, []);

  const removeContract = useCallback((contractId: number) => {
    setDocuments((previousDocuments) =>
      previousDocuments.filter((contract) => contract.id !== contractId),
    );
  }, []);

  const createFolder = useCallback(
    async (name: string) => {
      const optimisticFolderId = createTemporaryFolderId();
      const optimisticFolder: ContractFolder = {
        documents_count: 0,
        id: optimisticFolderId,
        isEditable: true,
        name,
      };

      setFolderState((previousFolders) => {
        const customFolders = previousFolders.filter(
          (folder) => !folder.isSystem,
        );
        return [
          UNASSIGNED_FOLDER,
          ...customFolders,
          optimisticFolder,
        ];
      });

      try {
        const createdFolder = await createFolderMutation({ name });
        const nextFolder = {
          documents_count: 0,
          id: createdFolder.id,
          isEditable: true,
          name: createdFolder.name,
          owner_role: createdFolder.owner_role,
        } satisfies ContractFolder;

        setFolderState((previousFolders) => {
          const customFolders = previousFolders.filter(
            (folder) => !folder.isSystem && folder.id !== optimisticFolderId,
          );
          return [
            UNASSIGNED_FOLDER,
            ...customFolders,
            nextFolder,
          ];
        });
      } catch (err) {
        setFolderState((previousFolders) =>
          previousFolders.filter((folder) => folder.id !== optimisticFolderId),
        );
        throw new Error(
          err instanceof Error
            ? err.message
            : 'No se pudo crear la carpeta.',
        );
      }
    },
    [activeFolderId],
  );

  const renameFolder = useCallback(
    async (folderId: number, name: string) => {
      const normalizedName = name.trim();
      const previousFolders = folderState;
      setFolderState((currentFolders) =>
        currentFolders.map((folder) =>
          folder.id === folderId ? { ...folder, name: normalizedName } : folder,
        ),
      );

      try {
        const updatedFolder = await updateFolderMutation({
          folderId,
          payload: { name: normalizedName },
        });
        setFolderState((previousFolders) =>
          previousFolders.map((folder) =>
            folder.id === folderId
              ? {
                  ...folder,
                  name: updatedFolder.name,
                }
              : folder,
          ),
        );

        return updatedFolder;
      } catch (err) {
        setFolderState(previousFolders);
        throw new Error(
          err instanceof Error
            ? err.message
            : 'No se pudo actualizar la carpeta.',
        );
      }
    },
    [folderState],
  );

  const deleteFolder = useCallback(
    async (folderId: number) => {
      const previousFolders = folderState;
      const previousActiveFolderId = activeFolderId;
      setFolderState((currentFolders) =>
        currentFolders.filter((folder) => folder.id !== folderId),
      );
      if (activeFolderId === folderId) {
        setActiveFolderId(UNASSIGNED_FOLDER_ID);
      }

      try {
        await deleteFolderMutation(folderId);
      } catch (err) {
        setFolderState(previousFolders);
        setActiveFolderId(previousActiveFolderId);
        throw new Error(
          err instanceof Error
            ? err.message
            : 'No se pudo eliminar la carpeta.',
        );
      }
    },
    [activeFolderId, folderState],
  );

  const selectFolder = useCallback((folderId: number) => {
    setActiveFolderId(folderId);
  }, []);

  return {
    activeContracts,
    activeFolder,
    activeFolderId,
    addContract,
    createFolder,
    deleteFolder,
    error,
    folders,
    isLoading,
    reloadContracts,
    removeContract,
    renameFolder,
    selectFolder,
    updateContract,
  };
}
