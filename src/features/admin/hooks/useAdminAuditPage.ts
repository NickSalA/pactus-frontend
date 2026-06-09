'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';
import { useUserActivity, useChatbotActivity } from '@/queries/hooks/audit/queries';

export type AuditTab = 'users' | 'chatbot';

const DEFAULT_TAB: AuditTab = 'users';
const PAGE_SIZE = 50;

export function useAdminAuditPage() {
  const access = useAdminGuard();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = useMemo<AuditTab>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'users' || tab === 'chatbot') {
      return tab;
    }
    return DEFAULT_TAB;
  }, [searchParams]);

  const setActiveTab = useCallback(
    (nextTab: AuditTab) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set('tab', nextTab);
      router.replace(`${pathname}?${nextParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
    refetch: reloadUsers,
  } = useUserActivity({ limit: PAGE_SIZE });

  const {
    data: chatbot = [],
    isLoading: chatbotLoading,
    error: chatbotError,
    refetch: reloadChatbot,
  } = useChatbotActivity({ limit: PAGE_SIZE });

  const loading = usersLoading || chatbotLoading;

  const error = useMemo(() => {
    if (usersError) {
      return usersError instanceof Error ? usersError.message : String(usersError);
    }
    if (chatbotError) {
      return chatbotError instanceof Error ? chatbotError.message : String(chatbotError);
    }
    return null;
  }, [usersError, chatbotError]);

  const reload = useCallback(() => {
    reloadUsers();
    reloadChatbot();
  }, [reloadUsers, reloadChatbot]);

  return {
    ...access,
    activeTab,
    setActiveTab,
    users,
    chatbot,
    loading,
    error,
    reload,
  };
}
