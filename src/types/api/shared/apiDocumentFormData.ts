import { ApiCurrencyType } from './apiCurrencyType';

export interface ApiDocumentFormData {
  value?: number;
  currency?: ApiCurrencyType;
  [key: string]: unknown;
}
