import { useQuery } from "@tanstack/react-query";
import { getConversationById, getConversations } from "@/api";

export const useConversations = (userId: number) =>
  useQuery({
    queryKey: ["conversations", "user", userId],
    queryFn: () => getConversations(userId),
    enabled: !isNaN(userId) && userId > 0,
  });

export const useConversation = (conversationId: number) =>
  useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => getConversationById(conversationId),
    enabled: conversationId > 0,
  });