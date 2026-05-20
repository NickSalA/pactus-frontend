import { useQuery } from '@tanstack/react-query';
import { getOrganizationMembers } from '@/api';

export const useOrganizationMembers = () =>
  useQuery({
    queryKey: ['organizations', 'members'] as const,
    queryFn: () => getOrganizationMembers(),
  });