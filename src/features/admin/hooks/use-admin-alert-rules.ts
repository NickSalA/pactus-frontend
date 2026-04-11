"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createNotificationRule,
  deleteNotificationRule,
  getDocuments,
  getNotificationRules,
  sendEmailAlerts,
  updateNotificationRule,
} from "@/lib/api";
import { useAdminGuard } from "@/features/admin/hooks/use-admin-guard";
import type {
  Document,
  NotificationRule,
  NotificationRuleCreateRequest,
  NotificationRuleUpdateRequest,
} from "@/types/api.types";

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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null);
  const [sendingAlerts, setSendingAlerts] = useState(false);
  const [sendAlertsMessage, setSendAlertsMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!access.isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSendAlertsMessage(null);
      const [nextRules, nextDocuments] = await Promise.all([getNotificationRules(), getDocuments()]);
      setRules(nextRules);
      setDocuments(nextDocuments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las reglas de alerta.");
    } finally {
      setLoading(false);
    }
  }, [access.isAdmin]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const openCreateModal = useCallback(() => {
    setEditingRule(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((rule: NotificationRule) => {
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
      try {
        setSaving(true);
        setError(null);

        const payload = {
          document_id: draft.document_id,
          days_before_due: draft.days_before_due,
          is_active: draft.is_active,
        } satisfies NotificationRuleCreateRequest;

        if (editingRule) {
          const updatedPayload: NotificationRuleUpdateRequest = {
            days_before_due: draft.days_before_due,
            is_active: draft.is_active,
          };
          const updatedRule = await updateNotificationRule(editingRule.id, updatedPayload);
          setRules((previousRules) => previousRules.map((rule) => (rule.id === updatedRule.id ? updatedRule : rule)));
        } else {
          const createdRule = await createNotificationRule(payload);
          setRules((previousRules) => [...previousRules, createdRule]);
        }

        setIsModalOpen(false);
        setEditingRule(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "No se pudo guardar la regla.";
        setError(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [editingRule],
  );

  const triggerEmailAlerts = useCallback(async () => {
    try {
      setSendingAlerts(true);
      setError(null);
      setSendAlertsMessage(null);
      const result = await sendEmailAlerts();
      setSendAlertsMessage(
        result.emails_sent === 0
          ? "No se enviaron correos porque no hay alertas pendientes o usuarios suscritos."
          : `Se enviaron ${result.emails_sent} correo${result.emails_sent === 1 ? "" : "s"} de alerta.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron enviar las alertas por correo.");
    } finally {
      setSendingAlerts(false);
    }
  }, []);

  const removeRule = useCallback(async (ruleId: number) => {
    try {
      setSaving(true);
      setError(null);
      await deleteNotificationRule(ruleId);
      setRules((previousRules) => previousRules.filter((rule) => rule.id !== ruleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la regla.");
    } finally {
      setSaving(false);
    }
  }, []);

  const stats = useMemo(
    () => ({
      activeRules: rules.filter((rule) => rule.is_active).length,
      documentScopedRules: rules.filter((rule) => rule.document_id != null).length,
      generalRules: rules.filter((rule) => rule.document_id == null).length,
      totalRules: rules.length,
    }),
    [rules],
  );

  const documentById = useMemo(() => new Map(documents.map((document) => [document.id, document])), [documents]);

  return {
    ...access,
    closeModal,
    documentById,
    documents,
    editingRule,
    emptyDraft: EMPTY_DRAFT,
    error,
    isModalOpen,
    loading,
    openCreateModal,
    openEditModal,
    reload: loadData,
    removeRule,
    rules,
    saveRule,
    saving,
    sendAlertsMessage,
    sendingAlerts,
    stats,
    triggerEmailAlerts,
  };
}
