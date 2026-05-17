import type {
  ChatRequest,
  ChatResponse,
  Conversation,
  ConversationWithContent,
} from "@/types/api.types";
import { TIMEOUTS } from "./constants";
import { apiPost, apiGet } from "./axiosInstance";

export async function sendMessage(data: ChatRequest): Promise<ChatResponse> {
  return apiPost<ChatResponse>("/chatbot/", data, { timeout: TIMEOUTS.AI });
}

export async function getConversations(userId: number): Promise<Conversation[]> {
  return apiGet<Conversation[]>(`/conversations/user/${userId}`, { timeout: TIMEOUTS.DEFAULT });
}

export async function getConversationById(id: number): Promise<ConversationWithContent> {
  return apiGet<ConversationWithContent>(`/conversations/${id}`, { timeout: TIMEOUTS.DEFAULT });
}