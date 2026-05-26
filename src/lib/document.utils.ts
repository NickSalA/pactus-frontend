import { DocumentFlatten } from '@/types/ui.types';
import {
  ApiDocumentFormData,
  ApiDocumentState,
  ApiDocumentType,
  ApiCurrencyType,
} from '@/types/api';

export const DOCUMENT_TYPE_OPTIONS: Array<{
  value: ApiDocumentType;
  label: string;
}> = [
  { value: 'COMPANY', label: 'Empresa' },
  { value: 'LABOR', label: 'Trabajador' },
];

export const DOCUMENT_STATE_OPTIONS: Array<{
  value: ApiDocumentState;
  label: string;
}> = [
  { value: 'DRAFT', label: 'Borrador' },
  { value: 'PENDING_SIGNATURE', label: 'Pendiente de firma' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'EXPIRING_SOON', label: 'Por vencer' },
  { value: 'EXPIRED', label: 'Expirado' },
];

export const CURRENCY_OPTIONS: ApiCurrencyType[] = ['USD', 'EUR', 'PEN'];

const readNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const readString = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

export const getDocumentTypeLabel = (type: ApiDocumentType): string => {
  return (
    DOCUMENT_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type
  );
};

export const getDocumentStateLabel = (state: ApiDocumentState): string => {
  return (
    DOCUMENT_STATE_OPTIONS.find((option) => option.value === state)?.label ??
    state
  );
};

export const getDocumentStateClasses = (state: ApiDocumentState): string => {
  switch (state) {
    case 'DRAFT':
      return 'bg-slate-100 text-slate-700 ring-1 ring-slate-600/20';
    case 'PENDING_SIGNATURE':
      return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
    case 'EXPIRING_SOON':
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
    case 'EXPIRED':
      return 'bg-red-50 text-red-700 ring-1 ring-red-600/20';
    default:
      return 'bg-slate-50 text-slate-700 ring-1 ring-slate-600/20';
  }
};

export const getDashboardDocumentStateClasses = (
  state: ApiDocumentState,
): string => {
  switch (state) {
    case 'DRAFT':
      return 'bg-slate-100 text-slate-700';
    case 'PENDING_SIGNATURE':
      return 'bg-blue-100 text-blue-700';
    case 'ACTIVE':
      return 'bg-emerald-100 text-emerald-700';
    case 'EXPIRING_SOON':
      return 'bg-amber-100 text-amber-700';
    case 'EXPIRED':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export const getDocumentValue = (
  formData: ApiDocumentFormData,
): number | null => readNumber(formData.value);

export const getDocumentCurrency = (
  formData: ApiDocumentFormData,
): ApiCurrencyType | null => {
  const currency = readString(formData.currency);

  if (currency === 'USD' || currency === 'EUR' || currency === 'PEN') {
    return currency;
  }

  return null;
};

export const getDocumentTotalValue = (
  document: Pick<DocumentFlatten, 'form_data' | 'service_items'>,
): number => {
  if (document.service_items.length > 0) {
    return document.service_items.reduce((total, serviceItem) => {
      const value = readNumber(serviceItem.value);
      return total + (value ?? 0);
    }, 0);
  }

  return getDocumentValue(document.form_data) ?? 0;
};

export const getDocumentPrimaryCurrency = (
  document: Pick<DocumentFlatten, 'form_data' | 'service_items'>,
): ApiCurrencyType | null => {
  const serviceCurrency = document.service_items[0]?.currency;
  if (
    serviceCurrency === 'USD' ||
    serviceCurrency === 'EUR' ||
    serviceCurrency === 'PEN'
  ) {
    return serviceCurrency;
  }

  return getDocumentCurrency(document.form_data);
};

export const formatCurrencyAmount = (
  amount: number,
  currency: ApiCurrencyType | null,
): string => {
  const formattedAmount = amount.toLocaleString('es-PE', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return currency ? `${currency} ${formattedAmount}` : formattedAmount;
};

export const getDocumentSummary = (
  document: Pick<DocumentFlatten, 'form_data' | 'service_items'>,
): string => {
  const parts: string[] = [];
  const totalValue = getDocumentTotalValue(document);
  const currency = getDocumentPrimaryCurrency(document);

  if (totalValue > 0) {
    parts.push(formatCurrencyAmount(totalValue, currency));
  }

  if (document.service_items.length > 0) {
    parts.push(
      `${document.service_items.length} servicio${document.service_items.length === 1 ? '' : 's'}`,
    );
  }

  return parts.join(' · ');
};

export const getDocumentFileLabel = (
  document: Pick<DocumentFlatten, 'file_name'>,
): string => {
  return readString(document.file_name) ?? 'Sin archivo';
};
