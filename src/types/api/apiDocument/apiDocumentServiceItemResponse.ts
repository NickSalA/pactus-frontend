import type { ApiCurrencyType } from '../shared';
import type { ApiDocumentServiceItemRequest } from './apiDocumentServiceItemRequest';

export interface ApiDocumentServiceItemResponse extends ApiDocumentServiceItemRequest {
  id: number;
}