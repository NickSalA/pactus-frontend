'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDocuments } from '@/api';
import { useAdminGuard } from '@/features/admin/hooks/use-admin-guard';
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
  const [counts, setCounts] = useState<Record<ApiDocumentType, number>>({
    COMPANY: 0,
    LABOR: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = useCallback(
    async (options: { force?: boolean } = {}) => {
      if (!access.isAdmin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const documents = await getDocuments();
        const nextCounts = {
          COMPANY: documents.filter(
            (document) => document.contract_type === 'COMPANY',
          ).length,
          LABOR: documents.filter(
            (document) => document.contract_type === 'LABOR',
          ).length,
        };
        setCounts(nextCounts);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar el catálogo de tipos de documento.',
        );
      } finally {
        setLoading(false);
      }
    },
    [access.isAdmin],
  );

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const items = useMemo<DocumentTypeCatalogItem[]>(
    () => [
      {
        code: 'COMPANY',
        count: counts.COMPANY,
        description:
          'Contratos comerciales y corporativos del flujo operativo.',
        editable: false,
        label: 'Empresa',
      },
      {
        code: 'LABOR',
        count: counts.LABOR,
        description:
          'Contratos laborales y de RRHH administrados por recursos humanos.',
        editable: false,
        label: 'Trabajador',
      },
    ],
    [counts],
  );

  return {
    ...access,
    error,
    items,
    loading,
    reload: () => loadCatalog({ force: true }),
  };
}