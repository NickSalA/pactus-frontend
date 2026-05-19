import {
  getDocumentFileLabel,
  getDocumentTypeLabel,
} from '@/lib/document.utils';
import type { Document, DocumentState } from '@/types/api.types';
import { ApiDashboardRecentContractResponse } from '@/types/api';

export type DashboardMetricTone = 'primary' | 'warning' | 'danger';

export type DashboardMetric = {
  id: 'total' | 'expiring' | 'expired';
  title: string;
  value: string;
  change: string;
  positive: boolean;
  tone: DashboardMetricTone;
};

export type RecentDashboardDocument = {
  id: number;
  name: string;
  subtitle: string;
  status: DocumentState;
  modified: string;
};

const monthKey = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth() + 1}`;

const formatRelative = (dateString: string): string => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return 'hace unos minutos';
  }

  if (diffHours < 24) {
    return `hace ${diffHours} h`;
  }

  if (diffDays < 30) {
    return `hace ${diffDays} d`;
  }

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatChange = (
  current: number,
  previous: number,
): { label: string; positive: boolean } => {
  if (previous === 0 && current === 0) {
    return { label: '0%', positive: true };
  }

  if (previous === 0) {
    return { label: '+100%', positive: true };
  }

  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(change);
  const signal = rounded > 0 ? '+' : '';

  return {
    label: `${signal}${rounded}%`,
    positive: rounded >= 0,
  };
};

export const buildDashboardMetrics = (
  documents: Document[],
): DashboardMetric[] => {
  const now = new Date();
  const currentMonth = monthKey(now);
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonth = monthKey(previousMonthDate);

  const docsByCreationMonth = documents.reduce<Record<string, number>>(
    (accumulator, document) => {
      const key = monthKey(new Date(document.created_at));
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    },
    {},
  );

  const expiringByUpdatedMonth = documents.reduce<Record<string, number>>(
    (accumulator, document) => {
      if (document.state !== 'EXPIRING_SOON') {
        return accumulator;
      }

      const key = monthKey(new Date(document.updated_at));
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    },
    {},
  );

  const expiredByUpdatedMonth = documents.reduce<Record<string, number>>(
    (accumulator, document) => {
      if (document.state !== 'EXPIRED') {
        return accumulator;
      }

      const key = monthKey(new Date(document.updated_at));
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    },
    {},
  );

  const totalContracts = documents.length;
  const expiringContracts = documents.filter(
    (document) => document.state === 'EXPIRING_SOON',
  ).length;
  const expiredContracts = documents.filter(
    (document) => document.state === 'EXPIRED',
  ).length;

  const totalChange = formatChange(
    docsByCreationMonth[currentMonth] || 0,
    docsByCreationMonth[previousMonth] || 0,
  );
  const expiringChange = formatChange(
    expiringByUpdatedMonth[currentMonth] || 0,
    expiringByUpdatedMonth[previousMonth] || 0,
  );
  const expiredChange = formatChange(
    expiredByUpdatedMonth[currentMonth] || 0,
    expiredByUpdatedMonth[previousMonth] || 0,
  );

  return [
    {
      id: 'total',
      title: 'TOTAL DE CONTRATOS',
      value: totalContracts.toLocaleString('es-ES'),
      change: totalChange.label,
      positive: totalChange.positive,
      tone: 'primary',
    },
    {
      id: 'expiring',
      title: 'POR VENCER',
      value: expiringContracts.toLocaleString('es-ES'),
      change: expiringChange.label,
      positive: !expiringChange.positive,
      tone: 'warning',
    },
    {
      id: 'expired',
      title: 'EXPIRADOS',
      value: expiredContracts.toLocaleString('es-ES'),
      change: expiredChange.label,
      positive: !expiredChange.positive,
      tone: 'danger',
    },
  ];
};

export const buildRecentDocuments = (
  documents: Document[],
): RecentDashboardDocument[] => {
  return [...documents]
    .sort((a, b) => b.id - a.id)
    .map((document) => ({
      id: document.id,
      name: document.client || 'Sin nombre',
      subtitle: `${getDocumentTypeLabel(document.contract_type)} · ${getDocumentFileLabel(document)}`,
      status: document.state,
      modified: formatRelative(document.updated_at),
    }));
};

export const buildRecentDocumentsFromAPI = (
  contracts: ApiDashboardRecentContractResponse[],
): RecentDashboardDocument[] => {
  return contracts.map((contract) => ({
    id: contract.id,
    name: contract.title,
    subtitle: 'Sin detalles',
    status: 'ACTIVE' as DocumentState,
    modified: contract.dates,
  }));
};
