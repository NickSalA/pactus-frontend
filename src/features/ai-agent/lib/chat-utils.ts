import type { ChatMessage } from '@/features/ai-agent/lib/chat.types';

import { ApiConversationList, ApiConversationRead } from '@/types/api';

export type ConversationGroup = { label: string; items: ApiConversationList[] };

export function groupConversationsByDate(
  conversations: ApiConversationList[],
): ConversationGroup[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);
  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - 7);

  const groups: ConversationGroup[] = [
    { label: 'Hoy', items: [] },
    { label: 'Ayer', items: [] },
    { label: 'Esta semana', items: [] },
    { label: 'Anteriores', items: [] },
  ];

  for (const conv of conversations) {
    const date = new Date(conv.created_at);
    if (date >= todayStart) groups[0].items.push(conv);
    else if (date >= yesterdayStart) groups[1].items.push(conv);
    else if (date >= weekStart) groups[2].items.push(conv);
    else groups[3].items.push(conv);
  }

  return groups.filter((g) => g.items.length > 0);
}

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

export const isRecentTimestamp = (timestamp: Date, now: Date): boolean => {
  return now.getTime() - timestamp.getTime() < 60_000;
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
