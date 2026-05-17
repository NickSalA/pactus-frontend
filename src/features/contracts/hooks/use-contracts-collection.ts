"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createDocumentFolder, deleteDocumentFolder, updateDocumentFolder } from "@/api";
import { useDocumentFolders, useDocuments } from "@/queries/hooks/contracts/queries";
import { filterVisibleDocuments } from "@/lib/permissions";
import { useAuthStore } from "@/store";
import type { Document } from "@/types/api.types";
import type { ContractFolder } from "@/features/contracts/lib/contracts-utils";

const UNASSIGNED_FOLDER_ID = 0;
const UNASSIGNED_FOLDER: ContractFolder = {
  documents_count: 0,
  id: UNASSIGNED_FOLDER_ID,
  isSystem: true,
  name: "Sin carpeta",
};

const sortFoldersByName = (folders: ContractFolder[]): ContractFolder[] => {
  return [...folders].sort((left, right) => left.name.localeCompare(right.name, "es"));
};

const createTemporaryFolderId = (): number => -Date.now();

export function useContractsCollection() {
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folderState, setFolderState] = useState<ContractFolder[]>([UNASSIGNED_FOLDER]);
  const [activeFolderId, setActiveFolderId] = useState<number>(UNASSIGNED_FOLDER_ID);

  const { data: documentsData, isLoading, error, refetch } = useDocuments();
  const { data: foldersData } = useDocumentFolders();

  useEffect(() => {
    if (documentsData) {
      setDocuments(filterVisibleDocuments(documentsData, userRole));
    }
  }, [documentsData, userRole]);

  const folders = useMemo(() => {
    const counts = documents.reduce<Map<number, number>>((nextCounts, document) => {
      if (document.folder_id == null) {
        nextCounts.set(UNASSIGNED_FOLDER_ID, (nextCounts.get(UNASSIGNED_FOLDER_ID) ?? 0) + 1);
        return nextCounts;
      }

      nextCounts.set(document.folder_id, (nextCounts.get(document.folder_id) ?? 0) + 1);
      return nextCounts;
    }, new Map<number, number>());

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
      setFolderState([UNASSIGNED_FOLDER, ...sortFoldersByName(apiFolders)]);
    }
  }, [foldersData]);

  useEffect(() => {
    if (!folders.some((folder) => folder.id === activeFolderId)) {
      setActiveFolderId(UNASSIGNED_FOLDER_ID);
    }
  }, [activeFolderId, folders]);

  const activeFolder = useMemo(
    () => folders.find((folder) => folder.id === activeFolderId) ?? UNASSIGNED_FOLDER,
    [activeFolderId, folders],
  );

  const activeContracts = useMemo(() => {
    if (activeFolderId === UNASSIGNED_FOLDER_ID) {
      return documents.filter((document) => document.folder_id == null);
    }

    return documents.filter((document) => document.folder_id === activeFolderId);
  }, [activeFolderId, documents]);

  const reloadContracts = useCallback(() => {
    void refetch();
  }, [refetch]);

  const addContract = useCallback((newContract: Document) => {
    setDocuments((previousDocuments) => [...previousDocuments, newContract]);
  }, []);

  const updateContract = useCallback((updatedContract: Document) => {
    setDocuments((previousDocuments) =>
      previousDocuments.map((contract) => (contract.id === updatedContract.id ? updatedContract : contract)),
    );
  }, []);

  const removeContract = useCallback((contractId: number) => {
    setDocuments((previousDocuments) => previousDocuments.filter((contract) => contract.id !== contractId));
  }, []);

  const createFolder = useCallback(async (name: string) => {
    const optimisticFolderId = createTemporaryFolderId();
    const optimisticFolder: ContractFolder = {
      documents_count: 0,
      id: optimisticFolderId,
      isEditable: true,
      name,
    };

    const previousActiveFolderId = activeFolderId;
    setFolderState((previousFolders) => {
      const customFolders = previousFolders.filter((folder) => !folder.isSystem);
      return [UNASSIGNED_FOLDER, ...sortFoldersByName([...customFolders, optimisticFolder])];
    });
    setActiveFolderId(optimisticFolderId);

    try {
      const createdFolder = await createDocumentFolder({ name });
      const nextFolder = {
        documents_count: 0,
        id: createdFolder.id,
        isEditable: true,
        name: createdFolder.name,
        owner_role: createdFolder.owner_role,
      } satisfies ContractFolder;

      setFolderState((previousFolders) => {
        const customFolders = previousFolders.filter((folder) => !folder.isSystem && folder.id !== optimisticFolderId);
        return [UNASSIGNED_FOLDER, ...sortFoldersByName([...customFolders, nextFolder])];
      });
      setActiveFolderId(createdFolder.id);
    } catch (err) {
      setFolderState((previousFolders) => previousFolders.filter((folder) => folder.id !== optimisticFolderId));
      setActiveFolderId(previousActiveFolderId);
      throw new Error(err instanceof Error ? err.message : "No se pudo crear la carpeta.");
    }
  }, [activeFolderId]);

  const renameFolder = useCallback(async (folderId: number, name: string) => {
    const normalizedName = name.trim();
    const previousFolders = folderState;
    setFolderState((currentFolders) =>
      currentFolders.map((folder) => (folder.id === folderId ? { ...folder, name: normalizedName } : folder)),
    );

    try {
      const updatedFolder = await updateDocumentFolder(folderId, { name: normalizedName });
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
      throw new Error(err instanceof Error ? err.message : "No se pudo actualizar la carpeta.");
    }
  }, [folderState]);

  const deleteFolder = useCallback(async (folderId: number) => {
    const previousFolders = folderState;
    const previousActiveFolderId = activeFolderId;
    setFolderState((currentFolders) => currentFolders.filter((folder) => folder.id !== folderId));
    if (activeFolderId === folderId) {
      setActiveFolderId(UNASSIGNED_FOLDER_ID);
    }

    try {
      await deleteDocumentFolder(folderId);
    } catch (err) {
      setFolderState(previousFolders);
      setActiveFolderId(previousActiveFolderId);
      throw new Error(err instanceof Error ? err.message : "No se pudo eliminar la carpeta.");
    }
  }, [activeFolderId, folderState]);

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
