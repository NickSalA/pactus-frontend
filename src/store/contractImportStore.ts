import { create } from 'zustand';
import type { GooglePickerFile } from '@/lib/googlePicker';
import type {
  ApiIntegrationImportEventData,
  ApiIntegrationImportFilePhase,
  ApiIntegrationImportJobStatus,
} from '@/types/api';

export type ContractImportFileStatus = ApiIntegrationImportFilePhase;

export type ContractImportSessionStatus =
  | 'running'
  | 'completed'
  | 'completed_with_errors'
  | 'failed';

export type ContractImportFile = GooglePickerFile & {
  error?: string;
  status: ContractImportFileStatus;
};

export type ContractImportSession = {
  backendStatus: ApiIntegrationImportJobStatus;
  files: ContractImportFile[];
  finishedAt: number | null;
  id: string;
  isExpanded: boolean;
  jobId: string | null;
  startedAt: number;
  status: ContractImportSessionStatus;
  streamError?: string;
};

type ContractImportState = {
  session: ContractImportSession | null;
  applyImportEvent: (event: ApiIntegrationImportEventData) => void;
  attachJobToSession: (sessionId: string, jobId: string) => void;
  closeImportWidget: () => void;
  markImportRequestFailed: (sessionId: string, message: string) => void;
  markImportStreamFailed: (jobId: string, message: string) => void;
  setImportWidgetExpanded: (isExpanded: boolean) => void;
  startImportSession: (files: GooglePickerFile[]) => string;
};

const createSessionId = () => `contract-import-${Date.now()}`;
const CRITICAL_JOB_ERROR = 'La importacion fallo criticamente.';

const isTerminalFileStatus = (status: ContractImportFileStatus): boolean =>
  status === 'COMPLETED' || status === 'FAILED';

const resolveSessionStatus = (
  files: ContractImportFile[],
  backendStatus: ApiIntegrationImportJobStatus = 'RUNNING',
): ContractImportSessionStatus => {
  if (backendStatus === 'FAILED') {
    return 'failed';
  }

  if (backendStatus === 'COMPLETED') {
    return files.some((file) => file.status === 'FAILED')
      ? 'completed_with_errors'
      : 'completed';
  }

  if (!files.every((file) => isTerminalFileStatus(file.status))) {
    return 'running';
  }

  return files.some((file) => file.status === 'FAILED')
    ? 'completed_with_errors'
    : 'completed';
};

const resolveFinishedAt = (
  status: ContractImportSessionStatus,
  previousFinishedAt: number | null,
): number | null => {
  return status === 'running' ? null : previousFinishedAt ?? Date.now();
};

const syncFilesWithImportEvent = (
  currentFiles: ContractImportFile[],
  event: ApiIntegrationImportEventData,
): ContractImportFile[] => {
  const backendFilesById = new Map(
    event.files.map((file) => [file.file_id, file]),
  );

  return currentFiles.map((file) => {
    const backendFile = backendFilesById.get(file.id);
    let status = backendFile?.phase ?? file.status;
    let error = backendFile?.error ?? file.error;

    if (event.status === 'FAILED' && status !== 'COMPLETED') {
      status = 'FAILED';
      error = error ?? event.error ?? CRITICAL_JOB_ERROR;
    }

    return {
      ...file,
      error: error ?? undefined,
      status,
    };
  });
};

export const useContractImportStore = create<ContractImportState>(
  (set, get) => ({
    session: null,

    startImportSession: (files) => {
      const currentSession = get().session;
      if (currentSession?.status === 'running') {
        return currentSession.id;
      }

      const sessionId = createSessionId();

      set({
        session: {
          backendStatus: 'RUNNING',
          files: files.map((file) => ({ ...file, status: 'PENDING' })),
          finishedAt: null,
          id: sessionId,
          isExpanded: false,
          jobId: null,
          startedAt: Date.now(),
          status: 'running',
        },
      });

      return sessionId;
    },

    attachJobToSession: (sessionId, jobId) => {
      set((state) => {
        if (!state.session || state.session.id !== sessionId) {
          return state;
        }

        return {
          session: {
            ...state.session,
            jobId,
            streamError: undefined,
          },
        };
      });
    },

    applyImportEvent: (event) => {
      set((state) => {
        if (!state.session || state.session.jobId !== event.job_id) {
          return state;
        }

        const files = syncFilesWithImportEvent(state.session.files, event);
        const status = resolveSessionStatus(files, event.status);

        return {
          session: {
            ...state.session,
            backendStatus: event.status,
            files,
            finishedAt: resolveFinishedAt(status, state.session.finishedAt),
            status,
            streamError: undefined,
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
            backendStatus: 'FAILED',
            files,
            finishedAt: Date.now(),
            status: 'failed',
            streamError: undefined,
          },
        };
      });
    },

    markImportStreamFailed: (jobId, message) => {
      set((state) => {
        if (
          !state.session ||
          state.session.jobId !== jobId ||
          state.session.status !== 'running'
        ) {
          return state;
        }

        return {
          session: {
            ...state.session,
            streamError: message,
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
