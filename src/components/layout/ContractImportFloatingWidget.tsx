'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CloudUpload,
  LoaderCircle,
  RotateCcw,
  X,
} from 'lucide-react';
import { getDocumentSourceFileId } from '@/lib/document.utils';
import { useDocuments } from '@/queries/hooks/contracts/queries';
import { useAuthStore, useContractImportStore } from '@/store';
import type { ContractImportFileStatus } from '@/store/contractImportStore';

const STATUS_LABELS: Record<ContractImportFileStatus, string> = {
  QUEUED: 'Pendiente',
  UPLOADING: 'Cargando',
  EXTRACTING_METADATA: 'Extrayendo metadatos',
  AI_ANALYSIS: 'Analizando con IA',
  CREATING_RECORD: 'Creando contrato',
  COMPLETED: 'Listo',
  FAILED: 'Error',
};

const STATUS_DOT_CLASSES: Record<ContractImportFileStatus, string> = {
  QUEUED: 'bg-brand-neutral-300',
  UPLOADING: 'bg-brand-primary',
  EXTRACTING_METADATA: 'bg-brand-blue-500',
  AI_ANALYSIS: 'bg-brand-blue-600',
  CREATING_RECORD: 'bg-brand-yellow-500',
  COMPLETED: 'bg-brand-green-500',
  FAILED: 'bg-brand-red-500',
};

const getContractsPath = (role: string | null | undefined): string => {
  switch (role) {
    case 'HR':
      return '/hr/contracts';
    case 'MANAGER':
      return '/manager/contracts';
    case 'WORKER':
      return '/worker/contracts';
    default:
      return '/manager/contracts';
  }
};

export function ContractImportFloatingWidget() {
  const router = useRouter();
  const pathname = usePathname();
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const session = useContractImportStore((state) => state.session);
  const closeImportWidget = useContractImportStore(
    (state) => state.closeImportWidget,
  );
  const markCompletedBySourceFileIds = useContractImportStore(
    (state) => state.markCompletedBySourceFileIds,
  );
  const setImportWidgetExpanded = useContractImportStore(
    (state) => state.setImportWidgetExpanded,
  );

  const isRunning = session?.status === 'running';
  const { data: documents } = useDocuments({
    enabled: isRunning,
    refetchInterval: isRunning ? 5000 : false,
  });

  useEffect(() => {
    if (!session || !documents) {
      return;
    }

    const importedSourceFileIds = documents
      .map(getDocumentSourceFileId)
      .filter((fileId): fileId is string => Boolean(fileId));

    markCompletedBySourceFileIds(importedSourceFileIds);
  }, [documents, markCompletedBySourceFileIds, session]);

  if (!session || session.files.length === 0) {
    return null;
  }

  const totalCount = session.files.length;
  const completedCount = session.files.filter(
    (file) => file.status === 'COMPLETED',
  ).length;
  const failedCount = session.files.filter(
    (file) => file.status === 'FAILED',
  ).length;
  const resolvedCount = completedCount + failedCount;
  const progress = Math.round((resolvedCount / totalCount) * 100);
  const hasErrors = failedCount > 0;
  const isFinished = session.status !== 'running';
  const title = isFinished
    ? hasErrors
      ? 'Importación completada con errores'
      : 'Importación completada'
    : 'Importando contratos';
  const summary = isFinished
    ? hasErrors
      ? `${completedCount} importados · ${failedCount} fallido${failedCount === 1 ? '' : 's'}`
      : `${completedCount} contrato${completedCount === 1 ? '' : 's'} importado${completedCount === 1 ? '' : 's'} correctamente`
    : `${resolvedCount} de ${totalCount} archivos`;

  const handleViewContracts = () => {
    const contractsPath = getContractsPath(userRole);
    if (pathname !== contractsPath) {
      router.push(contractsPath);
    }
  };

  return (
    <aside className="fixed bottom-6 right-6 z-40 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-brand-neutral-200 bg-white shadow-xl">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue-50 text-brand-primary">
              {isFinished && !hasErrors ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : isRunning ? (
                <CloudUpload className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-brand-neutral-900">
                {title}
              </h2>
              <p className="mt-1 text-xs text-brand-neutral-600">
                {isFinished ? summary : `${progress}% completo`}
              </p>
            </div>
          </div>

          {!isFinished && (
            <button
              type="button"
              onClick={() => setImportWidgetExpanded(!session.isExpanded)}
              className="rounded-lg p-1 text-brand-neutral-500 transition-colors hover:bg-brand-neutral-100 hover:text-brand-neutral-800"
              aria-label={
                session.isExpanded
                  ? 'Contraer importación'
                  : 'Expandir importación'
              }
            >
              {session.isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {!isFinished && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-brand-neutral-600">
              <span>{progress}% completo</span>
              <span>{summary}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-brand-neutral-200">
              <div
                className="h-full rounded-full bg-brand-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {!isFinished && session.isExpanded && (
          <div className="mt-4 space-y-2 border-t border-brand-neutral-200 pt-3">
            {session.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-brand-neutral-50 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-brand-neutral-700">
                    {file.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-brand-neutral-500">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_CLASSES[file.status]}`}
                    />
                    {STATUS_LABELS[file.status]}
                  </p>
                </div>
                {file.status === 'COMPLETED' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-green-500" />
                ) : file.status === 'FAILED' ? (
                  <X className="h-4 w-4 shrink-0 text-brand-red-500" />
                ) : (
                  <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-brand-primary" />
                )}
              </div>
            ))}
          </div>
        )}

        {isFinished && (
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-brand-neutral-200 pt-3">
            {hasErrors && (
              <button
                type="button"
                disabled
                title="Disponible cuando backend exponga el endpoint de reintento"
                className="inline-flex items-center gap-2 rounded-xl border border-brand-neutral-200 bg-white px-3 py-2 text-xs font-medium text-brand-neutral-500 opacity-70"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reintentar fallidos
              </button>
            )}
            <button
              type="button"
              onClick={handleViewContracts}
              className="rounded-xl bg-brand-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-primary-dark"
            >
              Ver contratos
            </button>
            <button
              type="button"
              onClick={closeImportWidget}
              className="rounded-xl border border-brand-neutral-200 bg-white px-3 py-2 text-xs font-medium text-brand-neutral-700 transition-colors hover:bg-brand-neutral-100"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
