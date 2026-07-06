'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';
import { useUserActivity, useChatbotActivity, useTemplateActivity, useContractActivity, useAITokenUsage } from '@/queries/hooks/audit/queries';

export type AuditTab = 'users' | 'chatbot' | 'templates' | 'contracts' | 'ai-usage';

const DEFAULT_TAB: AuditTab = 'users';
const PAGE_SIZE = 50;

export function useAdminAuditPage() {
  const access = useAdminGuard();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = useMemo<AuditTab>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'users' || tab === 'chatbot' || tab === 'templates' || tab === 'contracts' || tab === 'ai-usage') {
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

  const {
    data: templates = [],
    isLoading: templatesLoading,
    error: templatesError,
    refetch: reloadTemplates,
  } = useTemplateActivity({ limit: PAGE_SIZE });

  const {
    data: contracts = [],
    isLoading: contractsLoading,
    error: contractsError,
    refetch: reloadContracts,
  } = useContractActivity({ limit: PAGE_SIZE });

  const {
    data: aiUsage = [],
    isLoading: aiUsageLoading,
    error: aiUsageError,
    refetch: reloadAiUsage,
  } = useAITokenUsage({ limit: PAGE_SIZE });

  const loading = usersLoading || chatbotLoading || templatesLoading || contractsLoading || aiUsageLoading;

  const error = useMemo(() => {
    const first = usersError ?? chatbotError ?? templatesError ?? contractsError ?? aiUsageError;
    if (!first) return null;
    return first instanceof Error ? first.message : String(first);
  }, [usersError, chatbotError, templatesError, contractsError, aiUsageError]);

  const reload = useCallback(() => {
    reloadUsers();
    reloadChatbot();
    reloadTemplates();
    reloadContracts();
    reloadAiUsage();
  }, [reloadUsers, reloadChatbot, reloadTemplates, reloadContracts, reloadAiUsage]);

  return {
    ...access,
    activeTab,
    setActiveTab,
    users,
    chatbot,
    templates,
    contracts,
    aiUsage,
    loading,
    error,
    reload,
  };
}
