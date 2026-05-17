'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bell, CalendarClock, Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminNotificationRuleModal } from '@/features/admin/components/modals/AdminNotificationRuleModal';
import { AdminSummaryCard } from '@/features/admin/components/cards/AdminSummaryCard';
import { AdminErrorState } from '@/features/admin/components/shared/AdminErrorState';
import { AdminLoadingState } from '@/features/admin/components/shared/AdminLoadingState';
import { AdminTablePagination } from '@/features/admin/components/shared/AdminTablePagination';
import { TableBulkActionBar } from '@/components/ui/TableBulkActionBar';
import { formatAdminDate } from '@/features/admin/lib/admin-formatters';
import { useAdminAlertRules } from '@/features/admin/hooks/use-admin-alert-rules';
import { useAdminTablePagination } from '@/features/admin/hooks/use-admin-table-pagination';

export function AdminAlertsPageContent() {
  const page = useAdminAlertRules();
  const pagination = useAdminTablePagination(page.rules);
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
    return <AdminLoadingState />;
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
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/70 bg-white px-8 py-7 shadow-sm shadow-slate-200/70">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Configuración de Alertas
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Configuración de Alertas
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Define cuándo se disparan alertas generales o específicas por
                contrato.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto lg:min-w-[230px] lg:items-stretch">
            <button
              type="button"
              onClick={page.openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <Plus className="h-4 w-4" />
              Nueva alerta
            </button>
            <button
              type="button"
              onClick={() => {
                void page.triggerEmailAlerts();
              }}
              disabled={page.sendingAlerts}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Bell className="h-4 w-4" />
              {page.sendingAlerts
                ? 'Enviando alertas...'
                : 'Enviar alertas ahora'}
            </button>
          </div>
        </div>
      </section>

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

      {page.error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {page.error}
        </div>
      )}

      {page.sendAlertsMessage && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          {page.sendAlertsMessage}
        </div>
      )}

      <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70">
        <div className="border-b border-slate-200/80 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Listado de Alertas
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Reglas de Notificación
          </h2>
          {selectedRuleIds.size > 0 && (
            <div className="mt-4">
              <TableBulkActionBar
                isDeleting={isBulkDeleting}
                itemLabel="regla"
                onDelete={handleBulkDeleteRules}
                onDeselectAll={() => setSelectedRuleIds(new Set())}
                onSelectAll={selectAllRules}
                selectedCount={selectedRuleIds.size}
                totalCount={page.rules.length}
              />
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/80 text-left">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th className="w-10 px-6 py-4" />
                <th className="px-6 py-4">Alcance</th>
                <th className="px-6 py-4 text-center">Anticipación</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">Actualizada</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 bg-white text-sm text-slate-700">
              {pagination.paginatedItems.map((rule) => {
                const linkedDocument = rule.document_id
                  ? page.documentById.get(rule.document_id)
                  : null;
                const isSelected = selectedRuleIds.has(rule.id);

                return (
                  <tr
                    key={rule.id}
                    className={`group ${isSelected ? 'bg-blue-50/50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRule(rule.id)}
                        className={`h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600 transition-opacity duration-150 ${
                          isSelected
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                        aria-label="Seleccionar regla"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {linkedDocument
                            ? linkedDocument.client
                            : 'Toda la organización'}
                        </p>
                        <p className="text-slate-500">
                          {linkedDocument
                            ? linkedDocument.client
                            : 'Regla general'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {rule.days_before_due} día
                      {rule.days_before_due === 1 ? '' : 's'} antes
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${rule.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
                      >
                        {rule.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500">
                      {formatAdminDate(rule.updated_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => page.openEditModal(rule)}
                          className="rounded-xl p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                          title="Editar regla"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                '¿Eliminar esta regla de notificación?',
                              )
                            ) {
                              void page.removeRule(rule.id);
                            }
                          }}
                          className="rounded-xl p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                          title="Eliminar regla"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {page.rules.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-slate-500">
            Aún no hay reglas de alerta configuradas.
          </div>
        ) : (
          <AdminTablePagination
            currentPage={pagination.currentPage}
            itemsPerPage={pagination.itemsPerPage}
            onItemsPerPageChange={pagination.changeItemsPerPage}
            onPageChange={pagination.changePage}
            startIndex={pagination.startIndex}
            totalCount={pagination.totalCount}
            totalPages={pagination.totalPages}
          />
        )}
      </section>

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
