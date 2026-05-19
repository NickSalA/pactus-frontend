import type { ApiDocumentCreateRequest } from './apiDocumentCreateRequest';

export interface ApiDocumentMultipartCreateRequest {
  file: File;
  document: ApiDocumentCreateRequest;
}