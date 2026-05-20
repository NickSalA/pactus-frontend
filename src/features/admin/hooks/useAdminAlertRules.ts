'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ApiNotificationRuleCreateRequest,
  ApiNotificationRuleUpdateRequest,
} from '@/types/api';
import { useDocuments } from '@/queries/hooks/contracts/queries';
import { useNotificationRules } from '@/queries/hooks/notifications/queries';
import {
  useCreateNotificationRule,
  useDeleteNotificationRule,
  useSendEmailAlerts,
  useUpdateNotificationRule,
} from '@/queries/hooks/notifications/mutations';
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';
import type { DocumentFlatten } from '@/types/ui.types';
import { ApiNotificationRuleResponse } from '@/types/api';

type RuleDraft = {
  days_before_due: number;
  document_id: number | null;
  is_active: boolean;
};

const EMPTY_DRAFT: RuleDraft = {
  days_before_due: 7,
  document_id: null,
  is_active: true,
};

export function useAdminAlertRules() {
  const access = useAdminGuard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] =
    useState<ApiNotificationRuleResponse | null>(null);
  const [sendAlertsMessage, setSendAlertsMessage] = useState<string | null>(
    null,
  );

  const {
    data: rules = [],
    isLoading: loading,
    error,
    refetch: reload,
  } = useNotificationRules();

  const { data: documents = [] } = useDocuments();

  const createRuleMutation = useCreateNotificationRule({
    onError: (err) => {
      console.error('Error creating rule:', err);
    },
  });

  const updateRuleMutation = useUpdateNotificationRule({
    onError: (err) => {
      console.error('Error updating rule:', err);
    },
  });

  const deleteRuleMutation = useDeleteNotificationRule({
    onError: (err) => {
      console.error('Error deleting rule:', err);
    },
  });

  const sendAlertsMutation = useSendEmailAlerts({
    onSuccess: (data) => {
      setSendAlertsMessage(
        data.emails_sent === 0
          ? 'No se enviaron correos porque no hay alertas pendientes o usuarios suscritos.'
          : `Se enviaron ${data.emails_sent} correo${data.emails_sent === 1 ? '' : 's'} de alerta.`,
      );
    },
    onError: (err) => {
      console.error('Error sending alerts:', err);
    },
  });

  const saving =
    createRuleMutation.isPending ||
    updateRuleMutation.isPending ||
    deleteRuleMutation.isPending;

  const openCreateModal = useCallback(() => {
    setEditingRule(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((rule: ApiNotificationRuleResponse) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (saving) {
      return;
    }

    setEditingRule(null);
    setIsModalOpen(false);
  }, [saving]);

  const saveRule = useCallback(
    async (draft: RuleDraft) => {
      const payload = {
        document_id: draft.document_id,
        days_before_due: draft.days_before_due,
        is_active: draft.is_active,
      } satisfies ApiNotificationRuleCreateRequest;

      if (editingRule) {
        const updatedPayload: ApiNotificationRuleUpdateRequest = {
          days_before_due: draft.days_before_due,
          is_active: draft.is_active,
        };
        await updateRuleMutation.mutateAsync({
          ruleId: editingRule.id,
          payload: updatedPayload,
        });
      } else {
        await createRuleMutation.mutateAsync(payload);
      }

      setIsModalOpen(false);
      setEditingRule(null);
    },
    [editingRule, createRuleMutation, updateRuleMutation],
  );

  const triggerEmailAlerts = useCallback(async () => {
    setSendAlertsMessage(null);
    await sendAlertsMutation.mutateAsync();
  }, [sendAlertsMutation]);

  const removeRule = useCallback(
    async (ruleId: number) => {
      await deleteRuleMutation.mutateAsync(ruleId);
    },
    [deleteRuleMutation],
  );

  const stats = useMemo(
    () => ({
      activeRules: rules.filter((rule) => rule.is_active).length,
      documentScopedRules: rules.filter((rule) => rule.document_id != null)
        .length,
      generalRules: rules.filter((rule) => rule.document_id == null).length,
      totalRules: rules.length,
    }),
    [rules],
  );

  const documentById = useMemo(
    () => new Map<number, DocumentFlatten>(documents.map((d) => [d.id, d])),
    [documents],
  );

  return {
    ...access,
    closeModal,
    documentById,
    documents,
    editingRule,
    emptyDraft: EMPTY_DRAFT,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    isModalOpen,
    loading,
    openCreateModal,
    openEditModal,
    reload,
    removeRule,
    rules,
    saveRule,
    saving,
    sendAlertsMessage,
    sendingAlerts: sendAlertsMutation.isPending,
    stats,
    triggerEmailAlerts,
  };
}