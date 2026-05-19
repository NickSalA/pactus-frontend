'use client';

import { useCallback, useEffect, useState } from 'react';
import { getDocuments } from '@/api';
import type { DocumentFlatten } from '@/types/ui.types';

export const useDashboardDocuments = () => {
  const [documents, setDocuments] = useState<DocumentFlatten[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDocuments(await getDocuments());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo cargar el dashboard',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDocuments();
  }, [loadDocuments]);

  return {
    documents,
    error,
    isLoading,
    reload: loadDocuments,
  };
};
