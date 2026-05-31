import type { GooglePickerFile } from '@/lib/googlePicker';
import { GOOGLE_DRIVE_SCOPE } from '@/lib/googlePicker';
import { isDriveFolder } from '@/lib/googlePicker';
import type {
  ApiDocumentCreateRequest,
  ApiDocumentUpdateRequest,
  ApiIntegrationImportFileUpdateEventData,
  ApiIntegrationImportInitialStateEventData,
  ApiIntegrationImportJobCompleteEventData,
  ApiIntegrationImportRequest,
  ApiIntegrationImportResponse,
} from '@/types/api';
import { getAccessToken } from './token-store';
import { getApiBaseUrl, TIMEOUTS } from './constants';
import { apiPost } from './axiosInstance';

type DriveImportDocumentPayload = Omit<ApiDocumentUpdateRequest, 'file'>;

export type GoogleDriveImportResponse = ApiIntegrationImportResponse & {
  skipped_files: number;
};

type ImportGoogleDriveFilesOptions = {
  document?: ApiDocumentCreateRequest;
  folderId?: number | null;
};

type GoogleDriveImportEventName =
  | 'initial_state'
  | 'file_update'
  | 'job_complete'
  | 'ping';

type GoogleDriveImportSseFrame = {
  event?: string;
  data: string;
};

export type GoogleDriveImportEventHandlers = {
  signal?: AbortSignal;
  onInitialState?: (data: ApiIntegrationImportInitialStateEventData) => void;
  onFileUpdate?: (data: ApiIntegrationImportFileUpdateEventData) => void;
  onJobComplete?: (data: ApiIntegrationImportJobCompleteEventData) => void;
};

const parseSseFrame = (frame: string): GoogleDriveImportSseFrame | null => {
  const lines = frame.split(/\r?\n/);
  let event: string | undefined;
  const dataLines: string[] = [];

  for (const line of lines) {
    if (!line || line.startsWith(':')) {
      continue;
    }

    const separatorIndex = line.indexOf(':');
    const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
    const value =
      separatorIndex === -1 ? '' : line.slice(separatorIndex + 1).trimStart();

    if (field === 'event') {
      event = value;
      continue;
    }

    if (field === 'data') {
      dataLines.push(value);
    }
  }

  if (!event && dataLines.length === 0) {
    return null;
  }

  return { event, data: dataLines.join('\n') };
};

const parseSseData = <T>(event: GoogleDriveImportEventName, data: string): T => {
  try {
    return JSON.parse(data) as T;
  } catch {
    throw new Error(`No se pudo interpretar el evento SSE ${event}.`);
  }
};

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === 'AbortError';

const handleGoogleDriveImportFrame = (
  frame: GoogleDriveImportSseFrame,
  handlers: GoogleDriveImportEventHandlers,
) => {
  const event = (frame.event ?? 'message') as GoogleDriveImportEventName;

  if (event === 'ping' || frame.data === 'ping') {
    return;
  }

  if (event === 'initial_state') {
    handlers.onInitialState?.(
      parseSseData<ApiIntegrationImportInitialStateEventData>(event, frame.data),
    );
    return;
  }

  if (event === 'file_update') {
    handlers.onFileUpdate?.(
      parseSseData<ApiIntegrationImportFileUpdateEventData>(event, frame.data),
    );
    return;
  }

  if (event === 'job_complete') {
    handlers.onJobComplete?.(
      parseSseData<ApiIntegrationImportJobCompleteEventData>(event, frame.data),
    );
  }
};

const getGoogleDriveImportEventsErrorMessage = (status: number): string => {
  if (status === 401) {
    return 'No se pudo conectar al progreso de importacion: sesion no autorizada.';
  }

  if (status === 403) {
    return 'No tienes permisos para consultar el progreso de esta importacion.';
  }

  if (status === 404) {
    return 'No se encontro la importacion de Google Drive solicitada.';
  }

  if (status === 409) {
    return 'La importacion de Google Drive no esta disponible para seguimiento en este estado.';
  }

  return `No se pudo conectar al progreso de importacion. Error ${status}.`;
};

export async function importGoogleDriveFiles(
  accessToken: string,
  files: GooglePickerFile[],
  options: ImportGoogleDriveFilesOptions = {},
): Promise<GoogleDriveImportResponse> {
  const importableFiles = files.filter((file) => !isDriveFolder(file));
  const skippedFiles = files.length - importableFiles.length;

  if (!accessToken.trim()) {
    throw new Error(
      'No se encontro un token valido de Google Drive para importar los archivos.',
    );
  }

  if (importableFiles.length === 0) {
    throw new Error(
      'Selecciona al menos un archivo de Google Drive. Las carpetas no se pueden importar.',
    );
  }

  const documentPayload = {
    ...(options.document ?? {}),
    folder_id: options.folderId ?? options.document?.folder_id ?? null,
  } satisfies DriveImportDocumentPayload;

  const response = await apiPost<ApiIntegrationImportResponse>(
    '/integrations/drive/import',
    {
      token: {
        token: accessToken,
        scopes: [GOOGLE_DRIVE_SCOPE],
      },
      files: importableFiles.map((file) => ({
        file_id: file.id,
        document: documentPayload,
      })),
    } satisfies ApiIntegrationImportRequest,
    { timeout: TIMEOUTS.UPLOAD },
  );

  if (!response.job_id?.trim()) {
    throw new Error('El backend no envio el job_id de la importacion.');
  }

  return {
    ...response,
    skipped_files: skippedFiles,
  };
}

export async function streamGoogleDriveImportEvents(
  jobId: string,
  handlers: GoogleDriveImportEventHandlers = {},
): Promise<void> {
  const normalizedJobId = jobId.trim();

  if (!normalizedJobId) {
    throw new Error('No se encontro un job_id valido para seguir la importacion.');
  }

  const token = await getAccessToken();

  if (!token) {
    throw new Error('No se encontro una sesion valida para seguir la importacion.');
  }

  const baseUrl = getApiBaseUrl().replace(/\/$/, '');
  const url = `${baseUrl}/integrations/drive/import/${encodeURIComponent(
    normalizedJobId,
  )}/events`;

  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${token}`,
      },
      signal: handlers.signal,
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }

    throw new Error('No se pudo conectar al stream de importacion de Google Drive.');
  }

  if (!response.ok) {
    throw new Error(getGoogleDriveImportEventsErrorMessage(response.status));
  }

  if (!response.body) {
    throw new Error('El stream de importacion de Google Drive no envio datos.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let receivedJobComplete = false;

  try {
    while (true) {
      const { value, done } = await reader.read();

      buffer += decoder.decode(value, { stream: !done });
      const frames = buffer.split(/\r?\n\r?\n/);
      buffer = frames.pop() ?? '';

      for (const rawFrame of frames) {
        const frame = parseSseFrame(rawFrame);

        if (frame) {
          receivedJobComplete =
            receivedJobComplete || frame.event === 'job_complete';
          handleGoogleDriveImportFrame(frame, handlers);
        }
      }

      if (done) {
        break;
      }
    }

    const finalFrame = parseSseFrame(buffer);

    if (finalFrame) {
      receivedJobComplete =
        receivedJobComplete || finalFrame.event === 'job_complete';
      handleGoogleDriveImportFrame(finalFrame, handlers);
    }
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }

    throw new Error('Se perdio la conexion con el stream de importacion de Google Drive.');
  } finally {
    reader.releaseLock();
  }

  if (!receivedJobComplete) {
    throw new Error(
      'El stream de importacion termino antes de recibir el resultado final.',
    );
  }
}
