'use client';

import { Pencil, Trash2 } from 'lucide-react';
import type { ApiNotificationRuleResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

type AlertRule = ApiNotificationRuleResponse;

type AlertRuleRowProps = {
  rule: AlertRule;
  linkedDocumentName: string | null;
  isSelected: boolean;
  onToggle: (id: number) => void;
  onEdit: (rule: AlertRule) => void;
  onDelete: (rule: AlertRule) => void;
};

export function AlertRuleRow({
  rule,
  linkedDocumentName,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
}: AlertRuleRowProps) {
  return (
    <tr className={`group ${isSelected ? 'bg-blue-50/50' : ''}`}>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(rule.id)}
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
            {linkedDocumentName ?? 'Toda la organización'}
          </p>
          <p className="text-slate-500">
            {linkedDocumentName ? linkedDocumentName : 'Regla general'}
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
        {formatDate(rule.updated_at)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(rule)}
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
                void onDelete(rule);
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
}