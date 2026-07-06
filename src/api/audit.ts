import { apiGet } from './axiosInstance';
import { TIMEOUTS } from './constants';
import type {
  ApiAuditUserActivityListResponse,
  ApiAuditChatbotActivityListResponse,
  ApiAuditTemplateActivityListResponse,
  ApiAuditContractActivityListResponse,
  ApiAuditAITokenUsageListResponse,
  ApiAuditAITokenUsageSource,
} from '@/types/api';

export type AuditQueryParams = {
  limit?: number;
  offset?: number;
};

export type AITokenUsageQueryParams = AuditQueryParams & {
  user_id?: number;
  source?: ApiAuditAITokenUsageSource;
  start_date?: string;
  end_date?: string;
};

export async function listUserActivity(
  params: AuditQueryParams = {},
): Promise<ApiAuditUserActivityListResponse> {
  return apiGet<ApiAuditUserActivityListResponse>('/audit/users', {
    params,
    timeout: TIMEOUTS.DEFAULT,
  });
}

export async function listChatbotActivity(
  params: AuditQueryParams = {},
): Promise<ApiAuditChatbotActivityListResponse> {
  return apiGet<ApiAuditChatbotActivityListResponse>('/audit/chatbot', {
    params,
    timeout: TIMEOUTS.DEFAULT,
  });
}

export async function listTemplateActivity(
  params: AuditQueryParams = {},
): Promise<ApiAuditTemplateActivityListResponse> {
  return apiGet<ApiAuditTemplateActivityListResponse>('/audit/templates', {
    params,
    timeout: TIMEOUTS.DEFAULT,
  });
}

export async function listContractActivity(
  params: AuditQueryParams = {},
): Promise<ApiAuditContractActivityListResponse> {
  return apiGet<ApiAuditContractActivityListResponse>('/audit/contracts', {
    params,
    timeout: TIMEOUTS.DEFAULT,
  });
}

export async function listAITokenUsage(
  params: AITokenUsageQueryParams = {},
): Promise<ApiAuditAITokenUsageListResponse> {
  return apiGet<ApiAuditAITokenUsageListResponse>('/audit/ai-usage', {
    params,
    timeout: TIMEOUTS.DEFAULT,
  });
}
