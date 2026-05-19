'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { AdminModalShell } from '@/features/admin/components/shared/AdminModalShell';
import { getFolderVisibilityLabel } from '@/features/admin/lib/admin-formatters';
import type { DocumentFolder } from '@/types/api.types';
import { ApiFolderUpdateRequest } from '@/types/api';

type AdminFolderModalProps = {
  folder: DocumentFolder | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: ApiFolderUpdateRequest) => Promise<void>;
  open: boolean;
};

export function AdminFolderModal({
  folder,
  isSubmitting,
  onClose,
  onSubmit,
  open,
}: AdminFolderModalProps) {
  const [name, setName] = useState(folder?.name ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const normalizedName = name.trim();
    if (!normalizedName) {
      setError('Ingresa un nombre válido para la carpeta.');
      return;
    }

    try {
      setError(null);
      await onSubmit({ name: normalizedName });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo guardar la carpeta.',
      );
    }
  };

  return (
    <AdminModalShell
      description="Actualiza el nombre de la carpeta manteniendo su alcance por rol."
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              void handleSubmit();
            }}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      }
      onClose={onClose}
      open={open}
      title="Editar Carpeta"
    >
      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nombre de carpeta
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Visible para
            </label>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {folder
                ? getFolderVisibilityLabel(folder.owner_role)
                : 'Sin alcance'}
            </div>
          </div>
        </div>

        {folder && (
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Creada por
              </label>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {folder.created_by_name ||
                  folder.created_by_email ||
                  'Sin información'}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Documentos vinculados
              </label>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {folder.documents_count}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </AdminModalShell>
  );
}
