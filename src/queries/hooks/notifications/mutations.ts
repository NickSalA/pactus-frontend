import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createNotificationRule,
  deleteNotificationRule,
  sendEmailAlerts,
  updateNotificationRule,
} from '@/api';
import type {
  ApiNotificationRuleCreateRequest,
  ApiNotificationRuleResponse,
  ApiNotificationRuleUpdateRequest,
} from '@/types/api';

const NOTIFICATION_RULES_KEY = ['notifications', 'rules'] as const;

export const useCreateNotificationRule = (
  options?: {
    onSuccess?: (data: ApiNotificationRuleResponse) => void;
    onError?: (error: Error) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApiNotificationRuleCreateRequest) =>
      createNotificationRule(payload),
    onSuccess: (data) => {
      queryClient.setQueryData<ApiNotificationRuleResponse[]>(
        NOTIFICATION_RULES_KEY,
        (old) => (old ? [...old, data] : [data]),
      );
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useUpdateNotificationRule = (
  options?: {
    onSuccess?: (data: ApiNotificationRuleResponse) => void;
    onError?: (error: Error) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ruleId,
      payload,
    }: {
      ruleId: number;
      payload: ApiNotificationRuleUpdateRequest;
    }) => updateNotificationRule(ruleId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData<ApiNotificationRuleResponse[]>(
        NOTIFICATION_RULES_KEY,
        (old) => old?.map((rule) => (rule.id === data.id ? data : rule)),
      );
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useDeleteNotificationRule = (
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ruleId: number) => deleteNotificationRule(ruleId),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ApiNotificationRuleResponse[]>(
        NOTIFICATION_RULES_KEY,
        (old) => old?.filter((rule) => rule.id !== deletedId),
      );
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useSendEmailAlerts = (
  options?: {
    onSuccess?: (data: { emails_sent: number }) => void;
    onError?: (error: Error) => void;
  }
) => {
  return useMutation({
    mutationFn: () => sendEmailAlerts(),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};