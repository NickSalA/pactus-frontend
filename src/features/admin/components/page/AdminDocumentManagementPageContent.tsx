'use client';

import { AdminSegmentedTabs } from '@/features/admin/components/shared/AdminSegmentedTabs';
import { LoadingState } from '@/components/LoadingState';
import { TemplateEditModal } from '@/components/modals/TemplateEditModal';
import { TemplateFormModal } from '@/components/modals/TemplateFormModal';
import { TemplateViewModal } from '@/components/modals/TemplateViewModal';
import { TemplateHeader } from '@/components/templates/TemplateHeader';
import { TemplatesFilterBar } from '@/components/templates/TemplatesFilterBar';
import { TemplatesTable } from '@/components/templates/TemplatesTable';
import { AdminFoldersSection } from '@/features/admin/components/sections/AdminFoldersSection';
import { AdminMastersSection } from '@/features/admin/components/sections/AdminMastersSection';
import { useAdminDocumentManagementPage } from '@/features/admin/hooks/useAdminDocumentManagementPage';
import { useTemplates } from '@/hooks/useTemplates';
import { useTablePagination } from '@/hooks/useTablePagination';
import type { ApiTemplateResponse } from '@/types/api';

type Template = ApiTemplateResponse;

export function AdminDocumentManagementPageContent() {
  const page = useAdminDocumentManagementPage();
  const templatesSection = useTemplates();
  const templatesPagination = useTablePagination(
    templatesSection.filteredTemplates,
  );

  if (page.shouldBlockContent) {
    return <LoadingState />;
  }

  const handleSaved = (
    template: Template,
    message: string,
    warnings?: string[],
  ) => {
    templatesSection.upsertTemplate(template);
    if (warnings) {
      templatesSection.openViewer(template, warnings);
    }
    void message;
  };

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <AdminSegmentedTabs
          activeTab={page.activeSection}
          onChange={page.setActiveSection}
          tabs={[
            { id: 'templates', label: 'Plantillas de Contratos' },
            { id: 'folders', label: 'Gestor de Carpetas' },
            { id: 'masters', label: 'Gestión de servicios' },
          ]}
        />
      </div>

      {page.activeSection === 'templates' && (
        <div className="flex-1 min-h-0">
          <div className="flex h-full flex-col gap-5">
            <TemplateHeader
              onRefresh={templatesSection.reload}
              onCreate={templatesSection.openCreateEditor}
            />

            <TemplatesFilterBar
              search={templatesSection.search}
              onSearchChange={templatesSection.setSearch}
              documentTypeFilter={templatesSection.documentTypeFilter}
              onDocumentTypeChange={templatesSection.setDocumentTypeFilter}
              formatFilter={templatesSection.formatFilter}
              onFormatChange={templatesSection.setFormatFilter}
              stateFilter={templatesSection.stateFilter}
              onStateChange={templatesSection.setStateFilter}
              supportsDocumentTypeSelection={
                templatesSection.supportsDocumentTypeSelection
              }
              allowedDocumentTypes={templatesSection.allowedDocumentTypes}
              visibleFormats={templatesSection.visibleFormats}
            />

            {templatesSection.error && (
              <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {templatesSection.error}
              </div>
            )}

            <TemplatesTable
              paginatedItems={templatesPagination.paginatedItems}
              filteredTemplates={templatesSection.filteredTemplates}
              search={templatesSection.search}
              onOpenViewer={templatesSection.openViewer}
              onOpenEditEditor={templatesSection.openEditEditor}
              onPublishOneTemplate={templatesSection.publishOneTemplate}
              onArchiveOneTemplate={templatesSection.archiveOneTemplate}
              saving={templatesSection.saving}
              currentPage={templatesPagination.currentPage}
              itemsPerPage={templatesPagination.itemsPerPage}
              startIndex={templatesPagination.startIndex}
              totalCount={templatesPagination.totalCount}
              totalPages={templatesPagination.totalPages}
              onItemsPerPageChange={templatesPagination.changeItemsPerPage}
              onPageChange={templatesPagination.changePage}
            />

            <TemplateFormModal
              allowedDocumentTypes={templatesSection.allowedDocumentTypes}
              formats={templatesSection.formats}
              open={
                templatesSection.isEditorOpen &&
                !templatesSection.editingTemplate
              }
              onClose={templatesSection.closeEditor}
              onSaved={handleSaved}
              generateTemplateDraftMutation={
                templatesSection.generateTemplateDraftMutation
              }
            />

            <TemplateEditModal
              key={templatesSection.editingTemplate?.id ?? 'edit-closed'}
              template={templatesSection.editingTemplate}
              open={
                templatesSection.isEditorOpen &&
                templatesSection.editingTemplate !== null
              }
              onClose={templatesSection.closeEditor}
              onSaved={handleSaved}
              updateTemplateMutation={templatesSection.updateTemplateMutation}
            />

            <TemplateViewModal
              key={templatesSection.viewingTemplate?.id ?? 'view-closed'}
              template={templatesSection.viewingTemplate}
              warnings={templatesSection.viewingTemplateWarnings}
              onClose={templatesSection.closeViewer}
            />
          </div>
        </div>
      )}
      {page.activeSection === 'folders' && <AdminFoldersSection />}
      {page.activeSection === 'masters' && (
        <AdminMastersSection
          activeCatalog={page.activeCatalog}
          onCatalogChange={page.setActiveCatalog}
        />
      )}
    </div>
  );
}
