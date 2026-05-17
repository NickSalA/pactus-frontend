"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { deleteDocumentFolder, getDocumentFolders, updateDocumentFolder } from "@/api";
import { ADMIN_CACHE_TTL_MS, peekAdminCache, readAdminCache, writeAdminCache } from "@/features/admin/lib/admin-cache";
import { useAdminGuard } from "@/features/admin/hooks/use-admin-guard";
import type { DocumentFolder, DocumentFolderUpdateRequest } from "@/types/api.types";

export function useAdminFolders() {
  const access = useAdminGuard();
  const [folders, setFolders] = useState<DocumentFolder[]>(() => peekAdminCache<DocumentFolder[]>("folders") ?? []);
  const [loading, setLoading] = useState(() => peekAdminCache<DocumentFolder[]>("folders") === null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<DocumentFolder | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const loadFolders = useCallback(async (options: { force?: boolean } = {}) => {
    if (!access.isAdmin) {
      setLoading(false);
      return;
    }

    const cachedFolders = !options.force ? readAdminCache<DocumentFolder[]>("folders", ADMIN_CACHE_TTL_MS) : null;
    if (cachedFolders) {
      setFolders(cachedFolders);
      setLoading(false);
      return;
    }

    try {
      if (peekAdminCache<DocumentFolder[]>("folders") === null) {
        setLoading(true);
      }
      setError(null);
      const nextFolders = await getDocumentFolders();
      setFolders(nextFolders);
      writeAdminCache("folders", nextFolders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las carpetas.");
    } finally {
      setLoading(false);
    }
  }, [access.isAdmin]);

  useEffect(() => {
    void loadFolders();
  }, [loadFolders]);

  const stats = useMemo(
    () => ({
      hrCount: folders.filter((folder) => folder.owner_role === "HR").length,
      managerCount: folders.filter((folder) => folder.owner_role === "MANAGER").length,
      totalDocuments: folders.reduce((total, folder) => total + folder.documents_count, 0),
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

  const saveFolder = useCallback(async (payload: DocumentFolderUpdateRequest) => {
    if (!editingFolder) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const previousFolders = folders;
      const optimisticFolders = previousFolders.map((folder) =>
        folder.id === editingFolder.id ? { ...folder, ...payload, updated_at: new Date().toISOString() } : folder,
      );

      setFolders(optimisticFolders);
      writeAdminCache("folders", optimisticFolders);

      const updatedFolder = await updateDocumentFolder(editingFolder.id, payload);
      setFolders((currentFolders) => {
        const nextFolders = currentFolders.map((folder) => (folder.id === updatedFolder.id ? updatedFolder : folder));
        writeAdminCache("folders", nextFolders);
        return nextFolders;
      });
      setEditingFolder(updatedFolder);
      setIsEditorOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo actualizar la carpeta.";
      void loadFolders({ force: true });
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, [editingFolder, folders, loadFolders]);

  const removeFolder = useCallback(async (folderId: number) => {
    try {
      setSaving(true);
      setError(null);
      const previousFolders = folders;
      const nextFolders = previousFolders.filter((folder) => folder.id !== folderId);
      setFolders(nextFolders);
      writeAdminCache("folders", nextFolders);
      await deleteDocumentFolder(folderId);
    } catch (err) {
      void loadFolders({ force: true });
      setError(err instanceof Error ? err.message : "No se pudo eliminar la carpeta.");
    } finally {
      setSaving(false);
    }
  }, [folders, loadFolders]);

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
