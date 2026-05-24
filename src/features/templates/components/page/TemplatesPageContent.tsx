'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/LoadingState';
import { TemplateEditModal } from '@/components/modals/TemplateEditModal';
import { TemplateFormModal } from '@/components/modals/TemplateFormModal';
import { TemplateViewModal } from '@/components/modals/TemplateViewModal';
import { TemplateHeader } from '@/components/templates/TemplateHeader';
import { TemplatesFilterBar } from '@/components/templates/TemplatesFilterBar';
import { TemplatesTable } from '@/components/templates/TemplatesTable';
import { canAuthorTemplates } from '@/lib/permissions';
import { useAuthStore } from '@/store';
import { useTemplates } from '@/hooks/useTemplates';
import { useTablePagination } from '@/hooks/useTablePagination';
import type { ApiTemplateResponse } from '@/types/api';
import { PageHeader } from '@/components/ui/PageHeader';
import { StateFilterChips } from '@/components/ui/StateFilterChips';
import { ChipRenderData } from '@/components/ui/ChipRenderData';
import { TEMPLATE_STATUS_COLORS } from '@/lib/templateStatusColors';
import { Select } from '@/components/ui/Select';

type Template = ApiTemplateResponse;

export function TemplatesPageContent() {
  const router = useRouter();
  const section = useTemplates();
  const pagination = useTablePagination<ApiTemplateResponse>(
    section.filteredTemplates,
  );
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const hasTemplateAuthoringAccess = canAuthorTemplates(userRole);

  const stateFilterCounts = {
    all: section.stats.totalCount,
    active: section.stats.activeCount,
    draft: section.stats.draftCount,
    published: section.stats.publishedCount,
    archived: section.stats.archivedCount,
  };

  const stateChips: ChipRenderData[] = stateFilterCounts
    ? [
        {
          value: 'ALL',
          label: 'Todas',
          count: stateFilterCounts.all,
          ...TEMPLATE_STATUS_COLORS.ALL,
        },
        {
          value: 'ACTIVE',
          label: 'Activas',
          count: stateFilterCounts.active,
          ...TEMPLATE_STATUS_COLORS.ACTIVE,
        },
        {
          value: 'DRAFT',
          label: 'Borradores',
          count: stateFilterCounts.draft,
          ...TEMPLATE_STATUS_COLORS.DRAFT,
        },
        {
          value: 'PUBLISHED',
          label: 'Publicadas',
          count: stateFilterCounts.published,
          ...TEMPLATE_STATUS_COLORS.PUBLISHED,
        },
        {
          value: 'ARCHIVED',
          label: 'Archivadas',
          count: stateFilterCounts.archived,
          ...TEMPLATE_STATUS_COLORS.ARCHIVED,
        },
      ]
    : [];

  useEffect(() => {
    if (!isHydrating && (!isAuthenticated || !hasTemplateAuthoringAccess)) {
      router.replace('/');
    }
  }, [hasTemplateAuthoringAccess, isAuthenticated, isHydrating, router]);

  if (
    section.loading ||
    isHydrating ||
    !isAuthenticated ||
    !hasTemplateAuthoringAccess
  ) {
    return <LoadingState />;
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
    <div className="flex h-full flex-col gap-4">
      <PageHeader
        title="Plantillas de Contratos"
        subtitle="Crea, edita, previsualiza y publica plantillas."
      />

      <TemplatesFilterBar
        onRefresh={section.reload}
        onCreate={section.openCreateEditor}
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

      {stateFilterCounts ? (
        <StateFilterChips
          items={stateChips}
          value={section.stateFilter}
          onChange={(v) =>
            section.setStateFilter(v as 'ACTIVE' | 'ALL' | Template['state'])
          }
        />
      ) : (
        <Select
          variant="lg"
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
      )}

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
