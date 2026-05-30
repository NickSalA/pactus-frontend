'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import {
  useSendMessage,
  useUpdateConversation,
  useDeleteConversation,
} from '@/queries/hooks/chat/mutations';
import {
  useConversation,
  useConversations,
} from '@/queries/hooks/chat/queries';
import { mapConversationToMessages } from '@/features/aiAgent/lib/utils';
import type { ChatMessage } from '@/features/aiAgent/lib/utils';
import { useAuthStore } from '@/store';
import type { ApiConversationList } from '@/types/api';

export function useAIAgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<number | undefined>(undefined);
  const [showHistory, setShowHistory] = useState(true);
  const [conversationsState, setConversationsState] = useState<
    ApiConversationList[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const user = useAuthStore((state) => state.user);
  const userId = user ? parseInt(user.id, 10) : NaN;

  const {
    data: conversationsData,
    isLoading: isHistoryLoading,
    refetch: reloadConversations,
  } = useConversations(userId);
  const { data: conversationData, isLoading: isConversationLoading } =
    useConversation(threadId ?? 0);

  const conversations = conversationsData ?? [];

  useEffect(() => {
    if (conversationsData) {
      setConversationsState(conversationsData);
    }
  }, [conversationsData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    console.log('[AI Agent] Messages:', messages);
  }, [messages]);

  useEffect(() => {
    if (conversationData) {
      setMessages(mapConversationToMessages(conversationData));
    }
  }, [conversationData]);

  const loadConversation = useCallback((conversationId: number) => {
    setThreadId(conversationId);
  }, []);

  const { mutateAsync: sendMessageMutation } = useSendMessage();
  const { mutateAsync: updateConversationMutation } = useUpdateConversation();
  const { mutateAsync: deleteConversationMutation } = useDeleteConversation();

  const handleUpdateConversation = useCallback(
    async (id: number, title: string) => {
      const previousConversations = conversationsState;

      setConversationsState((current) =>
        current.map((conv) => (conv.id === id ? { ...conv, title } : conv)),
      );

      try {
        await updateConversationMutation({ id, title });
      } catch {
        setConversationsState(previousConversations);
      }
    },
    [conversationsState, updateConversationMutation],
  );

  const handleDeleteConversation = useCallback(
    async (id: number) => {
      const previousConversations = conversationsState;
      const previousThreadId = threadId;

      setConversationsState((current) =>
        current.filter((conv) => conv.id !== id),
      );

      if (threadId === id) {
        setMessages([]);
        setThreadId(undefined);
      }

      try {
        await deleteConversationMutation(id);
      } catch {
        setConversationsState(previousConversations);
        if (threadId === id) {
          setThreadId(previousThreadId);
        }
      }
    },
    [conversationsState, threadId, deleteConversationMutation],
  );

  const submitCurrentMessage = useCallback(async () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: trimmedValue,
      timestamp: new Date(),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await sendMessageMutation({
        message: userMessage.content,
        thread_id: threadId,
      });

      console.log('[AI Agent] Response:', response);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        content: response.response,
        chart: response.chart,
        timestamp: new Date(),
      };

      setMessages((currentMessages) => [...currentMessages, botMessage]);
      setThreadId(response.thread_id);
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        content:
          'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };

      setMessages((currentMessages) => [...currentMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, sendMessageMutation, threadId]);

  const startNewConversation = useCallback(() => {
    setMessages([]);
    setThreadId(undefined);
    textareaRef.current?.focus();
  }, []);

  const toggleHistory = useCallback(() => {
    setShowHistory((currentValue) => {
      const nextValue = !currentValue;

      if (nextValue) {
        void reloadConversations?.();
      }

      return nextValue;
    });
  }, [reloadConversations]);

  const handleSuggestionSelect = useCallback((text: string) => {
    setInputValue(text);
    textareaRef.current?.focus();
  }, []);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
      event.target.style.height = 'auto';
      event.target.style.height = `${Math.min(event.target.scrollHeight, 120)}px`;
    },
    [],
  );

  const handleComposerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        void submitCurrentMessage();
      }
    },
    [submitCurrentMessage],
  );

  const handleComposerSubmit = useCallback(() => {
    void submitCurrentMessage();
  }, [submitCurrentMessage]);

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void submitCurrentMessage();
    },
    [submitCurrentMessage],
  );

  return {
    conversations:
      conversationsState.length > 0 ? conversationsState : conversations,
    handleComposerKeyDown,
    handleComposerSubmit,
    handleFormSubmit,
    handleInputChange,
    handleSuggestionSelect,
    handleUpdateConversation,
    handleDeleteConversation,
    inputValue,
    isConversationLoading,
    isHistoryLoading,
    isLoading,
    loadConversation,
    messages,
    messagesEndRef,
    showHistory,
    startNewConversation,
    textareaRef,
    threadId,
    toggleHistory,
  };
}
