import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { streamGoogleDriveImportEvents } from '@/api';
import type {
  ApiIntegrationImportFileUpdateEventData,
  ApiIntegrationImportInitialStateEventData,
  ApiIntegrationImportJobCompleteEventData,
} from '@/types/api';

const CONTRACTS_KEY = ['contracts'] as const;

type UseDriveImportEventsOptions = {
  enabled: boolean;
  jobId: string | null;
  onError: (jobId: string, message: string) => void;
  onFileUpdate: (event: ApiIntegrationImportFileUpdateEventData) => void;
  onInitialState: (event: ApiIntegrationImportInitialStateEventData) => void;
  onJobComplete: (event: ApiIntegrationImportJobCompleteEventData) => void;
};

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === 'AbortError';

export function useDriveImportEvents({
  enabled,
  jobId,
  onError,
  onFileUpdate,
  onInitialState,
  onJobComplete,
}: UseDriveImportEventsOptions) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !jobId) {
      return;
    }

    const controller = new AbortController();
    let isActive = true;

    void streamGoogleDriveImportEvents(jobId, {
      signal: controller.signal,
      onFileUpdate,
      onInitialState,
      onJobComplete: (event) => {
        onJobComplete(event);
        void queryClient.invalidateQueries({ queryKey: CONTRACTS_KEY });
      },
    }).catch((error) => {
      if (!isActive || isAbortError(error)) {
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo seguir el progreso de la importacion.';
      onError(jobId, message);
    });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [
    enabled,
    jobId,
    onError,
    onFileUpdate,
    onInitialState,
    onJobComplete,
    queryClient,
  ]);
}
