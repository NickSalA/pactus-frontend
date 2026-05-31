'use client';

import { FileText, LoaderCircle, X } from 'lucide-react';
import type { GooglePickerFile } from '@/lib/googlePicker';

type ContractsImportReviewModalProps = {
  isImporting: boolean;
  isOpeningDrivePicker: boolean;
  onAddMore: () => void;
  onClearAll: () => void;
  onClose: () => void;
  onImport: () => void;
  onRemoveFile: (fileId: string) => void;
  open: boolean;
  selectedFiles: GooglePickerFile[];
};

const getFileBadge = (
  filename: string,
): { label: string; className: string } => {
  const extension = filename.split('.').pop()?.toLowerCase() ?? '';

  if (extension === 'pdf') {
    return {
      label: 'PDF',
      className: 'bg-brand-red-100 text-brand-red-500',
    };
  }

  if (extension === 'docx') {
    return {
      label: 'DOCX',
      className: 'bg-brand-blue-100 text-brand-primary',
    };
  }

  if (extension === 'doc') {
    return {
      label: 'DOC',
      className: 'bg-brand-blue-100 text-brand-primary',
    };
  }

  return {
    label: 'FILE',
    className: 'bg-brand-neutral-100 text-brand-neutral-600',
  };
};

export function ContractsImportReviewModal({
  isImporting,
  isOpeningDrivePicker,
  onAddMore,
  onClearAll,
  onClose,
  onImport,
  onRemoveFile,
  open,
  selectedFiles,
}: ContractsImportReviewModalProps) {
  if (!open) {
    return null;
  }

  const isBusy = isImporting || isOpeningDrivePicker;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!isBusy) {
          onClose();
        }
      }}
    >
      <div
        className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-brand-neutral-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-brand-neutral-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-brand-neutral-900">
              Importar contratos desde Google Drive
            </h2>
            <p className="mt-1 text-sm text-brand-neutral-600">
              Revisa los contratos seleccionados antes de importarlos a Pactus.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="rounded-lg p-1.5 text-brand-neutral-500 transition-colors hover:bg-brand-neutral-100 hover:text-brand-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cerrar modal de importacion"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-brand-neutral-800">
              Contratos seleccionados ({selectedFiles.length})
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onAddMore}
                disabled={isBusy}
                className="rounded-xl border border-brand-blue-200 bg-white px-3 py-2 text-sm font-medium text-brand-primary transition-colors hover:bg-brand-blue-50 disabled:cursor-wait disabled:opacity-60"
              >
                {isOpeningDrivePicker ? 'Abriendo Drive...' : 'Agregar más'}
              </button>
              <button
                type="button"
                onClick={onClearAll}
                disabled={isBusy || selectedFiles.length === 0}
                className="rounded-xl border border-brand-neutral-200 bg-white px-3 py-2 text-sm font-medium text-brand-neutral-600 transition-colors hover:border-brand-red-500 hover:bg-brand-red-100 hover:text-brand-red-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-brand-neutral-200 disabled:hover:bg-white disabled:hover:text-brand-neutral-600"
              >
                Limpiar todo
              </button>
            </div>
          </div>

          <div className="max-h-[253px] overflow-y-auto rounded-2xl border border-brand-neutral-200 bg-brand-neutral-50">
            {selectedFiles.length > 0 ? (
              <div className="divide-y divide-brand-neutral-200">
                {selectedFiles.map((file) => {
                  const badge = getFileBadge(file.name);

                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${badge.className}`}
                        >
                          <span className="text-[10px] font-bold leading-none">
                            {badge.label}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-brand-neutral-800">
                            {file.name}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-brand-neutral-500">
                            <FileText className="h-3 w-3" />
                            Archivo seleccionado
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveFile(file.id)}
                        disabled={isBusy}
                        className="rounded-lg p-1.5 text-brand-neutral-500 transition-colors hover:bg-brand-red-100 hover:text-brand-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Quitar ${file.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-brand-neutral-500">
                No hay contratos seleccionados.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-brand-neutral-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-brand-neutral-600">
            Los contratos serán cargados y analizados automáticamente.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="rounded-xl border border-brand-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-brand-neutral-700 transition-colors hover:bg-brand-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onImport}
              disabled={isBusy || selectedFiles.length === 0}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isImporting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Importar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
