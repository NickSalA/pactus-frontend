import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "@/api";

export type SendMessageOptions = {
  message: string;
  thread_id?: number;
};

export type SendMessageResult = {
  response: string;
  thread_id: number;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: SendMessageOptions) => sendMessage(options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};