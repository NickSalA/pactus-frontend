'use client';

import { useCallback, useMemo, useState } from 'react';
import { useServicesAdmin } from '@/queries/hooks/contracts/queries';
import {
  useCreateServiceCatalogItem,
  useDeleteServiceCatalogItem,
  useUpdateServiceCatalogItem,
} from '@/queries/hooks/contracts/mutations';
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';
import {
  ApiServiceCreateRequest,
  ApiServiceResponse,
  ApiServiceUpdateRequest,
} from '@/types/api';

export function useAdminServices() {
  const access = useAdminGuard();
  const [editingService, setEditingService] =
    useState<ApiServiceResponse | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const {
    data: services = [],
    isLoading: loading,
    error,
    refetch: reload,
  } = useServicesAdmin(true);

  const createServiceMutation = useCreateServiceCatalogItem();
  const updateServiceMutation = useUpdateServiceCatalogItem();
  const deleteServiceMutation = useDeleteServiceCatalogItem();

  const saving =
    createServiceMutation.isPending ||
    updateServiceMutation.isPending ||
    deleteServiceMutation.isPending;

  const stats = useMemo(
    () => ({
      activeCount: services.filter((service: ApiServiceResponse) => service.is_active)
        .length,
      inUseCount: services.filter(
        (service: ApiServiceResponse) => service.documents_count > 0,
      ).length,
      totalCount: services.length,
    }),
    [services],
  );

  const openCreateEditor = useCallback(() => {
    setEditingService(null);
    setIsEditorOpen(true);
  }, []);

  const openEditEditor = useCallback((service: ApiServiceResponse) => {
    setEditingService(service);
    setIsEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    if (saving) {
      return;
    }

    setEditingService(null);
    setIsEditorOpen(false);
  }, [saving]);

  const saveService = useCallback(
    async (payload: ApiServiceCreateRequest | ApiServiceUpdateRequest) => {
      if (editingService) {
        await updateServiceMutation.mutateAsync({
          serviceId: editingService.id,
          payload: payload as ApiServiceUpdateRequest,
        });
      } else {
        await createServiceMutation.mutateAsync(
          payload as ApiServiceCreateRequest,
        );
      }

      setEditingService(null);
      setIsEditorOpen(false);
    },
    [editingService, createServiceMutation, updateServiceMutation],
  );

  const toggleService = useCallback(
    async (service: ApiServiceResponse) => {
      await updateServiceMutation.mutateAsync({
        serviceId: service.id,
        payload: { is_active: !service.is_active },
      });
    },
    [updateServiceMutation],
  );

  const removeService = useCallback(
    async (serviceId: number) => {
      await deleteServiceMutation.mutateAsync(serviceId);
    },
    [deleteServiceMutation],
  );

  return {
    ...access,
    closeEditor,
    editingService,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    isEditorOpen,
    loading,
    openCreateEditor,
    openEditEditor,
    reload,
    removeService,
    saveService,
    saving,
    services,
    stats,
    toggleService,
  };
}