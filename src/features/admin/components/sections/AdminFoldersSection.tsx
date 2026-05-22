'use client';

import { AdminFolderModal } from '@/features/admin/components/modals/AdminFolderModal';
import { LoadingState } from '@/components/LoadingState';
import { AdminStatCard } from '@/features/admin/components/cards/AdminStatCard';
import { ErrorBanner } from '@/features/admin/components/shared/ErrorBanner';
import { FoldersTable } from '@/features/admin/components/tables/FoldersTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAdminFolders } from '@/features/admin/hooks/useAdminFolders';
import { useTablePagination } from '@/hooks/useTablePagination';

export function AdminFoldersSection() {
  const section = useAdminFolders();
  const pagination = useTablePagination(section.folders);

  if (section.loading) {
    return <LoadingState />;
  }

  return (
    <div className="flex h-full flex-col gap-5">
      <PageHeader
        title="Gestor de Carpetas"
        subtitle="Vista administrativa de carpetas creadas por RRHH y Gestor de Contratos dentro de la organización."
      />

      <section className="grid gap-4 lg:grid-cols-4">
        <AdminStatCard
          label="Carpetas totales"
          value={section.stats.totalFolders}
        />
        <AdminStatCard
          label="Documentos organizados"
          value={section.stats.totalDocuments}
        />
        <AdminStatCard label="Carpetas RRHH" value={section.stats.hrCount} />
        <AdminStatCard
          label="Carpetas Gestor Contratos"
          value={section.stats.managerCount}
        />
      </section>

      {section.error && <ErrorBanner error={section.error} />}

      <FoldersTable folders={section.folders} pagination={pagination} />

      <AdminFolderModal
        key={
          section.editingFolder
            ? `folder-${section.editingFolder.id}`
            : 'folder-edit'
        }
        folder={section.editingFolder}
        isSubmitting={section.saving}
        onClose={section.closeEditor}
        onSubmit={section.saveFolder}
        open={section.isEditorOpen}
      />
    </div>
  );
}
