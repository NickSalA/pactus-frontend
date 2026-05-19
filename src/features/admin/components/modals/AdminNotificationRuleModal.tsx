'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminModalShell } from '@/features/admin/components/shared/AdminModalShell';
import { Select } from '@/components/ui/Select';
import type { DocumentFlatten, NotificationRule } from '@/types/api.types';

type RuleDraft = {
  days_before_due: number;
  document_id: number | null;
  is_active: boolean;
};

type AdminNotificationRuleModalProps = {
  documents: DocumentFlatten[];
  initialDraft: RuleDraft;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (draft: RuleDraft) => Promise<void>;
  open: boolean;
  rule: NotificationRule | null;
};

const buildDraftFromRule = (
  rule: NotificationRule | null,
  fallbackDraft: RuleDraft,
): RuleDraft => {
  if (!rule) {
    return fallbackDraft;
  }

  return {
    days_before_due: rule.days_before_due,
    document_id: rule.document_id ?? null,
    is_active: rule.is_active,
  };
};

export function AdminNotificationRuleModal({
  documents,
  initialDraft,
  isSubmitting,
  onClose,
  onSubmit,
  open,
  rule,
}: AdminNotificationRuleModalProps) {
  const [draft, setDraft] = useState<RuleDraft>(
    buildDraftFromRule(rule, initialDraft),
  );
  const [error, setError] = useState<string | null>(null);

  const sortedDocuments = useMemo(
    () =>
      [...documents].sort((left, right) =>
        (left.client ?? '').localeCompare(right.client ?? '', 'es'),
      ),
    [documents],
  );

  const handleSubmit = async () => {
    if (!Number.isFinite(draft.days_before_due) || draft.days_before_due <= 0) {
      setError('Ingresa una cantidad válida de días antes del vencimiento.');
      return;
    }

    try {
      setError(null);
      await onSubmit(draft);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo guardar la regla.',
      );
    }
  };

  return (
    <AdminModalShell
      description="Define cuándo se dispara una alerta general o vinculada a un contrato específico."
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              void handleSubmit();
            }}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Plus className="h-4 w-4" />
            {isSubmitting
              ? 'Guardando...'
              : rule
                ? 'Guardar cambios'
                : 'Crear alerta'}
          </button>
        </div>
      }
      onClose={onClose}
      open={open}
      title={rule ? 'Editar Regla de Alerta' : 'Nueva Regla de Alerta'}
    >
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Alcance de la alerta
          </label>
          <Select
            variant="lg"
            className="w-full"
            value={draft.document_id ?? ''}
            disabled={Boolean(rule)}
            onChange={(event) => {
              const value = event.target.value;
              setDraft((previous) => ({
                ...previous,
                document_id: value ? Number(value) : null,
              }));
            }}
          >
            <option value="">Toda la organización</option>
            {sortedDocuments.map((document) => (
              <option key={document.id} value={document.id}>
                {document.client}
              </option>
            ))}
          </Select>
          {rule && (
            <p className="mt-2 text-xs text-slate-500">
              El alcance solo puede definirse al crear la regla. Para cambiarlo,
              crea una nueva.
            </p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Días antes del vencimiento
            </label>
            <input
              type="number"
              min={1}
              value={draft.days_before_due}
              onChange={(event) => {
                setDraft((previous) => ({
                  ...previous,
                  days_before_due: Number(event.target.value),
                }));
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={draft.is_active}
              onChange={(event) => {
                setDraft((previous) => ({
                  ...previous,
                  is_active: event.target.checked,
                }));
              }}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Regla activa
          </label>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </AdminModalShell>
  );
}
