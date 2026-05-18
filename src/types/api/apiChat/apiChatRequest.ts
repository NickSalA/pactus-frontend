export interface ApiChatRequest {
  message: string;
  thread_id?: number | null;
}