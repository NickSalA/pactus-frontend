import type { ApiUserRole } from '@/types/api';

type RoleValue = ApiUserRole | string | null | undefined;

export function getDefaultRouteForRole(role: RoleValue): string {
  if (role === 'SUPERADMIN') {
    return '/super-admin';
  }

  if (role === 'ADMIN' || role === 'Administrador') {
    return '/admin/dashboard';
  }

  if (role === 'MANAGER') {
    return '/manager/dashboard';
  }

  if (role === 'HR') {
    return '/hr/dashboard';
  }

  if (role === 'WORKER') {
    return '/worker/dashboard';
  }

  return '/hr/dashboard';
}

export function getDefaultRouteLabelForRole(role: RoleValue): string {
  if (role === 'SUPERADMIN') {
    return 'panel de super administrador';
  }

  if (role === 'ADMIN' || role === 'Administrador') {
    return 'panel de administrador';
  }

  if (role === 'MANAGER') {
    return 'dashboard de manager';
  }

  if (role === 'WORKER') {
    return 'dashboard de colaborador';
  }

  return 'dashboard de RRHH';
}
