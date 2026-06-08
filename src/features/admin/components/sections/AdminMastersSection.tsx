'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AdminServiceModal } from '@/features/admin/components/modals/AdminServiceModal';
import { LoadingState } from '@/components/LoadingState';
import { AdminSegmentedTabs } from '@/features/admin/components/shared/AdminSegmentedTabs';
import { TableBulkActionBar } from '@/components/ui/TableBulkActionBar';
import { AdminStatCard } from '@/features/admin/components/cards/AdminStatCard';
import { DocumentTypeCard } from '@/features/admin/components/cards/DocumentTypeCard';
import { ServiceRow } from '@/features/admin/components/cards/ServiceRow';
import { ErrorBanner } from '@/features/admin/components/shared/ErrorBanner';
import { PageHeader } from '@/components/ui/PageHeader';
import { type DocumentManagementCatalog } from '@/features/admin/hooks/useAdminDocumentManagementPage';
import { useAdminDocumentTypes } from '@/features/admin/hooks/useAdminDocumentTypes';
import { useAdminServices } from '@/features/admin/hooks/useAdminServices';
import { useTablePagination } from '@/hooks/useTablePagination';
import { TablePagination } from '@/components/templates/TablePagination';

type AdminMastersSectionProps = {
  activeCatalog: DocumentManagementCatalog;
  onCatalogChange: (catalog: DocumentManagementCatalog) => void;
};

export function AdminMastersSection({
  activeCatalog,
  onCatalogChange,
}: AdminMastersSectionProps) {
  const servicesSection = useAdminServices();
  const documentTypesSection = useAdminDocumentTypes();
  const servicesPagination = useTablePagination(servicesSection.services);
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<number>>(
    new Set(),
  );
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    setSelectedServiceIds(new Set());
  }, [servicesPagination.currentPage]);

  const toggleSelectService = useCallback((id: number) => {
    setSelectedServiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const deletableServices = servicesSection.services.filter(
    (s) => s.documents_count === 0,
  );

  const selectAllDeletableServices = useCallback(() => {
    setSelectedServiceIds(new Set(deletableServices.map((s) => s.id)));
  }, [deletableServices]);

  const handleBulkDeleteServices = useCallback(async () => {
    setIsBulkDeleting(true);
    try {
      for (const id of selectedServiceIds) {
        await servicesSection.removeService(id);
      }
      setSelectedServiceIds(new Set());
    } finally {
      setIsBulkDeleting(false);
    }
  }, [selectedServiceIds, servicesSection]);

  if (
    (activeCatalog === 'services' && servicesSection.loading) ||
    (activeCatalog === 'document-types' && documentTypesSection.loading)
  ) {
    return <LoadingState />;
  }

  return (
    <div className="flex h-full flex-col gap-5">
      <PageHeader
        title="Gestión de servicios"
        subtitle="Catálogos editables de servicios y referencia de los tipos de documento."
      />

      <AdminSegmentedTabs
        activeCatalog={activeCatalog}
        openCreaterEditor={servicesSection.openCreateEditor}
        activeTab={activeCatalog}
        onChange={onCatalogChange}
        tabs={[
          {
            id: 'services',
            label: 'Servicios',
            badge: servicesSection.stats.totalCount,
          },
          {
            id: 'document-types',
            label: 'Tipos de Documento',
            badge: documentTypesSection.items.length,
          },
        ]}
      />

      {activeCatalog === 'services' ? (
        <>
          <section className="grid gap-4 lg:grid-cols-3">
            <AdminStatCard
              label="Total"
              value={servicesSection.stats.totalCount}
            />
            <AdminStatCard
              label="Activos"
              value={servicesSection.stats.activeCount}
            />
            <AdminStatCard
              label="En uso"
              value={servicesSection.stats.inUseCount}
            />
          </section>

          {servicesSection.error && (
            <ErrorBanner error={servicesSection.error} />
          )}

          <section className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70">
            {selectedServiceIds.size > 0 && (
              <div className="border-b border-slate-200/80 px-6 py-4">
                <TableBulkActionBar
                  isDeleting={isBulkDeleting}
                  itemLabel="servicio"
                  onDelete={handleBulkDeleteServices}
                  onDeselectAll={() => setSelectedServiceIds(new Set())}
                  onSelectAll={selectAllDeletableServices}
                  selectedCount={selectedServiceIds.size}
                  totalCount={deletableServices.length}
                />
              </div>
            )}
            <div className="flex-1 min-h-0 overflow-auto">
              <table className="min-w-full divide-y divide-slate-200/80 text-left">
                <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  <tr>
                    <th className="w-10 px-6 py-4" />
                    <th className="px-6 py-4">Servicio</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Contratos</th>
                    <th className="px-6 py-4">Creado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 bg-white text-sm text-slate-700 ">
                  {servicesPagination.paginatedItems.map((service) => {
                    const canDelete = service.documents_count === 0;
                    const isSelected = selectedServiceIds.has(service.id);
                    return (
                      <ServiceRow
                        key={service.id}
                        service={service}
                        isSelected={isSelected}
                        canDelete={canDelete}
                        onToggleSelect={toggleSelectService}
                        onToggleService={servicesSection.toggleService}
                        onEditService={servicesSection.openEditEditor}
                        onDeleteService={servicesSection.removeService}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>

            {servicesSection.services.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-slate-500">
                Aún no hay servicios configurados para esta organización.
              </div>
            ) : (
              <TablePagination
                currentPage={servicesPagination.currentPage}
                itemsPerPage={servicesPagination.itemsPerPage}
                onItemsPerPageChange={servicesPagination.changeItemsPerPage}
                onPageChange={servicesPagination.changePage}
                startIndex={servicesPagination.startIndex}
                totalCount={servicesPagination.totalCount}
                totalPages={servicesPagination.totalPages}
              />
            )}
          </section>

          <AdminServiceModal
            key={
              servicesSection.editingService
                ? `service-${servicesSection.editingService.id}`
                : 'service-new'
            }
            isSubmitting={servicesSection.saving}
            onClose={servicesSection.closeEditor}
            onSubmit={servicesSection.saveService}
            open={servicesSection.isEditorOpen}
            service={servicesSection.editingService}
          />
        </>
      ) : (
        <>
          {documentTypesSection.error && (
            <ErrorBanner error={documentTypesSection.error} />
          )}
          <section className="grid gap-4 lg:grid-cols-2">
            {documentTypesSection.items.map((item) => (
              <DocumentTypeCard key={item.code} item={item} />
            ))}
          </section>
        </>
      )}
    </div>
  );
}
