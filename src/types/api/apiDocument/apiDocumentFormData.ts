import type { ApiCurrencyType } from "../shared";

export interface ApiDocumentFormData {
  value?: number;
  currency?: ApiCurrencyType;
  [key: string]: unknown;
}