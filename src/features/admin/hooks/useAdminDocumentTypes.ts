'use client';

import { useMemo } from 'react';
import { useDocuments } from '@/queries/hooks/contracts/queries';
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';
import { ApiDocumentType } from '@/types/api';

type DocumentTypeCatalogItem = {
  code: ApiDocumentType;
  count: number;
  description: string;
  editable: boolean;
  label: string;
};

export function useAdminDocumentTypes() {
  const access = useAdminGuard();

  const {
    data: documents = [],
    isLoading: loading,
    error,
    refetch: reload,
  } = useDocuments();

  const items = useMemo<DocumentTypeCatalogItem[]>(() => {
    const companyCount = documents.filter(
      (document) => document.contract_type === 'COMPANY',
    ).length;
    const laborCount = documents.filter(
      (document) => document.contract_type === 'LABOR',
    ).length;

    return [
      {
        code: 'COMPANY',
        count: companyCount,
        description:
          'Contratos comerciales y corporativos del flujo operativo.',
        editable: false,
        label: 'Empresa',
      },
      {
        code: 'LABOR',
        count: laborCount,
        description:
          'Contratos laborales y de RRHH administrados por recursos humanos.',
        editable: false,
        label: 'Trabajador',
      },
    ];
  }, [documents]);

  return {
    ...access,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    items,
    loading,
    reload,
  };
}