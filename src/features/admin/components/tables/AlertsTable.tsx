'use client';

import { TablePagination } from '@/components/templates/TablePagination';
import { TableBulkActionBar } from '@/components/ui/TableBulkActionBar';
import { AlertRuleRow } from '@/features/admin/components/tables/AlertRuleRow';
import type { ApiNotificationRuleResponse } from '@/types/api';
import type { DocumentFlatten } from '@/types/ui.types';

type AlertRule = ApiNotificationRuleResponse;
type Document = DocumentFlatten;

type AlertsTableProps = {
  rules: AlertRule[];
  documentById: Map<number, Document>;
  pagination: {
    paginatedItems: AlertRule[];
    currentPage: number;
    itemsPerPage: number;
    startIndex: number;
    totalCount: number;
    totalPages: number;
    changeItemsPerPage: (value: number) => void;
    changePage: (page: number) => void;
  };
  selectedRuleIds: Set<number>;
  onToggleSelect: (id: number) => void;
  onEditRule: (rule: AlertRule) => void;
  onDeleteRule: (rule: AlertRule) => void;
  isBulkDeleting: boolean;
  onBulkDelete: () => Promise<void>;
  onDeselectAll: () => void;
  selectAllRules: () => void;
  selectedCount: number;
  totalRulesCount: number;
};

export function AlertsTable({
  rules,
  documentById,
  pagination,
  selectedRuleIds,
  onToggleSelect,
  onEditRule,
  onDeleteRule,
  isBulkDeleting,
  onBulkDelete,
  onDeselectAll,
  selectAllRules,
  selectedCount,
  totalRulesCount,
}: AlertsTableProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70">
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
              onDelete={onBulkDelete}
              onDeselectAll={onDeselectAll}
              onSelectAll={selectAllRules}
              selectedCount={selectedCount}
              totalCount={totalRulesCount}
            />
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <section className="flex flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm max-h-full">
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
                    ? documentById.get(rule.document_id)
                    : null;
                  const isSelected = selectedRuleIds.has(rule.id);

                  return (
                    <AlertRuleRow
                      key={rule.id}
                      rule={rule}
                      linkedDocumentName={
                        linkedDocument ? linkedDocument.client : null
                      }
                      isSelected={isSelected}
                      onToggle={onToggleSelect}
                      onEdit={onEditRule}
                      onDelete={onDeleteRule}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {rules.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-slate-500">
          Aún no hay reglas de alerta configuradas.
        </div>
      ) : (
        <TablePagination
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
  );
}