import { useQuery } from '@tanstack/react-query';
import {
  listUserActivity,
  listChatbotActivity,
  listTemplateActivity,
  listContractActivity,
  listAITokenUsage,
  type AuditQueryParams,
  type AITokenUsageQueryParams,
} from '@/api';

const AUDIT_KEY = ['audit'] as const;

export const useUserActivity = (params: AuditQueryParams = {}) =>
  useQuery({
    queryKey: [...AUDIT_KEY, 'users', params] as const,
    queryFn: () => listUserActivity(params),
  });

export const useChatbotActivity = (params: AuditQueryParams = {}) =>
  useQuery({
    queryKey: [...AUDIT_KEY, 'chatbot', params] as const,
    queryFn: () => listChatbotActivity(params),
  });

export const useTemplateActivity = (params: AuditQueryParams = {}) =>
  useQuery({
    queryKey: [...AUDIT_KEY, 'templates', params] as const,
    queryFn: () => listTemplateActivity(params),
  });

export const useContractActivity = (params: AuditQueryParams = {}) =>
  useQuery({
    queryKey: [...AUDIT_KEY, 'contracts', params] as const,
    queryFn: () => listContractActivity(params),
  });

export const useAITokenUsage = (params: AITokenUsageQueryParams = {}) =>
  useQuery({
    queryKey: [...AUDIT_KEY, 'ai-usage', params] as const,
    queryFn: () => listAITokenUsage(params),
  });
