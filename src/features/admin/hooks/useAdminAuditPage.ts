'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';
import { useUserActivity, useChatbotActivity, useTemplateActivity, useContractActivity } from '@/queries/hooks/audit/queries';

export type AuditTab = 'users' | 'chatbot' | 'templates' | 'contracts';

const DEFAULT_TAB: AuditTab = 'users';
const PAGE_SIZE = 50;

export function useAdminAuditPage() {
  const access = useAdminGuard();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = useMemo<AuditTab>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'users' || tab === 'chatbot' || tab === 'templates' || tab === 'contracts') {
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

  const loading = usersLoading || chatbotLoading || templatesLoading || contractsLoading;

  const error = useMemo(() => {
    const first = usersError ?? chatbotError ?? templatesError ?? contractsError;
    if (!first) return null;
    return first instanceof Error ? first.message : String(first);
  }, [usersError, chatbotError, templatesError, contractsError]);

  const reload = useCallback(() => {
    reloadUsers();
    reloadChatbot();
    reloadTemplates();
    reloadContracts();
  }, [reloadUsers, reloadChatbot, reloadTemplates, reloadContracts]);

  return {
    ...access,
    activeTab,
    setActiveTab,
    users,
    chatbot,
    templates,
    contracts,
    loading,
    error,
    reload,
  };
}
