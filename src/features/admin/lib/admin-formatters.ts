import { getUserRoleLabel } from '@/lib/authUser';
import { ApiUserRole } from '@/types/api';

export const formatAdminDate = (value?: string | null): string => {
  if (!value) {
    return 'Sin fecha';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha';
  }

  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getFolderVisibilityLabel = (ownerRole: ApiUserRole): string => {
  if (ownerRole === 'HR') {
    return 'RRHH';
  }

  if (ownerRole === 'MANAGER') {
    return 'Gestores y Colaboradores';
  }

  return getUserRoleLabel(ownerRole);
};
