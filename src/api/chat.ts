import { ApiConversationList, ApiConversationRead } from '@/types/api';
import { ApiChatRequest, ApiChatResponse } from '@/types/api';
import { TIMEOUTS } from './constants';
import { apiPost, apiGet } from './axiosInstance';

export async function sendMessage(
  data: ApiChatRequest,
): Promise<ApiChatResponse> {
  return apiPost<ApiChatResponse>('/chatbot/', data, { timeout: TIMEOUTS.AI });
}

export async function getConversations(
  userId: number,
): Promise<ApiConversationList[]> {
  return apiGet<ApiConversationList[]>(`/conversations/user/${userId}`, {
    timeout: TIMEOUTS.DEFAULT,
  });
}

export async function getConversationById(
  id: number,
): Promise<ApiConversationRead> {
  return apiGet<ApiConversationRead>(`/conversations/${id}`, {
    timeout: TIMEOUTS.DEFAULT,
  });
}
