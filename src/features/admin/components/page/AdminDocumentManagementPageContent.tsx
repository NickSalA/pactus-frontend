'use client';

import { AdminSegmentedTabs } from '@/features/admin/components/shared/AdminSegmentedTabs';
import { AdminLoadingState } from '@/features/admin/components/shared/AdminLoadingState';
import { AdminFoldersSection } from '@/features/admin/components/sections/AdminFoldersSection';
import { AdminMastersSection } from '@/features/admin/components/sections/AdminMastersSection';
import { TemplatesSection } from '@/components/sections/TemplatesSection';
import { useAdminDocumentManagementPage } from '@/features/admin/hooks/use-admin-document-management-page';
import { useTemplates } from '@/hooks/useTemplates';
import { useTablePagination } from '@/hooks/useTablePagination';

export function AdminDocumentManagementPageContent() {
  const page = useAdminDocumentManagementPage();

  if (page.shouldBlockContent) {
    return <AdminLoadingState />;
  }

  const templatesSection = useTemplates();
  const templatesPagination = useTablePagination(
    templatesSection.filteredTemplates,
  );

  return (
    <div className="space-y-6">
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
        <TemplatesSection
          section={templatesSection}
          pagination={templatesPagination}
        />
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