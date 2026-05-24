'use client';

import { Archive, Eye, Pencil, Send } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { DocumentTypeBadge } from '@/components/ui/DocumentTypeBadge';
import { getTemplateFieldCount } from '@/lib/templateFields';
import type { ApiTemplateResponse } from '@/types/api';

type Template = ApiTemplateResponse;

type TemplateRowProps = {
  template: Template;
  onView: (template: Template) => void;
  onEdit: (template: Template) => void;
  onPublish: (template: Template) => void;
  onArchive: (template: Template) => void;
  saving: boolean;
};

const getTemplateStateClasses = (state: string): string => {
  if (state === 'PUBLISHED') return 'bg-emerald-50 text-emerald-700';
  if (state === 'ARCHIVED') return 'bg-slate-100 text-slate-600';
  return 'bg-amber-50 text-amber-700';
};

const STATE_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicada',
  ARCHIVED: 'Archivada',
};

export function TemplateRow({
  template,
  onView,
  onEdit,
  onPublish,
  onArchive,
  saving,
}: TemplateRowProps) {
  return (
    <tr>
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-slate-900">
            {template.name}
          </p>
          <p className="text-slate-500">
            {template.description ?? 'Sin descripción'}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-slate-900">
            {template.format_label ?? 'Sin formato'}
          </p>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <DocumentTypeBadge type={template.document_type} />
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getTemplateStateClasses(template.state)}`}
        >
          {STATE_LABELS[template.state] ?? template.state}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        {getTemplateFieldCount(template.content)}
      </td>
      <td className="px-6 py-4 text-center text-slate-500">
        {formatDate(template.created_at)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onView(template)}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            title="Ver detalle"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(template)}
            disabled={template.state !== 'DRAFT'}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
            title={
              template.state === 'DRAFT'
                ? 'Editar plantilla'
                : 'Solo se pueden editar borradores'
            }
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              void onPublish(template);
            }}
            disabled={
              template.state !== 'DRAFT' || saving
            }
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
            title="Publicar plantilla"
          >
            <Send className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              void onArchive(template);
            }}
            disabled={
              template.state === 'ARCHIVED' || saving
            }
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            title="Archivar plantilla"
          >
            <Archive className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}