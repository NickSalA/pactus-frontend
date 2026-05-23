export interface ApiConversationMessage {
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}
