import type { GooglePickerFile } from '@/lib/googlePicker';
import { GOOGLE_DRIVE_SCOPE } from '@/lib/googlePicker';
import { isDriveFolder } from '@/lib/googlePicker';
import {
  ApiDocumentUpdateRequest,
  ApiIntegrationImportRequest,
  ApiIntegrationImportResponse,
} from '@/types/api';
import { TIMEOUTS } from './constants';
import { apiPost } from './axiosInstance';

type DriveImportDocumentPayload = Omit<ApiDocumentUpdateRequest, 'file'>;

export type GoogleDriveImportResponse = ApiIntegrationImportResponse & {
  skipped_files: number;
};

export async function importGoogleDriveFiles(
  accessToken: string,
  files: GooglePickerFile[],
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

  const response = await apiPost<ApiIntegrationImportResponse>(
    '/integrations/drive/import',
    {
      token: {
        token: accessToken,
        scopes: [GOOGLE_DRIVE_SCOPE],
      },
      files: importableFiles.map((file) => ({
        file_id: file.id,
        document: {} satisfies DriveImportDocumentPayload,
      })),
    } satisfies ApiIntegrationImportRequest,
    { timeout: TIMEOUTS.UPLOAD },
  );

  return {
    ...response,
    skipped_files: skippedFiles,
  };
}
