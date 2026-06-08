'use client';

import { useMemo } from 'react';
import { useDocumentFolders, useDocuments, useServicesAdmin } from '@/queries/hooks/contracts/queries';
import { useNotificationRules } from '@/queries/hooks/notifications/queries';
import { useMembers } from '@/queries/hooks/admin/queries';
import { useTemplates } from '@/queries/hooks/templates/queries';
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';

export type AdminMetricId =
  | 'alerts'
  | 'folders'
  | 'services'
  | 'templates'
  | 'users';
export type AdminMetricTone =
  | 'amber'
  | 'blue'
  | 'emerald'
  | 'indigo'
  | 'violet';

export type AdminMetric = {
  id: AdminMetricId;
  subtitle: string;
  title: string;
  tone: AdminMetricTone;
  value: number;
};

export function useAdminDashboard() {
  const access = useAdminGuard();

  const {
    data: members = [],
    isLoading: membersLoading,
    error: membersError,
    refetch: reloadMembers,
  } = useMembers();

  const {
    data: rules = [],
    isLoading: rulesLoading,
    error: rulesError,
    refetch: reloadRules,
  } = useNotificationRules();

  const {
    data: templates = [],
    isLoading: templatesLoading,
    error: templatesError,
    refetch: reloadTemplates,
  } = useTemplates();

  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
    refetch: reloadServices,
  } = useServicesAdmin(true);

  const {
    data: documents = [],
    isLoading: documentsLoading,
    error: documentsError,
    refetch: reloadDocuments,
  } = useDocuments();

  const {
    data: folders = [],
    isLoading: foldersLoading,
    error: foldersError,
    refetch: reloadFolders,
  } = useDocumentFolders();

  const loading =
    membersLoading ||
    rulesLoading ||
    templatesLoading ||
    servicesLoading ||
    documentsLoading ||
    foldersLoading;

  const error =
    membersError?.message ??
    rulesError?.message ??
    templatesError?.message ??
    servicesError?.message ??
    documentsError?.message ??
    foldersError?.message ??
    null;

  const services = servicesData ?? [];

  const summary = useMemo(
    () => ({
      activeUsers: members.filter((member) => member.is_active).length,
      configuredAlertCount: rules.length,
      documentCount: documents.length,
      folderCount: folders.length,
      activeServiceCount: services.filter((service) => service.is_active)
        .length,
      serviceCount: services.length,
      templateCount: templates.length,
      totalUsers: members.length,
    }),
    [members, rules, documents, folders, services, templates],
  );

  const metrics = useMemo<AdminMetric[]>(
    () => [
      {
        id: 'users',
        title: 'Usuarios Activos',
        value: summary.activeUsers,
        subtitle: `de ${summary.totalUsers} total`,
        tone: 'blue',
      },
      {
        id: 'alerts',
        title: 'Alertas Configuradas',
        value: summary.configuredAlertCount,
        subtitle: 'registros operativos',
        tone: 'amber',
      },
      {
        id: 'templates',
        title: 'Plantillas',
        value: summary.templateCount,
        subtitle: 'disponibles',
        tone: 'indigo',
      },
      {
        id: 'folders',
        title: 'Carpetas',
        value: summary.folderCount,
        subtitle: `${summary.documentCount} documento${summary.documentCount === 1 ? '' : 's'}`,
        tone: 'emerald',
      },
      {
        id: 'services',
        title: 'Servicios Activos',
        value: summary.activeServiceCount,
        subtitle: `${summary.serviceCount} maestro${summary.serviceCount === 1 ? '' : 's'} configurado${summary.serviceCount === 1 ? '' : 's'}`,
        tone: 'violet',
      },
    ],
    [summary],
  );

  const reload = () => {
    reloadMembers();
    reloadRules();
    reloadTemplates();
    reloadServices();
    reloadDocuments();
    reloadFolders();
  };

  return {
    ...access,
    error,
    loading,
    metrics,
    reload,
  };
}