import { getUserRoleLabel } from '@/lib/authUser';
import { ApiUserRole } from '@/types/api';

export const getFolderVisibilityLabel = (ownerRole: ApiUserRole): string => {
  if (ownerRole === 'HR') {
    return 'RRHH';
  }

  if (ownerRole === 'MANAGER') {
    return 'Gestores y Colaboradores';
  }

  return getUserRoleLabel(ownerRole);
};
