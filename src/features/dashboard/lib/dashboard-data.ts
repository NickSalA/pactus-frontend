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