import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/api";

export const useConversations = (userId: number) =>
  useQuery({
    queryKey: ["conversations", "user", userId],
    queryFn: () => getConversations(userId),
    enabled: !isNaN(userId) && userId > 0,
  });