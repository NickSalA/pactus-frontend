'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bell, CalendarClock, Pencil, Plus } from 'lucide-react';
import { AdminNotificationRuleModal } from '@/features/admin/components/modals/AdminNotificationRuleModal';
import { AdminSummaryCard } from '@/features/admin/components/cards/AdminSummaryCard';
import { AdminErrorState } from '@/features/admin/components/shared/AdminErrorState';
import { ErrorBanner } from '@/features/admin/components/shared/ErrorBanner';
import { AlertsTable } from '@/features/admin/components/tables/AlertsTable';
import { LoadingState } from '@/components/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAdminAlertRules } from '@/features/admin/hooks/useAdminAlertRules';
import { useTablePagination } from '@/hooks/useTablePagination';

export function AdminAlertsPageContent() {
  const page = useAdminAlertRules();
  const pagination = useTablePagination(page.rules);
  const [selectedRuleIds, setSelectedRuleIds] = useState<Set<number>>(
    new Set(),
  );
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    setSelectedRuleIds(new Set());
  }, [pagination.currentPage]);

  const toggleSelectRule = useCallback((id: number) => {
    setSelectedRuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAllRules = useCallback(() => {
    setSelectedRuleIds(new Set(page.rules.map((r) => r.id)));
  }, [page.rules]);

  const handleBulkDeleteRules = useCallback(async () => {
    setIsBulkDeleting(true);
    try {
      for (const id of selectedRuleIds) {
        await page.removeRule(id);
      }
      setSelectedRuleIds(new Set());
    } finally {
      setIsBulkDeleting(false);
    }
  }, [page, selectedRuleIds]);

  if (page.shouldBlockContent || page.loading) {
    return <LoadingState />;
  }

  if (page.error && page.rules.length === 0) {
    return (
      <AdminErrorState
        message={page.error}
        onRetry={() => void page.reload()}
      />
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader
        title="Configuración de Alertas"
        subtitle="Define cuándo se disparan alertas generales o específicas por contrato."
      />

      <div className="flex w-full justify-end gap-3 sm:w-auto lg:min-w-57-5 lg:items-stretch">
        <button
          type="button"
          onClick={() => {
            void page.triggerEmailAlerts();
          }}
          disabled={page.sendingAlerts}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Bell className="h-4 w-4" />
          {page.sendingAlerts ? 'Enviando alertas...' : 'Enviar alertas ahora'}
        </button>
        <button
          type="button"
          onClick={page.openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
        >
          <Plus className="h-4 w-4" />
          Nueva alerta
        </button>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <AdminSummaryCard
          icon={<Bell className="h-5 w-5" />}
          subtitle="reglas registradas"
          title="Alertas Totales"
          tone="amber"
          value={page.stats.totalRules}
        />
        <AdminSummaryCard
          icon={<CalendarClock className="h-5 w-5" />}
          subtitle="reglas actualmente activas"
          title="Alertas Activas"
          tone="blue"
          value={page.stats.activeRules}
        />
        <AdminSummaryCard
          icon={<Pencil className="h-5 w-5" />}
          subtitle={`${page.stats.generalRules} generales`}
          title="Alertas por Contrato"
          tone="indigo"
          value={page.stats.documentScopedRules}
        />
      </section>

      {page.error && <ErrorBanner error={page.error} />}

      {page.sendAlertsMessage && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          {page.sendAlertsMessage}
        </div>
      )}

      <AlertsTable
        rules={page.rules}
        documentById={page.documentById}
        pagination={pagination}
        selectedRuleIds={selectedRuleIds}
        onToggleSelect={toggleSelectRule}
        onEditRule={page.openEditModal}
        onDeleteRule={(rule) => {
          void page.removeRule(rule.id);
        }}
        isBulkDeleting={isBulkDeleting}
        onBulkDelete={handleBulkDeleteRules}
        onDeselectAll={() => setSelectedRuleIds(new Set())}
        selectAllRules={selectAllRules}
        selectedCount={selectedRuleIds.size}
        totalRulesCount={page.rules.length}
      />

      <AdminNotificationRuleModal
        key={page.editingRule ? `rule-${page.editingRule.id}` : 'rule-new'}
        documents={page.documents}
        initialDraft={page.emptyDraft}
        isSubmitting={page.saving}
        onClose={page.closeModal}
        onSubmit={page.saveRule}
        open={page.isModalOpen}
        rule={page.editingRule}
      />
    </div>
  );
}
