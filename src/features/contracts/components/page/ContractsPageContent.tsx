'use client';

import { useCallback, useEffect, useState } from 'react';
import { ContractsActionsBar } from '@/features/contracts/components/ui/ContractsActionsBar';
import { ContractsDriveSelection } from '@/features/contracts/components/ui/ContractsDriveSelection';
import { ContractsEmptyState } from '@/features/contracts/components/ui/ContractsEmptyState';
import { ContractsFolderTabs } from '@/features/contracts/components/ui/ContractsFolderTabs';
import { ContractsImportMenu } from '@/features/contracts/components/ui/ContractsImportMenu';
import { ContractsTable } from '@/features/contracts/components/ui/ContractsTable';
import { ContractDeleteModal } from '@/features/contracts/components/modals/ContractDeleteModal';
import { ContractFormModal } from '@/features/contracts/components/modals/ContractFormModal';
import { ContractPreviewModal } from '@/features/contracts/components/modals/ContractPreviewModal';
import { NewContractModal } from '@/features/contracts/components/modals/NewContractModal';
import { TableBulkActionBar } from '@/components/ui/TableBulkActionBar';
import { PageHeader } from '@/components/ui/PageHeader';
import { useContractsPage } from '@/features/contracts/hooks/useContractsPage';
import type { DocumentFlatten } from '@/types/ui.types';
import { ApiUserRole } from '@/types/api';

type ContractsPageContentProps = {
  shouldOpenCreateModal?: boolean;
};

export function ContractsPageContent({
  shouldOpenCreateModal = false,
}: ContractsPageContentProps) {
  const page = useContractsPage({ shouldOpenCreateModal });
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page.filter, page.search, page.activeFolder.id, page.dateRange]);

  const toggleSelectContract = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAllContracts = useCallback(() => {
    setSelectedIds(new Set(page.filteredContracts.map((c) => c.id)));
  }, [page.filteredContracts]);

  const handleBulkDelete = useCallback(async () => {
    setIsBulkDeleting(true);
    try {
      await page.bulkDeleteContracts([...selectedIds]);
      setSelectedIds(new Set());
    } finally {
      setIsBulkDeleting(false);
    }
  }, [page, selectedIds]);

  if (page.isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <p className="text-lg text-gray-500">Cargando contratos...</p>
      </div>
    );
  }

  if (page.error) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="mb-4 text-red-500">{page.error.message}</p>
        <button
          onClick={() => {
            void page.reloadContracts();
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Gestion de Contratos"
        subtitle={`${page.filteredContracts.length} contrato${page.filteredContracts.length !== 1 ? 's' : ''} en ${page.activeFolder.name}`}
      />

      <ContractsFolderTabs
        activeFolder={page.activeFolder}
        canManageActiveFolder={page.canManageActiveFolder}
        canCreateFolder={page.canCreateFolder}
        folders={page.folders}
        onCreateFolder={page.createFolder}
        onDeleteFolder={page.deleteFolder}
        onRenameFolder={page.renameFolder}
        onSelectFolder={page.selectFolder}
      />

      {page.canImportContract && page.drivePickerError && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {page.drivePickerError}
        </div>
      )}

      {page.canImportContract && page.driveImportError && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {page.driveImportError}
        </div>
      )}

      {page.canImportContract && page.driveImportMessage && (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {page.driveImportMessage}
        </div>
      )}

      {page.canImportContract && (
        <ContractsDriveSelection
          activeFolderName={page.activeFolder.name}
          isImportingDriveFiles={page.isImportingDriveFiles}
          isOpeningDrivePicker={page.isOpeningDrivePicker}
          onClearSelection={page.clearDriveSelection}
          onImportSelection={() => {
            void page.importSelectedDriveFiles();
          }}
          onRemoveFile={page.removeDriveFile}
          onSelectMore={() => {
            void page.openDrivePicker();
          }}
          selectedFiles={page.selectedDriveFiles}
        />
      )}

      {page.isEmpty ? (
        <ContractsEmptyState
          importControl={
            page.canImportContract ? (
              <ContractsImportMenu
                align="left"
                isImportingDriveFiles={page.isImportingDriveFiles}
                isOpeningDrivePicker={page.isOpeningDrivePicker}
                onOpenDrive={page.openDrivePicker}
              />
            ) : undefined
          }
          onCreateContract={
            page.canCreateContract ? page.openCreateForm : undefined
          }
        />
      ) : (
        <>
          <ContractsActionsBar
            contracts={page.activeContracts}
            dateRange={page.dateRange}
            filter={page.filter}
            importControl={
              page.canImportContract ? (
                <ContractsImportMenu
                  isImportingDriveFiles={page.isImportingDriveFiles}
                  isOpeningDrivePicker={page.isOpeningDrivePicker}
                  onOpenDrive={page.openDrivePicker}
                />
              ) : undefined
            }
            onCreateContract={
              page.canCreateContract ? page.openCreateForm : undefined
            }
            onDateRangeChange={page.changeDateRange}
            onFilterChange={page.changeFilter}
            onSearchChange={page.changeSearch}
            onSortOrderChange={page.changeSortOrder}
            search={page.search}
            sortOrder={page.sortOrder}
          />

          {page.canDeleteContract && selectedIds.size > 0 && (
            <div className="mb-3">
              <TableBulkActionBar
                isDeleting={isBulkDeleting}
                itemLabel="contrato"
                onDelete={handleBulkDelete}
                onDeselectAll={() => setSelectedIds(new Set())}
                onSelectAll={selectAllContracts}
                selectedCount={selectedIds.size}
                totalCount={page.filteredContracts.length}
              />
            </div>
          )}

          <div className="flex-1 min-h-0">
            <ContractsTable
              canDelete={page.canDeleteContract}
              canEdit={page.canEditContract}
              contracts={page.paginatedContracts}
              userRole={page.userRole as ApiUserRole | null}
              currentPage={page.safeCurrentPage}
              filteredCount={page.filteredContracts.length}
              itemsPerPage={page.itemsPerPage}
              onDelete={page.openDeleteModal}
              onEdit={page.openEditForm}
              onItemsPerPageChange={page.changeItemsPerPage}
              onPageChange={page.changePage}
              onToggleSelect={
                page.canDeleteContract ? toggleSelectContract : undefined
              }
              onView={(contract: DocumentFlatten) => {
                void page.viewContract(contract);
              }}
              selectedIds={page.canDeleteContract ? selectedIds : undefined}
              startIndex={page.startIndex}
              totalPages={page.totalPages}
            />
          </div>
        </>
      )}

      <ContractPreviewModal
        contract={page.previewContract!}
        error={page.previewError}
        loading={page.previewLoading}
        onClose={page.closePreview}
        onOpenInNewTab={page.openPreviewInNewTab}
        open={page.showPreview}
        previewUrl={page.previewUrl}
      />

      {page.canCreateContract && (
        <NewContractModal
          availableFolders={page.availableFolders}
          defaultFolderId={
            page.activeFolder.id === 0 ? null : page.activeFolder.id
          }
          onClose={page.closeCreateForm}
          onSubmit={page.addContract}
          open={page.showForm}
        />
      )}

      {page.canEditContract && (
        <ContractFormModal
          availableFolders={page.availableFolders}
          editMode
          initialData={page.contractToEdit ?? undefined}
          onClose={page.closeEditForm}
          onSubmit={page.updateContract}
          open={page.showEditForm && Boolean(page.contractToEdit)}
        />
      )}

      {page.canDeleteContract && (
        <ContractDeleteModal
          contractName={page.contractToDelete?.client ?? null}
          deleting={page.deleting}
          onClose={page.closeDeleteModal}
          onConfirm={() => {
            void page.confirmDelete();
          }}
          open={page.showDeleteModal}
        />
      )}
    </div>
  );
}
