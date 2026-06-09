import { useQuery } from '@tanstack/react-query';
import {
  getMyOrganization,
  getOrganization,
  listOrganizations,
  type OrganizationListFilters,
} from '@/api';

export const organizationQueryKeys = {
  all: ['organizations'] as const,
  detail: (organizationId: number) =>
    ['organizations', 'detail', organizationId] as const,
  list: (filters: OrganizationListFilters = {}) =>
    ['organizations', 'list', filters] as const,
  me: ['organizations', 'me'] as const,
};

export const useOrganizations = (filters: OrganizationListFilters = {}) =>
  useQuery({
    queryKey: organizationQueryKeys.list(filters),
    queryFn: () => listOrganizations(filters),
  });

export const useOrganization = (organizationId: number | null) =>
  useQuery({
    enabled: organizationId !== null,
    queryKey: organizationId
      ? organizationQueryKeys.detail(organizationId)
      : ['organizations', 'detail', null],
    queryFn: () => getOrganization(organizationId as number),
  });

export const useMyOrganization = (options: { enabled?: boolean } = {}) =>
  useQuery({
    enabled: options.enabled ?? true,
    queryKey: organizationQueryKeys.me,
    queryFn: () => getMyOrganization(),
  });
