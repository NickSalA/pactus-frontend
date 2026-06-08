import { useQuery } from '@tanstack/react-query';
import { getMembers } from '@/api';

export const adminQueryKeys = {
  members: ['admin', 'members'] as const,
};

export const useMembers = () =>
  useQuery({
    queryKey: adminQueryKeys.members,
    queryFn: () => getMembers(),
  });
