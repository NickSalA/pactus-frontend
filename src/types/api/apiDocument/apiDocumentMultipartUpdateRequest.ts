import type { ApiDocumentCreateRequest } from './apiDocumentCreateRequest';

export interface ApiDocumentMultipartUpdateRequest {
  file: File | null;
  document: ApiDocumentCreateRequest;
}