"use client";

import { type ReactNode, useMemo, useState } from "react";
import { AlertTriangle, Folder, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import type { ContractFolder } from "@/features/contracts/lib/contracts-utils";

type ContractsFolderTabsProps = {
  activeFolder: ContractFolder;
  canCreateFolder: boolean;
  canManageActiveFolder: boolean;
  folders: ContractFolder[];
  onCreateFolder: (name: string) => Promise<void> | void;
  onDeleteFolder: (folderId: number) => Promise<void> | void;
  onRenameFolder: (folderId: number, name: string) => Promise<void> | void;
  onSelectFolder: (folderId: number) => void;
};

type FolderDialogProps = {
  children: ReactNode;
  description: string;
  footer: ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
};

function FolderDialog({ children, description, footer, onClose, open, title }: FolderDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white shadow-2xl shadow-slate-900/10">
        <div className="flex items-start justify-between border-b border-slate-200/80 px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6">{children}</div>
        <div className="border-t border-slate-200/80 px-6 py-5">{footer}</div>
      </div>
    </div>
  );
}

export function ContractsFolderTabs({
  activeFolder,
  canCreateFolder,
  canManageActiveFolder,
  folders,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onSelectFolder,
}: ContractsFolderTabsProps) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);
  const [renameLoading, setRenameLoading] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteBlockedOpen, setIsDeleteBlockedOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const activeFolderSummary = useMemo(() => {
    if (activeFolder.isSystem) {
      return "Los contratos sin carpeta se muestran aqui.";
    }

    return `${activeFolder.documents_count} contrato${activeFolder.documents_count === 1 ? "" : "s"} dentro de esta carpeta.`;
  }, [activeFolder]);

  const confirmFolderCreation = async () => {
    const normalizedName = folderName.trim();

    if (normalizedName) {
      try {
        setCreateError(null);
        await onCreateFolder(normalizedName);
      } catch (err) {
        setCreateError(err instanceof Error ? err.message : "No se pudo crear la carpeta.");
        return;
      }
    }

    setFolderName("");
    setIsCreatingFolder(false);
  };

  const openRenameModal = () => {
    setRenameValue(activeFolder.name);
    setRenameError(null);
    setIsRenameOpen(true);
  };

  const closeRenameModal = () => {
    if (renameLoading) {
      return;
    }

    setIsRenameOpen(false);
    setRenameError(null);
  };

  const submitRename = async () => {
    const normalizedName = renameValue.trim();
    if (!normalizedName) {
      setRenameError("Ingresa un nombre valido para la carpeta.");
      return;
    }

    try {
      setRenameLoading(true);
      setRenameError(null);
      await onRenameFolder(activeFolder.id, normalizedName);
      setIsRenameOpen(false);
    } catch (err) {
      setRenameError(err instanceof Error ? err.message : "No se pudo renombrar la carpeta.");
    } finally {
      setRenameLoading(false);
    }
  };

  const requestDelete = () => {
    setDeleteError(null);

    if (activeFolder.documents_count > 0) {
      setIsDeleteBlockedOpen(true);
      return;
    }

    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirmModal = () => {
    if (deleteLoading) {
      return;
    }

    setIsDeleteConfirmOpen(false);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError(null);
      await onDeleteFolder(activeFolder.id);
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "No se pudo eliminar la carpeta.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4 space-y-3">
        <div className="flex flex-shrink-0 items-center gap-1 border-b border-slate-200">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => onSelectFolder(folder.id)}
              className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeFolder.id === folder.id
                  ? "-mb-px border-b-2 border-blue-600 bg-white text-blue-600"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <Folder className="h-4 w-4" />
              {folder.name}
            </button>
          ))}

          {canCreateFolder && isCreatingFolder ? (
            <div className="flex items-center gap-1 px-2">
              <input
                autoFocus
                type="text"
                placeholder="Nombre..."
                value={folderName}
                onBlur={() => {
                  void confirmFolderCreation();
                }}
                onChange={(event) => setFolderName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void confirmFolderCreation();
                  }

                  if (event.key === "Escape") {
                    setFolderName("");
                    setIsCreatingFolder(false);
                    setCreateError(null);
                  }
                }}
                className="w-32 rounded-lg border border-blue-400 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none ring-2 ring-blue-500/20"
              />
            </div>
          ) : canCreateFolder ? (
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="ml-1 flex items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
            >
              <Plus className="h-3.5 w-3.5" />
              Nueva carpeta
            </button>
          ) : null}
        </div>

        {(createError || canManageActiveFolder) && (
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm shadow-slate-200/60 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">{activeFolder.name}</p>
              <p className={`text-sm ${createError ? "text-red-700" : "text-slate-500"}`}>{createError ?? activeFolderSummary}</p>
            </div>

            {canManageActiveFolder && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openRenameModal}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Pencil className="h-4 w-4" />
                  Editar carpeta
                </button>
                <button
                  type="button"
                  onClick={requestDelete}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-medium text-red-700 transition-all hover:-translate-y-0.5 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar carpeta
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <FolderDialog
        description="Cambia el nombre de la carpeta actual sin alterar los contratos que contiene."
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeRenameModal}
              disabled={renameLoading}
              className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                void submitRename();
              }}
              disabled={renameLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save className="h-4 w-4" />
              {renameLoading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        }
        onClose={closeRenameModal}
        open={isRenameOpen}
        title="Editar carpeta"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Nombre de la carpeta</label>
            <input
              type="text"
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {activeFolderSummary}
          </div>

          {renameError && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{renameError}</div>}
        </div>
      </FolderDialog>

      <FolderDialog
        description="Esta accion elimina la carpeta actual. Si contiene contratos, la eliminacion sera bloqueada."
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeDeleteConfirmModal}
              disabled={deleteLoading}
              className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                void confirmDelete();
              }}
              disabled={deleteLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/25 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Trash2 className="h-4 w-4" />
              {deleteLoading ? "Eliminando..." : "Eliminar carpeta"}
            </button>
          </div>
        }
        onClose={closeDeleteConfirmModal}
        open={isDeleteConfirmOpen}
        title="Eliminar carpeta"
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            Se eliminara <span className="font-semibold">{activeFolder.name}</span>. Esta accion no se puede deshacer.
          </div>
          {deleteError && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{deleteError}</div>}
        </div>
      </FolderDialog>

      <FolderDialog
        description="Esta carpeta aun tiene contratos asociados y no puede eliminarse hasta que queden libres."
        footer={
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setIsDeleteBlockedOpen(false)}
              className="rounded-2xl bg-red-100 px-5 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
            >
              Entendido
            </button>
          </div>
        }
        onClose={() => setIsDeleteBlockedOpen(false)}
        open={isDeleteBlockedOpen}
        title="No se puede eliminar la carpeta"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Accion bloqueada</p>
              <p className="mt-1">
                La carpeta <span className="font-semibold">{activeFolder.name}</span> tiene {activeFolder.documents_count} contrato
                {activeFolder.documents_count === 1 ? "" : "s"} asociado{activeFolder.documents_count === 1 ? "" : "s"}. Mueve o desasigna esos contratos antes de eliminarla.
              </p>
            </div>
          </div>
        </div>
      </FolderDialog>
    </>
  );
}
