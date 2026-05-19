import type { DocumentFlatten, DocumentFormData } from '@/types/api.types';
import type { ApiCurrencyType } from '@/types/api.types';

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
}: BuildContractFormDataPayloadOptions): DocumentFormData => {
  const payload: DocumentFormData =
    editMode && initialData ? { ...initialData.form_data } : {};

  delete payload.licenses;
  payload.value = contractTotal;
  payload.currency = currency;

  return payload;
};
