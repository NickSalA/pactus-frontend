import { create } from 'zustand';
import type { GooglePickerFile } from '@/lib/googlePicker';

export type ContractImportFileStatus =
  | 'QUEUED'
  | 'UPLOADING'
  | 'EXTRACTING_METADATA'
  | 'AI_ANALYSIS'
  | 'CREATING_RECORD'
  | 'COMPLETED'
  | 'FAILED';

export type ContractImportSessionStatus =
  | 'running'
  | 'completed'
  | 'completed_with_errors';

export type ContractImportFile = GooglePickerFile & {
  error?: string;
  status: ContractImportFileStatus;
};

export type ContractImportFileProgress = {
  error?: string;
  fileId: string;
  status: ContractImportFileStatus;
};

export type ContractImportSession = {
  files: ContractImportFile[];
  finishedAt: number | null;
  id: string;
  isExpanded: boolean;
  startedAt: number;
  status: ContractImportSessionStatus;
};

type ContractImportState = {
  session: ContractImportSession | null;
  applyBackendProgress: (updates: ContractImportFileProgress[]) => void;
  closeImportWidget: () => void;
  markCompletedBySourceFileIds: (fileIds: string[]) => void;
  markImportRequestFailed: (sessionId: string, message: string) => void;
  retryFailedFiles: () => void;
  setImportWidgetExpanded: (isExpanded: boolean) => void;
  startImportSession: (files: GooglePickerFile[]) => string;
};

const createSessionId = () => `contract-import-${Date.now()}`;

const mergeImportFiles = (
  currentFiles: ContractImportFile[],
  nextFiles: GooglePickerFile[],
): ContractImportFile[] => {
  const filesById = new Map(currentFiles.map((file) => [file.id, file]));

  nextFiles.forEach((file) => {
    if (!filesById.has(file.id)) {
      filesById.set(file.id, { ...file, status: 'QUEUED' });
    }
  });

  return Array.from(filesById.values());
};

const resolveSessionStatus = (
  files: ContractImportFile[],
): ContractImportSessionStatus => {
  if (files.some((file) => file.status === 'FAILED')) {
    return files.every(
      (file) => file.status === 'COMPLETED' || file.status === 'FAILED',
    )
      ? 'completed_with_errors'
      : 'running';
  }

  return files.every((file) => file.status === 'COMPLETED')
    ? 'completed'
    : 'running';
};

const resolveFinishedAt = (
  files: ContractImportFile[],
  previousFinishedAt: number | null,
): number | null => {
  const status = resolveSessionStatus(files);
  return status === 'running' ? null : previousFinishedAt ?? Date.now();
};

export const useContractImportStore = create<ContractImportState>(
  (set, get) => ({
    session: null,

    startImportSession: (files) => {
      const currentSession = get().session;
      const sessionId =
        currentSession?.status === 'running'
          ? currentSession.id
          : createSessionId();

      set((state) => {
        if (state.session?.status === 'running') {
          return {
            session: {
              ...state.session,
              files: mergeImportFiles(state.session.files, files),
              isExpanded: false,
              status: 'running',
            },
          };
        }

        return {
          session: {
            files: files.map((file) => ({ ...file, status: 'QUEUED' })),
            finishedAt: null,
            id: sessionId,
            isExpanded: false,
            startedAt: Date.now(),
            status: 'running',
          },
        };
      });

      return sessionId;
    },

    applyBackendProgress: (updates) => {
      if (updates.length === 0) {
        return;
      }

      set((state) => {
        if (!state.session) {
          return state;
        }

        const updatesByFileId = new Map(
          updates.map((update) => [update.fileId, update]),
        );
        let hasChanges = false;
        const files = state.session.files.map((file) => {
          const update = updatesByFileId.get(file.id);
          if (!update) {
            return file;
          }

          if (file.status !== update.status || file.error !== update.error) {
            hasChanges = true;
            return { ...file, error: update.error, status: update.status };
          }

          return file;
        });

        if (!hasChanges) {
          return state;
        }

        return {
          session: {
            ...state.session,
            files,
            finishedAt: resolveFinishedAt(files, state.session.finishedAt),
            status: resolveSessionStatus(files),
          },
        };
      });
    },

    markCompletedBySourceFileIds: (fileIds) => {
      if (fileIds.length === 0) {
        return;
      }

      set((state) => {
        if (!state.session || state.session.status !== 'running') {
          return state;
        }

        const completedIds = new Set(fileIds);
        let hasChanges = false;
        const files = state.session.files.map((file) => {
          if (completedIds.has(file.id) && file.status !== 'FAILED') {
            if (file.status !== 'COMPLETED') {
              hasChanges = true;
            }

            return { ...file, status: 'COMPLETED' as const };
          }

          return file;
        });

        if (!hasChanges) {
          return state;
        }

        return {
          session: {
            ...state.session,
            files,
            finishedAt: resolveFinishedAt(files, state.session.finishedAt),
            status: resolveSessionStatus(files),
          },
        };
      });
    },

    markImportRequestFailed: (sessionId, message) => {
      set((state) => {
        if (!state.session || state.session.id !== sessionId) {
          return state;
        }

        const files = state.session.files.map((file) =>
          file.status === 'COMPLETED'
            ? file
            : { ...file, error: message, status: 'FAILED' as const },
        );

        return {
          session: {
            ...state.session,
            files,
            finishedAt: Date.now(),
            status: 'completed_with_errors',
          },
        };
      });
    },

    retryFailedFiles: () => {
      // TODO: conectar con POST /integrations/drive/imports/{import_id}/retry-failed cuando backend lo exponga.
      set((state) => {
        if (!state.session) {
          return state;
        }

        const files = state.session.files.map((file) =>
          file.status === 'FAILED'
            ? { ...file, error: undefined, status: 'QUEUED' as const }
            : file,
        );

        return {
          session: {
            ...state.session,
            files,
            finishedAt: null,
            status: 'running',
          },
        };
      });
    },

    setImportWidgetExpanded: (isExpanded) => {
      set((state) => ({
        session: state.session ? { ...state.session, isExpanded } : null,
      }));
    },

    closeImportWidget: () => {
      set({ session: null });
    },
  }),
);
