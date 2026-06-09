import type { ApiAuditUserActivityAction } from '@/types/api';

export const ACTION_LABELS: Record<ApiAuditUserActivityAction, string> = {
  CREATED: 'Creación',
  UPDATED: 'Actualización',
  DELETED: 'Eliminación',
};

export const ACTION_COLORS: Record<ApiAuditUserActivityAction, string> = {
  CREATED: 'bg-green-100 text-green-700',
  UPDATED: 'bg-blue-100 text-blue-700',
  DELETED: 'bg-red-100 text-red-700',
};
