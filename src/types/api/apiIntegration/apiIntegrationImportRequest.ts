import type { ApiIntegrationDriveImportFile } from './apiIntegrationDriveImportFile';

export interface ApiIntegrationImportRequest {
  token: object;
  files: ApiIntegrationDriveImportFile[];
}