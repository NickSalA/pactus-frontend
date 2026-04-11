"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createServiceCatalogItem,
  deleteServiceCatalogItem,
  getServicesAdmin,
  updateServiceCatalogItem,
} from "@/lib/api";
import { ADMIN_CACHE_TTL_MS, peekAdminCache, readAdminCache, writeAdminCache } from "@/features/admin/lib/admin-cache";
import { useAdminGuard } from "@/features/admin/hooks/use-admin-guard";
import type {
  ServiceCatalogItem,
  ServiceCatalogItemCreateRequest,
  ServiceCatalogItemUpdateRequest,
} from "@/types/api.types";

export function useAdminServices() {
  const access = useAdminGuard();
  const [services, setServices] = useState<ServiceCatalogItem[]>(() => peekAdminCache<ServiceCatalogItem[]>("services") ?? []);
  const [loading, setLoading] = useState(() => peekAdminCache<ServiceCatalogItem[]>("services") === null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<ServiceCatalogItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const loadServices = useCallback(async (options: { force?: boolean } = {}) => {
    if (!access.isAdmin) {
      setLoading(false);
      return;
    }

    const cachedServices = !options.force ? readAdminCache<ServiceCatalogItem[]>("services", ADMIN_CACHE_TTL_MS) : null;
    if (cachedServices) {
      setServices(cachedServices);
      setLoading(false);
      return;
    }

    try {
      if (peekAdminCache<ServiceCatalogItem[]>("services") === null) {
        setLoading(true);
      }
      setError(null);
      const nextServices = await getServicesAdmin(true);
      setServices(nextServices);
      writeAdminCache("services", nextServices);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los servicios.");
    } finally {
      setLoading(false);
    }
  }, [access.isAdmin]);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const stats = useMemo(
    () => ({
      activeCount: services.filter((service) => service.is_active).length,
      inUseCount: services.filter((service) => service.documents_count > 0).length,
      totalCount: services.length,
    }),
    [services],
  );

  const openCreateEditor = useCallback(() => {
    setEditingService(null);
    setIsEditorOpen(true);
  }, []);

  const openEditEditor = useCallback((service: ServiceCatalogItem) => {
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
    async (payload: ServiceCatalogItemCreateRequest | ServiceCatalogItemUpdateRequest) => {
      try {
        setSaving(true);
        setError(null);

        if (editingService) {
          const updatedService = await updateServiceCatalogItem(editingService.id, payload as ServiceCatalogItemUpdateRequest);
          setServices((previousServices) => {
            const nextServices = previousServices.map((service) => (service.id === updatedService.id ? updatedService : service));
            writeAdminCache("services", nextServices);
            return nextServices;
          });
        } else {
          const createdService = await createServiceCatalogItem(payload as ServiceCatalogItemCreateRequest);
          setServices((previousServices) => {
            const nextServices = [...previousServices, createdService];
            writeAdminCache("services", nextServices);
            return nextServices;
          });
        }

        setEditingService(null);
        setIsEditorOpen(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : "No se pudo guardar el servicio.";
        setError(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [editingService],
  );

  const toggleService = useCallback(async (service: ServiceCatalogItem) => {
    try {
      setSaving(true);
      setError(null);
      const updatedService = await updateServiceCatalogItem(service.id, { is_active: !service.is_active });
      setServices((previousServices) => {
        const nextServices = previousServices.map((currentService) => (currentService.id === updatedService.id ? updatedService : currentService));
        writeAdminCache("services", nextServices);
        return nextServices;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el estado del servicio.");
    } finally {
      setSaving(false);
    }
  }, []);

  const removeService = useCallback(async (serviceId: number) => {
    try {
      setSaving(true);
      setError(null);
      await deleteServiceCatalogItem(serviceId);
      setServices((previousServices) => {
        const nextServices = previousServices.filter((service) => service.id !== serviceId);
        writeAdminCache("services", nextServices);
        return nextServices;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el servicio.");
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
