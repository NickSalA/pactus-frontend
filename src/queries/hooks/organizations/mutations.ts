import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createOrganization,
  deleteOrganization,
  updateMyOrganization,
  updateOrganization,
} from '@/api';
import { organizationQueryKeys } from '@/queries/hooks/organizations/queries';
import type {
  ApiOrganizationProvisionRequest,
  ApiOrganizationResponse,
  ApiOrganizationUpdateRequest,
} from '@/types/api';

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
