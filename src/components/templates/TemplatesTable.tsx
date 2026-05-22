'use client';

import { TemplateRow } from './TemplateRow';
import { TablePagination } from '@/components/templates/TablePagination';
import type { ApiTemplateResponse } from '@/types/api';

type Template = ApiTemplateResponse;

type TemplatesTableProps = {
  paginatedItems: Template[];
  filteredTemplates: Template[];
  search: string;
  onOpenViewer: (template: Template) => void;
  onOpenEditEditor: (template: Template) => void;
  onPublishOneTemplate: (template: Template) => void;
  onArchiveOneTemplate: (template: Template) => void;
  saving: boolean;
  currentPage: number;
  itemsPerPage: number;
  startIndex: number;
  totalCount: number;
  totalPages: number;
  onItemsPerPageChange: (value: number) => void;
  onPageChange: (page: number) => void;
};

export function TemplatesTable({
  paginatedItems,
  filteredTemplates,
  search,
  onOpenViewer,
  onOpenEditEditor,
  onPublishOneTemplate,
  onArchiveOneTemplate,
  saving,
  currentPage,
  itemsPerPage,
  startIndex,
  totalCount,
  totalPages,
  onItemsPerPageChange,
  onPageChange,
}: TemplatesTableProps) {
  return (
    <div className="flex-1 min-h-0">
      <section className="flex flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm max-h-full">
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
              {paginatedItems.map((template) => (
                <TemplateRow
                  key={template.id}
                  template={template}
                  onView={onOpenViewer}
                  onEdit={onOpenEditEditor}
                  onPublish={onPublishOneTemplate}
                  onArchive={onArchiveOneTemplate}
                  saving={saving}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-slate-500">
            {search
              ? 'No hay plantillas que coincidan con los filtros actuales.'
              : "Todavía no hay plantillas. Crea la primera con '+ Nueva plantilla'."}
          </div>
        ) : (
          <TablePagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            onPageChange={onPageChange}
            startIndex={startIndex}
            totalCount={totalCount}
            totalPages={totalPages}
          />
        )}
      </section>
    </div>
  );
}