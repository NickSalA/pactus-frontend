'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createServiceCatalogItem,
  deleteServiceCatalogItem,
  getServicesAdmin,
  updateServiceCatalogItem,
} from '@/api';
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';

import {
  ApiServiceResponse,
  ApiServiceCreateRequest,
  ApiServiceUpdateRequest,
} from '@/types/api';

export function useAdminServices() {
  const access = useAdminGuard();
  const [services, setServices] = useState<ApiServiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingService, setEditingService] =
    useState<ApiServiceResponse | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const loadServices = useCallback(
    async (options: { force?: boolean } = {}) => {
      if (!access.isAdmin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const nextServices = await getServicesAdmin(true);
        setServices(nextServices);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar los servicios.',
        );
      } finally {
        setLoading(false);
      }
    },
    [access.isAdmin],
  );

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const stats = useMemo(
    () => ({
      activeCount: services.filter((service) => service.is_active).length,
      inUseCount: services.filter((service) => service.documents_count > 0)
        .length,
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
      try {
        setSaving(true);
        setError(null);

        if (editingService) {
          const updatedService = await updateServiceCatalogItem(
            editingService.id,
            payload as ApiServiceUpdateRequest,
          );
          setServices((previousServices) =>
            previousServices.map((service) =>
              service.id === updatedService.id ? updatedService : service,
            ),
          );
        } else {
          const createdService = await createServiceCatalogItem(
            payload as ApiServiceCreateRequest,
          );
          setServices((previousServices) => [
            ...previousServices,
            createdService,
          ]);
        }

        setEditingService(null);
        setIsEditorOpen(false);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudo guardar el servicio.';
        setError(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [editingService],
  );

  const toggleService = useCallback(async (service: ApiServiceResponse) => {
    try {
      setSaving(true);
      setError(null);
      const updatedService = await updateServiceCatalogItem(service.id, {
        is_active: !service.is_active,
      });
      setServices((previousServices) =>
        previousServices.map((currentService) =>
          currentService.id === updatedService.id
            ? updatedService
            : currentService,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar el estado del servicio.',
      );
    } finally {
      setSaving(false);
    }
  }, []);

  const removeService = useCallback(async (serviceId: number) => {
    try {
      setSaving(true);
      setError(null);
      await deleteServiceCatalogItem(serviceId);
      setServices((previousServices) =>
        previousServices.filter((service) => service.id !== serviceId),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo eliminar el servicio.',
      );
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    ...access,
    closeEditor,
    editingService,
    error,
    isEditorOpen,
    loading,
    openCreateEditor,
    openEditEditor,
    reload: () => loadServices({ force: true }),
    removeService,
    saveService,
    saving,
    services,
    stats,
    toggleService,
  };
}