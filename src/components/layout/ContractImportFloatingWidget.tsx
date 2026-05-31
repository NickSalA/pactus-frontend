'use client';

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
import { useDriveImportEvents } from '@/queries/hooks/contracts/importEvents';
import { useAuthStore, useContractImportStore } from '@/store';
import type { ContractImportFileStatus } from '@/store/contractImportStore';

const STATUS_LABELS: Record<ContractImportFileStatus, string> = {
  PENDING: 'En cola',
  DATABASE: 'Base de datos',
  KNOWLEDGE_BASE: 'Base de conocimientos',
  COMPLETED: 'Listo',
  FAILED: 'Error',
};

const STATUS_DOT_CLASSES: Record<ContractImportFileStatus, string> = {
  PENDING: 'bg-brand-neutral-300',
  DATABASE: 'bg-brand-yellow-500',
  KNOWLEDGE_BASE: 'bg-brand-blue-600',
  COMPLETED: 'bg-brand-green-500',
  FAILED: 'bg-brand-red-500',
};

type PhaseStepState = 'active' | 'done' | 'failed' | 'pending';

const PHASE_STEP_CLASSES: Record<PhaseStepState, string> = {
  active: 'border-brand-blue-200 bg-brand-blue-50 text-brand-primary',
  done: 'border-brand-green-500/20 bg-brand-green-50 text-brand-green-600',
  failed: 'border-brand-red-500/20 bg-brand-red-100 text-brand-red-500',
  pending: 'border-brand-neutral-200 bg-white text-brand-neutral-500',
};

const getPhaseStepIcon = (state: PhaseStepState) => {
  if (state === 'done') {
    return <CheckCircle2 className="h-3.5 w-3.5" />;
  }

  if (state === 'failed') {
    return <X className="h-3.5 w-3.5" />;
  }

  if (state === 'active') {
    return <LoaderCircle className="h-3.5 w-3.5 animate-spin" />;
  }

  return <span className="h-2 w-2 rounded-full bg-current opacity-40" />;
};

const getFileStepStates = (
  status: ContractImportFileStatus,
  error?: string,
): { database: PhaseStepState; knowledgeBase: PhaseStepState } => {
  const failedInKnowledgeBase = error?.toLowerCase().includes('conocimiento');

  if (status === 'FAILED') {
    return {
      database: failedInKnowledgeBase ? 'done' : 'failed',
      knowledgeBase: failedInKnowledgeBase ? 'failed' : 'pending',
    };
  }

  if (status === 'COMPLETED') {
    return { database: 'done', knowledgeBase: 'done' };
  }

  if (status === 'KNOWLEDGE_BASE') {
    return { database: 'done', knowledgeBase: 'active' };
  }

  if (status === 'DATABASE') {
    return { database: 'active', knowledgeBase: 'pending' };
  }

  return { database: 'pending', knowledgeBase: 'pending' };
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
  const applyImportEvent = useContractImportStore(
    (state) => state.applyImportEvent,
  );
  const closeImportWidget = useContractImportStore(
    (state) => state.closeImportWidget,
  );
  const markImportStreamFailed = useContractImportStore(
    (state) => state.markImportStreamFailed,
  );
  const setImportWidgetExpanded = useContractImportStore(
    (state) => state.setImportWidgetExpanded,
  );

  const isRunning = session?.status === 'running';
  const jobId = session?.jobId ?? null;

  useDriveImportEvents({
    enabled: isRunning && Boolean(jobId),
    jobId,
    onError: markImportStreamFailed,
    onFileUpdate: applyImportEvent,
    onInitialState: applyImportEvent,
    onJobComplete: applyImportEvent,
  });

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
  const hasErrors = failedCount > 0 || session.status === 'failed';
  const isFinished = session.status !== 'running';
  const canDismiss = isFinished || Boolean(session.streamError);
  let title = 'Importando contratos';
  let summary = `${resolvedCount} de ${totalCount} archivos`;

  if (isFinished) {
    if (session.status === 'failed') {
      title = 'Importación fallida';
      summary = `${failedCount} archivo${failedCount === 1 ? '' : 's'} con error`;
    } else if (hasErrors) {
      title = 'Importación completada con errores';
      summary = `${completedCount} importados · ${failedCount} fallido${failedCount === 1 ? '' : 's'}`;
    } else {
      title = 'Importación completada';
      summary = `${completedCount} contrato${completedCount === 1 ? '' : 's'} importado${completedCount === 1 ? '' : 's'} correctamente`;
    }
  }

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
            {session.streamError && (
              <p className="mt-2 text-xs text-brand-red-500">
                {session.streamError}
              </p>
            )}
          </div>
        )}

        {session.isExpanded && (
          <div className="mt-4 space-y-2 border-t border-brand-neutral-200 pt-3">
            {session.files.map((file) => {
              const steps = getFileStepStates(file.status, file.error);

              return (
                <div
                  key={file.id}
                  className="rounded-xl bg-brand-neutral-50 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3">
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

                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-medium">
                    <div
                      className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 ${PHASE_STEP_CLASSES[steps.database]}`}
                    >
                      {getPhaseStepIcon(steps.database)}
                      Base de datos
                    </div>
                    <div
                      className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 ${PHASE_STEP_CLASSES[steps.knowledgeBase]}`}
                    >
                      {getPhaseStepIcon(steps.knowledgeBase)}
                      Base de conocimientos
                    </div>
                  </div>

                  {file.error && (
                    <p className="mt-2 text-xs text-brand-red-500">
                      {file.error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {canDismiss && (
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-brand-neutral-200 pt-3">
            {isFinished && hasErrors && (
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
            {isFinished && (
              <button
                type="button"
                onClick={handleViewContracts}
                className="rounded-xl bg-brand-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-primary-dark"
              >
                Ver contratos
              </button>
            )}
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
