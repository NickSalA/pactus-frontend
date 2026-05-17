"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { getConversationById, sendMessage } from "@/api";
import { useConversations } from "@/queries/hooks/chat";
import { useLiveNow } from "@/features/ai-agent/hooks/use-live-now";
import { mapConversationToMessages } from "@/features/ai-agent/lib/chat-utils";
import type { ChatMessage } from "@/features/ai-agent/lib/chat.types";
import type { ConversationWithContent } from "@/types/api.types";
import { useAuthStore } from "@/store";

export function useAIAgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<number | undefined>(undefined);
  const [showHistory, setShowHistory] = useState(true);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const conversationCache = useRef<Map<number, ConversationWithContent>>(new Map());
  const now = useLiveNow();

  const user = useAuthStore((state) => state.user);
  const userId = user ? parseInt(user.id, 10) : NaN;

  const { data: conversationsData, isLoading: isHistoryLoading, refetch: reloadConversations } = useConversations(userId);
  const conversations = conversationsData ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = useCallback(async (conversationId: number) => {
    setThreadId(conversationId);

    const cached = conversationCache.current.get(conversationId);
    if (cached) {
      setMessages(mapConversationToMessages(cached));
      return;
    }

    setMessages([]);
    setIsConversationLoading(true);
    try {
      const conversation = await getConversationById(conversationId);
      conversationCache.current.set(conversationId, conversation);
      setMessages(mapConversationToMessages(conversation));
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setIsConversationLoading(false);
    }
  }, []);

  const submitCurrentMessage = useCallback(async () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: trimmedValue,
      timestamp: new Date(),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await sendMessage({
        message: userMessage.content,
        thread_id: threadId,
      });

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((currentMessages) => [...currentMessages, botMessage]);
      setThreadId(response.thread_id);
      conversationCache.current.delete(response.thread_id);
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: "bot",
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
        timestamp: new Date(),
      };

      setMessages((currentMessages) => [...currentMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, threadId]);

  const startNewConversation = useCallback(() => {
    setMessages([]);
    setThreadId(undefined);
    setShowHistory(false);
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

  const handleInputChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 120)}px`;
  }, []);

  const handleComposerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
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
    conversations,
    handleComposerKeyDown,
    handleComposerSubmit,
    handleFormSubmit,
    handleInputChange,
    handleSuggestionSelect,
    inputValue,
    isConversationLoading,
    isHistoryLoading,
    isLoading,
    loadConversation,
    messages,
    messagesEndRef,
    now,
    showHistory,
    startNewConversation,
    textareaRef,
    threadId,
    toggleHistory,
  };
}