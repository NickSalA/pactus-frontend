'use client';

import { TemplateEditModal } from '@/components/modals/TemplateEditModal';
import { TemplateFormModal } from '@/components/modals/TemplateFormModal';
import { TemplateViewModal } from '@/components/modals/TemplateViewModal';
import { TemplateHeader } from '@/components/sections/TemplateHeader';
import { TemplatesFilterBar } from '@/components/sections/TemplatesFilterBar';
import { TemplatesTable } from '@/components/sections/TemplatesTable';
import type { ApiTemplateResponse } from '@/types/api';
import type { useTemplates } from '@/hooks/useTemplates';
import type { useTablePagination } from '@/hooks/useTablePagination';

type TemplatesSectionProps = {
  section: ReturnType<typeof useTemplates>;
  pagination: ReturnType<typeof useTablePagination<ApiTemplateResponse>>;
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
    <div className="flex h-full flex-col gap-5">
      <TemplateHeader
        onRefresh={section.reload}
        onCreate={section.openCreateEditor}
      />

      <TemplatesFilterBar
        search={section.search}
        onSearchChange={section.setSearch}
        documentTypeFilter={section.documentTypeFilter}
        onDocumentTypeChange={section.setDocumentTypeFilter}
        formatFilter={section.formatFilter}
        onFormatChange={section.setFormatFilter}
        stateFilter={section.stateFilter}
        onStateChange={section.setStateFilter}
        supportsDocumentTypeSelection={section.supportsDocumentTypeSelection}
        allowedDocumentTypes={section.allowedDocumentTypes}
        visibleFormats={section.visibleFormats}
      />

      {section.error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {section.error}
        </div>
      )}

      <TemplatesTable
        paginatedItems={pagination.paginatedItems}
        filteredTemplates={section.filteredTemplates}
        search={section.search}
        onOpenViewer={section.openViewer}
        onOpenEditEditor={section.openEditEditor}
        onPublishOneTemplate={section.publishOneTemplate}
        onArchiveOneTemplate={section.archiveOneTemplate}
        saving={section.saving}
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.itemsPerPage}
        startIndex={pagination.startIndex}
        totalCount={pagination.totalCount}
        totalPages={pagination.totalPages}
        onItemsPerPageChange={pagination.changeItemsPerPage}
        onPageChange={pagination.changePage}
      />

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