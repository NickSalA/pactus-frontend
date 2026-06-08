import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMember,
  deleteMember,
  updateMemberNotifications,
  updateMemberRole,
} from '@/api';
import { adminQueryKeys } from '@/queries/hooks/admin/queries';
import type {
  ApiOrganizationMemberCreateRequest,
  ApiOrganizationMemberNotificationsUpdateRequest,
  ApiUserUpdateRequest,
} from '@/types/api';
import type { OrganizationMember } from '@/types/ui.types';

export const useCreateMember = (options?: {
  onSuccess?: (data: OrganizationMember) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApiOrganizationMemberCreateRequest) =>
      createMember(payload),
    onSuccess: (data) => {
      queryClient.setQueryData<OrganizationMember[]>(
        adminQueryKeys.members,
        (old) => (old ? [...old, data] : [data]),
      );
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useUpdateMemberRole = (options?: {
  onSuccess?: (data: OrganizationMember) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      payload,
    }: {
      memberId: number;
      payload: ApiUserUpdateRequest;
    }) => updateMemberRole(memberId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData<OrganizationMember[]>(
        adminQueryKeys.members,
        (old) => old?.map((m) => (m.id === data.id ? data : m)),
      );
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useDeleteMember = (options?: {
  onSuccess?: (memberId: number) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: number) => deleteMember(memberId),
    onSuccess: (_, memberId) => {
      queryClient.setQueryData<OrganizationMember[]>(
        adminQueryKeys.members,
        (old) => old?.filter((m) => m.id !== memberId),
      );
      options?.onSuccess?.(memberId);
    },
    onError: options?.onError,
  });
};

export const useUpdateMemberNotifications = (options?: {
  onSuccess?: (data: OrganizationMember) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      payload,
    }: {
      memberId: number;
      payload: ApiOrganizationMemberNotificationsUpdateRequest;
    }) => updateMemberNotifications(memberId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData<OrganizationMember[]>(
        adminQueryKeys.members,
        (old) => old?.map((m) => (m.id === data.id ? data : m)),
      );
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};
