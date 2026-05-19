import type {
  ApiDashboardRecentContractResponse,
  ApiDocumentState,
} from '@/types/api';

export type RecentDashboardDocument = {
  id: number;
  name: string;
  subtitle: string;
  status: ApiDocumentState;
  modified: string;
};

export const buildRecentDocumentsFromAPI = (
  contracts: ApiDashboardRecentContractResponse[],
): RecentDashboardDocument[] => {
  return contracts.map((contract) => ({
    id: contract.id,
    name: contract.title,
    subtitle: 'Sin detalles',
    status: 'ACTIVE' as ApiDocumentState,
    modified: contract.dates,
  }));
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export const COLORS = {
  COMPANY: '#3B82F6',
  LABOR: '#EF4444',
} as const;