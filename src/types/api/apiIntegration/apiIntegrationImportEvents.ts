export type ApiIntegrationImportJobStatus =
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED';

export type ApiIntegrationImportFilePhase =
  | 'PENDING'
  | 'DATABASE'
  | 'KNOWLEDGE_BASE'
  | 'COMPLETED'
  | 'FAILED';

export interface ApiIntegrationImportFileStatus {
  file_id: string;
  phase: ApiIntegrationImportFilePhase;
  error?: string | null;
}

export interface ApiIntegrationImportEventData {
  job_id: string;
  status: ApiIntegrationImportJobStatus;
  files: ApiIntegrationImportFileStatus[];
  error?: string | null;
}

export type ApiIntegrationImportInitialStateEventData =
  ApiIntegrationImportEventData;

export type ApiIntegrationImportFileUpdateEventData =
  ApiIntegrationImportEventData;

export type ApiIntegrationImportJobCompleteEventData =
  ApiIntegrationImportEventData;
