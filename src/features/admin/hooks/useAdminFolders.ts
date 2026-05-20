'use client';

import { useCallback, useMemo, useState } from 'react';
import { useDocumentFolders } from '@/queries/hooks/contracts/queries';
import {
  useDeleteDocumentFolder,
  useUpdateDocumentFolder,
} from '@/queries/hooks/contracts/mutations';
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';
import type { DocumentFolder } from '@/types/ui.types';
import { ApiFolderUpdateRequest } from '@/types/api';

export function useAdminFolders() {
  const access = useAdminGuard();
  const [editingFolder, setEditingFolder] = useState<DocumentFolder | null>(
    null,
  );
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const {
    data: folders = [],
    isLoading: loading,
    error,
    refetch: reload,
  } = useDocumentFolders();

  const updateFolderMutation = useUpdateDocumentFolder();

  const deleteFolderMutation = useDeleteDocumentFolder();

  const saving =
    updateFolderMutation.isPending || deleteFolderMutation.isPending;

  const stats = useMemo(
    () => ({
      hrCount: folders.filter((folder: DocumentFolder) => folder.owner_role === 'HR').length,
      managerCount: folders.filter((folder: DocumentFolder) => folder.owner_role === 'MANAGER')
        .length,
      totalDocuments: folders.reduce(
        (total: number, folder: DocumentFolder) => total + folder.documents_count,
        0,
      ),
      totalFolders: folders.length,
    }),
    [folders],
  );

  const openEditFolder = useCallback((folder: DocumentFolder) => {
    setEditingFolder(folder);
    setIsEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    if (saving) {
      return;
    }

    setEditingFolder(null);
    setIsEditorOpen(false);
  }, [saving]);

  const saveFolder = useCallback(
    async (payload: ApiFolderUpdateRequest) => {
      if (!editingFolder) {
        return;
      }

      const updatedFolder = await updateFolderMutation.mutateAsync({
        folderId: editingFolder.id,
        payload,
      });
      setEditingFolder(updatedFolder);
      setIsEditorOpen(false);
    },
    [editingFolder, updateFolderMutation],
  );

  const removeFolder = useCallback(
    async (folderId: number) => {
      await deleteFolderMutation.mutateAsync(folderId);
    },
    [deleteFolderMutation],
  );

  return {
    ...access,
    canCreateFolder: false,
    closeEditor,
    editingFolder,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    folders,
    isEditorOpen,
    loading,
    openEditFolder,
    reload,
    removeFolder,
    saveFolder,
    saving,
    stats,
  };
}