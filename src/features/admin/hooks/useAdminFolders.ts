'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteDocumentFolder,
  getDocumentFolders,
  updateDocumentFolder,
} from '@/api';
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';
import type { DocumentFolder } from '@/types/ui.types';
import { ApiFolderUpdateRequest } from '@/types/api';

export function useAdminFolders() {
  const access = useAdminGuard();
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<DocumentFolder | null>(
    null,
  );
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const loadFolders = useCallback(
    async (options: { force?: boolean } = {}) => {
      if (!access.isAdmin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const nextFolders = await getDocumentFolders();
        setFolders(nextFolders);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar las carpetas.',
        );
      } finally {
        setLoading(false);
      }
    },
    [access.isAdmin],
  );

  useEffect(() => {
    void loadFolders();
  }, [loadFolders]);

  const stats = useMemo(
    () => ({
      hrCount: folders.filter((folder) => folder.owner_role === 'HR').length,
      managerCount: folders.filter((folder) => folder.owner_role === 'MANAGER')
        .length,
      totalDocuments: folders.reduce(
        (total, folder) => total + folder.documents_count,
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

      try {
        setSaving(true);
        setError(null);
        const updatedFolder = await updateDocumentFolder(
          editingFolder.id,
          payload,
        );
        setFolders((currentFolders) =>
          currentFolders.map((folder) =>
            folder.id === updatedFolder.id ? updatedFolder : folder,
          ),
        );
        setEditingFolder(updatedFolder);
        setIsEditorOpen(false);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudo actualizar la carpeta.';
        void loadFolders({ force: true });
        setError(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [editingFolder, loadFolders],
  );

  const removeFolder = useCallback(
    async (folderId: number) => {
      try {
        setSaving(true);
        setError(null);
        setFolders((previousFolders) =>
          previousFolders.filter((folder) => folder.id !== folderId),
        );
        await deleteDocumentFolder(folderId);
      } catch (err) {
        void loadFolders({ force: true });
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo eliminar la carpeta.',
        );
      } finally {
        setSaving(false);
      }
    },
    [loadFolders],
  );

  return {
    ...access,
    canCreateFolder: false,
    closeEditor,
    editingFolder,
    error,
    folders,
    isEditorOpen,
    loading,
    openEditFolder,
    reload: () => loadFolders({ force: true }),
    removeFolder,
    saveFolder,
    saving,
    stats,
  };
}