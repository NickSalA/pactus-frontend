import type { ApiConversationMessage } from './apiConversationMessage';

export interface ApiConversationRead {
  id: number;
  title: string;
  organization_id: number;
  user_id: number;
  content: ApiConversationMessage[];
  created_at: string;
  updated_at: string;
}