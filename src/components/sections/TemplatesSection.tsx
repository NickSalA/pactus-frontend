'use client';

import {
  Archive,
  Eye,
  FileStack,
  Pencil,
  Plus,
  RefreshCw,
  Send,
} from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { AdminTablePagination } from '@/features/admin/components/shared/AdminTablePagination';
import { TemplateEditModal } from '@/components/modals/TemplateEditModal';
import { TemplateFormModal } from '@/components/modals/TemplateFormModal';
import { TemplateViewModal } from '@/components/modals/TemplateViewModal';
import { formatAdminDate } from '@/features/admin/lib/admin-formatters';
import { getDocumentTypeLabel } from '@/lib/document.utils';
import { getTemplateFieldCount } from '@/lib/templateFields';
import type { ApiTemplateResponse } from '@/types/api';
import type { useAdminTemplates } from '@/features/admin/hooks/use-admin-templates';
import type { useAdminTablePagination } from '@/features/admin/hooks/use-admin-table-pagination';

type TemplatesSectionProps = {
  section: ReturnType<typeof useAdminTemplates>;
  pagination: ReturnType<typeof useAdminTablePagination<ApiTemplateResponse>>;
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

type Template = ApiTemplateResponse;

export function TemplatesSection({
  section,
  pagination,
}: TemplatesSectionProps) {
  if (!section.canManageTemplates) {
    return (
      <div className="rounded-[28px] border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-800">
        No tienes permisos para gestionar plantillas.
      </div>
    );
  }

  const handleSaved = (
    template: Template,
    message: string,
    warnings?: string[],
  ) => {
    section.upsertTemplate(template);
    if (warnings) {
      section.openViewer(template, warnings);
    }
    void message;
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200/70 bg-white px-8 py-7 shadow-sm shadow-slate-200/70">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <FileStack className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                Plantillas de contratos
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Crea, edita, previsualiza y publica plantillas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                void section.reload();
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </button>
            <button
              type="button"
              onClick={section.openCreateEditor}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <Plus className="h-4 w-4" />
              Nueva plantilla
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_180px_220px_180px]">
          <input
            type="search"
            value={section.search}
            onChange={(e) => section.setSearch(e.target.value)}
            placeholder="Buscar por nombre, descripción o formato..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />

          {section.supportsDocumentTypeSelection ? (
            <Select
              variant="lg"
              className="w-full"
              value={section.documentTypeFilter}
              onChange={(e) =>
                section.setDocumentTypeFilter(
                  e.target.value as 'ALL' | Template['document_type'],
                )
              }
            >
              <option value="ALL">Todos los tipos</option>
              {(section.allowedDocumentTypes ?? ['LABOR', 'COMPANY']).map(
                (documentType) => (
                  <option key={documentType} value={documentType}>
                    {getDocumentTypeLabel(documentType)}
                  </option>
                ),
              )}
            </Select>
          ) : (
            <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
              {section.allowedDocumentTypes?.[0]
                ? getDocumentTypeLabel(section.allowedDocumentTypes[0])
                : 'Sin alcance'}
            </div>
          )}

          <Select
            variant="lg"
            className="w-full"
            value={section.formatFilter}
            onChange={(e) => section.setFormatFilter(e.target.value)}
          >
            <option value="ALL">Todos los formatos</option>
            {section.visibleFormats.map((format) => (
              <option key={format.id} value={format.format_code}>
                {format.label}
              </option>
            ))}
          </Select>

          <Select
            variant="lg"
            className="w-full"
            value={section.stateFilter}
            onChange={(e) =>
              section.setStateFilter(
                e.target.value as 'ACTIVE' | 'ALL' | Template['state'],
              )
            }
          >
            <option value="ACTIVE">Activas</option>
            <option value="DRAFT">Borradores</option>
            <option value="PUBLISHED">Publicadas</option>
            <option value="ARCHIVED">Archivadas</option>
            <option value="ALL">Todas</option>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:w-auto">
          <article className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 shadow-sm shadow-slate-200/70">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Plantillas
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {section.stats.totalCount}
            </p>
          </article>
          <article className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 shadow-sm shadow-slate-200/70">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Borradores
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {section.stats.draftCount}
            </p>
          </article>
          <article className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 shadow-sm shadow-slate-200/70">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Publicadas
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {section.stats.publishedCount}
            </p>
          </article>
        </div>
      </section>

      {section.error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {section.error}
        </div>
      )}

      <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/80 text-left">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Formato</th>
                <th className="px-6 py-4 text-center">Tipo</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">Campos</th>
                <th className="px-6 py-4 text-center">Creada</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 bg-white text-sm text-slate-700">
              {pagination.paginatedItems.map((template) => (
                <tr key={template.id}>
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
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                      {getDocumentTypeLabel(template.document_type)}
                    </span>
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
                    {formatAdminDate(template.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => section.openViewer(template)}
                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => section.openEditEditor(template)}
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
                          void section.publishOneTemplate(template);
                        }}
                        disabled={template.state !== 'DRAFT' || section.saving}
                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Publicar plantilla"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void section.archiveOneTemplate(template);
                        }}
                        disabled={
                          template.state === 'ARCHIVED' || section.saving
                        }
                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Archivar plantilla"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {section.filteredTemplates.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-slate-500">
            {section.search
              ? 'No hay plantillas que coincidan con los filtros actuales.'
              : "Todavía no hay plantillas. Crea la primera con '+ Nueva plantilla'."}
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

      <TemplateFormModal
        allowedDocumentTypes={section.allowedDocumentTypes}
        formats={section.formats}
        open={section.isEditorOpen && !section.editingTemplate}
        onClose={section.closeEditor}
        onSaved={handleSaved}
        generateTemplateDraftMutation={section.generateTemplateDraftMutation}
      />

      <TemplateEditModal
        key={section.editingTemplate?.id ?? 'edit-closed'}
        template={section.editingTemplate}
        open={section.isEditorOpen && section.editingTemplate !== null}
        onClose={section.closeEditor}
        onSaved={handleSaved}
        updateTemplateMutation={section.updateTemplateMutation}
      />

      <TemplateViewModal
        key={section.viewingTemplate?.id ?? 'view-closed'}
        template={section.viewingTemplate}
        warnings={section.viewingTemplateWarnings}
        onClose={section.closeViewer}
      />
    </div>
  );
}