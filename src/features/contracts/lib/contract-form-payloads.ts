import type { DocumentFlatten } from '@/types/api.types';
import { ApiCurrencyType, ApiDocumentFormData } from '@/types/api';

type BuildContractFormDataPayloadOptions = {
  contractTotal: number;
  currency: ApiCurrencyType;
  editMode?: boolean;
  initialData?: DocumentFlatten;
};

export const buildContractFormDataPayload = ({
  contractTotal,
  currency,
  editMode = false,
  initialData,
}: BuildContractFormDataPayloadOptions): ApiDocumentFormData => {
  const payload: ApiDocumentFormData =
    editMode && initialData ? { ...initialData.form_data } : {};

  delete payload.licenses;
  payload.value = contractTotal;
  payload.currency = currency;

  return payload;
};
