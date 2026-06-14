import type {
  ApiAuditUserActivityAction,
  ApiAuditChatbotActivityAction,
  ApiAuditTemplateActivityAction,
  ApiAuditContractActivityAction,
} from '@/types/api';

export const USER_ACTION_LABELS: Record<ApiAuditUserActivityAction, string> = {
  CREATED: 'Creación',
  UPDATED: 'Actualización',
  DELETED: 'Eliminación',
};

export const USER_ACTION_COLORS: Record<ApiAuditUserActivityAction, string> = {
  CREATED: 'bg-green-100 text-green-700',
  UPDATED: 'bg-blue-100 text-blue-700',
  DELETED: 'bg-red-100 text-red-700',
};

export const CHATBOT_ACTION_LABELS: Record<
  ApiAuditChatbotActivityAction,
  string
> = {
  CONVERSATION_STARTED: 'Inicio de conversación',
  MESSAGE_SENT: 'Mensaje enviado',
  RESPONSE_GENERATED: 'Respuesta generada',
};

export const CHATBOT_ACTION_COLORS: Record<
  ApiAuditChatbotActivityAction,
  string
> = {
  CONVERSATION_STARTED: 'bg-emerald-100 text-emerald-700',
  MESSAGE_SENT: 'bg-blue-100 text-blue-700',
  RESPONSE_GENERATED: 'bg-violet-100 text-violet-700',
};

export const TEMPLATE_ACTION_LABELS: Record<ApiAuditTemplateActivityAction, string> = {
  CREATED: 'Creación',
  UPDATED: 'Actualización',
  DELETED: 'Eliminación',
  ARCHIVED: 'Archivado',
};

export const TEMPLATE_ACTION_COLORS: Record<ApiAuditTemplateActivityAction, string> = {
  CREATED: 'bg-green-100 text-green-700',
  UPDATED: 'bg-blue-100 text-blue-700',
  DELETED: 'bg-red-100 text-red-700',
  ARCHIVED: 'bg-amber-100 text-amber-700',
};

export const CONTRACT_ACTION_LABELS: Record<ApiAuditContractActivityAction, string> = {
  CREATED: 'Creación',
  GENERATED_FROM_TEMPLATE: 'Generado desde plantilla',
  IMPORTED_FROM_GOOGLE_DRIVE: 'Importado desde Drive',
  UPDATED: 'Actualización',
  DELETED: 'Eliminación',
};

export const CONTRACT_ACTION_COLORS: Record<ApiAuditContractActivityAction, string> = {
  CREATED: 'bg-green-100 text-green-700',
  GENERATED_FROM_TEMPLATE: 'bg-violet-100 text-violet-700',
  IMPORTED_FROM_GOOGLE_DRIVE: 'bg-sky-100 text-sky-700',
  UPDATED: 'bg-blue-100 text-blue-700',
  DELETED: 'bg-red-100 text-red-700',
};

export function formatUsd(value: number | null): string {
  if (value === null || value === undefined) return '—';
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });
}

export function formatNumber(value: number | null): string {
  if (value === null || value === undefined) return '—';
  return value.toLocaleString('es-ES');
}

export function formatCost(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const num = Number(value);
  if (isNaN(num)) return '—';
  return num.toFixed(10).replace(/\.?0+$/, '');
}
