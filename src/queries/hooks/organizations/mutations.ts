import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createOrganization,
  createOrganizationMember,
  deleteOrganization,
  updateMyOrganization,
  updateOrganization,
  updateOrganizationMemberNotifications,
} from '@/api';
import { organizationQueryKeys } from '@/queries/hooks/organizations/queries';
import type {
  ApiOrganizationProvisionRequest,
  ApiOrganizationResponse,
  ApiOrganizationUpdateRequest,
  ApiOrganizationMemberNotificationsUpdateRequest,
  ApiOrganizationMemberCreateRequest,
} from '@/types/api';
import type { OrganizationMember } from '@/types/ui.types';

export const useCreateOrganization = (options?: {
  onSuccess?: (data: ApiOrganizationResponse) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApiOrganizationProvisionRequest) =>
      createOrganization(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useUpdateMyOrganization = (options?: {
  onSuccess?: (data: ApiOrganizationResponse) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApiOrganizationUpdateRequest) =>
      updateMyOrganization(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(organizationQueryKeys.me, data);
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useUpdateOrganization = (options?: {
  onSuccess?: (data: ApiOrganizationResponse) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      payload,
    }: {
      organizationId: number;
      payload: ApiOrganizationUpdateRequest;
    }) => updateOrganization(organizationId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(organizationQueryKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useDeleteOrganization = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: number) => deleteOrganization(organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useCreateOrganizationMember = (
  options?: {
    onSuccess?: (data: OrganizationMember) => void;
    onError?: (error: Error) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApiOrganizationMemberCreateRequest) =>
      createOrganizationMember(payload),
    onSuccess: (data) => {
      queryClient.setQueryData<OrganizationMember[]>(
        organizationQueryKeys.members,
        (old) => {
          if (!old) return [data];
          const sorted = [...old, data].sort((a, b) =>
            a.full_name?.localeCompare(b.full_name ?? '') ?? 0,
          );
          return sorted;
        },
      );
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useUpdateOrganizationMemberNotifications = (
  options?: {
    onSuccess?: (data: OrganizationMember) => void;
    onError?: (error: Error) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      payload,
    }: {
      memberId: number;
      payload: ApiOrganizationMemberNotificationsUpdateRequest;
    }) => updateOrganizationMemberNotifications(memberId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData<OrganizationMember[]>(
        organizationQueryKeys.members,
        (old) => old?.map((member) => (member.id === data.id ? data : member)),
      );
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};
