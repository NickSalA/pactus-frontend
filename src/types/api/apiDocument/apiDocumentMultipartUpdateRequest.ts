import type { ApiDocumentUpdateRequest } from './apiDocumentUpdateRequest';

export interface ApiDocumentMultipartUpdateRequest {
  file: File | null;
  document: ApiDocumentUpdateRequest;
}