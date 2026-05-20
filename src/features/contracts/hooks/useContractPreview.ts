'use client';

import { useCallback, useState } from 'react';
import {
  hasContractPreviewFile,
  supportsInlineContractPreview,
} from '@/features/contracts/lib/contracts-preview.utils';
import { useDocumentFileUrl } from '@/queries/hooks/contracts/queries';
import type { DocumentFlatten } from '@/types/ui.types';

const PREVIEW_FILE_MISSING_MESSAGE =
  'Este contrato no tiene un archivo disponible para vista previa.';
const PREVIEW_OPENING_ERROR_MESSAGE = 'No se pudo abrir el documento';

const openUrlInNewTab = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

export function useContractPreview() {
  const [showPreview, setShowPreview] = useState(false);
  const [previewContract, setPreviewContract] =
    useState<DocumentFlatten | null>(null);

  const { data: previewUrl, isLoading: previewLoading, error } =
    useDocumentFileUrl(previewContract?.id ?? 0);

  const previewError =
    error instanceof Error ? error.message : error ? String(error) : null;

  const resetPreview = useCallback(() => {
    setShowPreview(false);
    setPreviewContract(null);
  }, []);

  const closePreview = useCallback(() => {
    resetPreview();
  }, [resetPreview]);

  const openPreviewInNewTab = useCallback(() => {
    if (!previewUrl) {
      return;
    }

    openUrlInNewTab(previewUrl);
  }, [previewUrl]);

  const openPreview = useCallback(
    (contract: DocumentFlatten) => {
      if (!hasContractPreviewFile(contract)) {
        window.alert(PREVIEW_FILE_MISSING_MESSAGE);
        return;
      }

      const supportsInlinePreview = supportsInlineContractPreview(contract);

      setPreviewContract(contract);
      setShowPreview(supportsInlinePreview);

      if (!supportsInlinePreview && previewUrl) {
        openUrlInNewTab(previewUrl);
      }
    },
    [previewUrl],
  );

  return {
    closePreview,
    openPreview,
    openPreviewInNewTab,
    previewContract,
    previewError,
    previewLoading,
    previewUrl: previewUrl ?? null,
    showPreview,
  };
}
