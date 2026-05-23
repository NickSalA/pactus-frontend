import type { ApiConversationList, ApiConversationRead } from '@/types/api';

export type ChatMessage = {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
};

export const CHAT_SUGGESTIONS = [
  '¿Que puedes hacer?',
  'Analizar un contrato',
  'Explicar una clausula',
] as const;

export const formatConversationDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatMessageTime = (date: Date): string => {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const mapConversationToMessages = (
  conversation: ApiConversationRead,
): ChatMessage[] => {
  return conversation.content.map((message, index) => ({
    id: `loaded-${index}`,
    sender: message.role === 'user' ? 'user' : 'bot',
    content: message.content,
    timestamp: new Date(message.timestamp),
  }));
};
