import type { Conversation, ConversationWithContent } from '@/types/api.types';
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
): Promise<Conversation[]> {
  return apiGet<Conversation[]>(`/conversations/user/${userId}`, {
    timeout: TIMEOUTS.DEFAULT,
  });
}

export async function getConversationById(
  id: number,
): Promise<ConversationWithContent> {
  return apiGet<ConversationWithContent>(`/conversations/${id}`, {
    timeout: TIMEOUTS.DEFAULT,
  });
}
