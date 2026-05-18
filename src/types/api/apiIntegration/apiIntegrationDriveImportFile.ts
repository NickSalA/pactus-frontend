import type { ApiDocumentCreateRequest } from '../apiDocument';

export interface ApiIntegrationDriveImportFile {
  file_id: string;
  document: ApiDocumentCreateRequest;
}