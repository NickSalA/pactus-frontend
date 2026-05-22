'use client';

import { FolderKanban } from 'lucide-react';
import { AdminFolderModal } from '@/features/admin/components/modals/AdminFolderModal';
import { LoadingState } from '@/components/LoadingState';
import { AdminStatCard } from '@/features/admin/components/cards/AdminStatCard';
import { ErrorBanner } from '@/features/admin/components/shared/ErrorBanner';
import { FoldersTable } from '@/features/admin/components/tables/FoldersTable';
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
      <section className="rounded-[32px] border border-slate-200/70 bg-white px-8 py-7 shadow-sm shadow-slate-200/70">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FolderKanban className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                Gestor de Carpetas
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Vista administrativa de carpetas creadas por RRHH y Gestor de
                Contratos dentro de la organización.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <AdminStatCard
          label="Carpetas totales"
          value={section.stats.totalFolders}
        />
        <AdminStatCard
          label="Documentos organizados"
          value={section.stats.totalDocuments}
        />
        <AdminStatCard
          label="Carpetas RRHH"
          value={section.stats.hrCount}
        />
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