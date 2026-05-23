import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createOrganizationMember,
  updateOrganizationMemberNotifications,
} from '@/api';
import type {
  ApiOrganizationMemberNotificationsUpdateRequest,
  ApiOrganizationMemberCreateRequest,
} from '@/types/api';
import type { OrganizationMember } from '@/types/ui.types';

const ORGANIZATION_MEMBERS_KEY = ['organizations', 'members'] as const;

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
        ORGANIZATION_MEMBERS_KEY,
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
        ORGANIZATION_MEMBERS_KEY,
        (old) => old?.map((member) => (member.id === data.id ? data : member)),
      );
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};