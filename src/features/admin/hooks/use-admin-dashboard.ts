'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getDocumentFolders,
  getDocuments,
  getNotificationRules,
  getOrganizationMembers,
  getServicesAdmin,
  getTemplates,
} from '@/api';
import { useAdminGuard } from '@/features/admin/hooks/use-admin-guard';

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

type AdminSummary = {
  activeUsers: number;
  configuredAlertCount: number;
  documentCount: number;
  folderCount: number;
  activeServiceCount: number;
  serviceCount: number;
  templateCount: number;
  totalUsers: number;
};

const EMPTY_SUMMARY: AdminSummary = {
  activeUsers: 0,
  configuredAlertCount: 0,
  documentCount: 0,
  folderCount: 0,
  activeServiceCount: 0,
  serviceCount: 0,
  templateCount: 0,
  totalUsers: 0,
};

export function useAdminDashboard() {
  const access = useAdminGuard();
  const [summary, setSummary] = useState<AdminSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(
    async (options: { force?: boolean } = {}) => {
      if (!access.isAdmin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [members, rules, templates, services, documents, folders] =
          await Promise.all([
            getOrganizationMembers(),
            getNotificationRules(),
            getTemplates(),
            getServicesAdmin(true),
            getDocuments(),
            getDocumentFolders(),
          ]);

        const nextSummary = {
          activeUsers: members.filter((member) => member.is_active).length,
          configuredAlertCount: rules.length,
          documentCount: documents.length,
          folderCount: folders.length,
          activeServiceCount: services.filter((service) => service.is_active)
            .length,
          serviceCount: services.length,
          templateCount: templates.length,
          totalUsers: members.length,
        };
        setSummary(nextSummary);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar el panel de administración.',
        );
      } finally {
        setLoading(false);
      }
    },
    [access.isAdmin],
  );

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

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

  return {
    ...access,
    error,
    loading,
    metrics,
    reload: () => loadSummary({ force: true }),
  };
}