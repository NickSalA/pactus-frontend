'use client';

import { useCallback } from 'react';
import { deleteDocument } from '@/api';
import {
  canCreateContracts,
  canCreateFolders,
  canImportContracts,
  canManageDocumentType,
  canManageFolderRole,
} from '@/lib/permissions';
import { useContractsCollection } from '@/features/contracts/hooks/use-contracts-collection';
import { useContractPreview } from '@/features/contracts/hooks/use-contract-preview';
import { useContractsDrivePicker } from '@/features/contracts/hooks/use-contracts-drive-picker';
import { useContractsFilters } from '@/features/contracts/hooks/use-contracts-filters';
import { useContractsModalState } from '@/features/contracts/hooks/use-contracts-modal-state';
import { useAuthStore } from '@/store';
import type { DocumentFlatten } from '@/types/api.types';
import { ApiDocumentType } from '@/types/api';

type UseContractsPageOptions = {
  shouldOpenCreateModal?: boolean;
};

export function useContractsPage({
  shouldOpenCreateModal = false,
}: UseContractsPageOptions) {
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const canCreateContract = canCreateContracts(userRole);
  const canCreateFolder = canCreateFolders(userRole);
  const canImportContract = canImportContracts(userRole);

  const {
    activeContracts,
    activeFolder,
    addContract,
    createFolder: createCollectionFolder,
    deleteFolder: deleteCollectionFolder,
    error,
    folders,
    isLoading,
    reloadContracts,
    removeContract,
    renameFolder: renameCollectionFolder,
    selectFolder: selectCollectionFolder,
    updateContract: updateCollectionContract,
  } = useContractsCollection();

  const editableFolders = folders.filter((folder) => !folder.isSystem);
  const canManageActiveFolder =
    !activeFolder.isSystem &&
    canManageFolderRole(userRole, activeFolder.owner_role);

  const {
    changeFilter,
    changeItemsPerPage,
    changePage,
    changeDateRange,
    changeSearch,
    changeSortOrder,
    dateRange,
    filter,
    filteredContracts,
    isEmpty,
    itemsPerPage,
    paginatedContracts,
    resetPagination,
    safeCurrentPage,
    search,
    sortOrder,
    startIndex,
    totalPages,
  } = useContractsFilters(activeContracts);

  const {
    clearDriveSelection,
    driveImportError,
    driveImportMessage,
    drivePickerError,
    importSelectedDriveFiles,
    isImportingDriveFiles,
    isOpeningDrivePicker,
    openDrivePicker,
    removeDriveFile,
    selectedDriveFiles,
  } = useContractsDrivePicker();

  const {
    closeCreateForm,
    closeDeleteModal,
    closeEditForm,
    contractToDelete,
    contractToEdit,
    deleting,
    openCreateForm,
    openDeleteModal,
    openEditForm,
    setDeleting,
    showDeleteModal,
    showEditForm,
    showForm,
  } = useContractsModalState({
    shouldOpenCreateModal: shouldOpenCreateModal && canCreateContract,
  });

  const {
    closePreview,
    openPreview,
    openPreviewInNewTab,
    previewContract,
    previewError,
    previewLoading,
    previewUrl,
    showPreview,
  } = useContractPreview();

  const updateContract = useCallback(
    (updatedContract: DocumentFlatten) => {
      updateCollectionContract(updatedContract);
      closeEditForm();
    },
    [closeEditForm, updateCollectionContract],
  );

  const confirmDelete = useCallback(async () => {
    if (!contractToDelete) {
      return;
    }

    try {
      setDeleting(true);
      await deleteDocument(contractToDelete.id);
      removeContract(contractToDelete.id);
      closeDeleteModal();
    } catch (err) {
      console.error('Error al eliminar:', err);
      window.alert(
        err instanceof Error ? err.message : 'Error al eliminar el contrato',
      );
    } finally {
      setDeleting(false);
    }
  }, [closeDeleteModal, contractToDelete, removeContract, setDeleting]);

  const bulkDeleteContracts = useCallback(
    async (ids: number[]): Promise<void> => {
      try {
        await Promise.all(ids.map((id) => deleteDocument(id)));
        ids.forEach((id) => removeContract(id));
      } catch (err) {
        console.error('Error en eliminación masiva:', err);
        window.alert(
          err instanceof Error
            ? err.message
            : 'Error al eliminar los contratos',
        );
      }
    },
    [removeContract],
  );

  const createFolder = useCallback(
    async (name: string) => {
      if (!canCreateFolder) {
        return;
      }

      await createCollectionFolder(name);
      resetPagination();
    },
    [canCreateFolder, createCollectionFolder, resetPagination],
  );

  const renameFolder = useCallback(
    async (folderId: number, name: string) => {
      if (!canManageFolderRole(userRole, activeFolder.owner_role)) {
        return;
      }

      await renameCollectionFolder(folderId, name);
    },
    [activeFolder.owner_role, renameCollectionFolder, userRole],
  );

  const deleteFolder = useCallback(
    async (folderId: number) => {
      if (!canManageFolderRole(userRole, activeFolder.owner_role)) {
        return;
      }

      await deleteCollectionFolder(folderId);
      resetPagination();
    },
    [
      activeFolder.owner_role,
      deleteCollectionFolder,
      resetPagination,
      userRole,
    ],
  );

  const handleOpenCreateForm = useCallback(() => {
    if (!canCreateContract) {
      return;
    }

    openCreateForm();
  }, [canCreateContract, openCreateForm]);

  const handleOpenEditForm = useCallback(
    (contract: DocumentFlatten) => {
      console.log(
        '[DEBUG] handleOpenEditForm - Role:',
        userRole,
        'Contract type:',
        contract.contract_type,
      );
      console.log(
        '[DEBUG] canManageDocumentType result:',
        canManageDocumentType(userRole, contract.type as ApiDocumentType),
      );
      if (
        !canManageDocumentType(
          userRole,
          contract.contract_type as ApiDocumentType,
        )
      ) {
        return;
      }

      openEditForm(contract);
    },
    [openEditForm, userRole],
  );

  const handleOpenDeleteModal = useCallback(
    (contract: DocumentFlatten) => {
      console.log(
        '[DEBUG] handleOpenDeleteModal - Role:',
        userRole,
        'Contract type:',
        contract.contract_type,
      );
      console.log(
        '[DEBUG] canManageDocumentType result:',
        canManageDocumentType(
          userRole,
          contract.contract_type as ApiDocumentType,
        ),
      );
      if (
        !canManageDocumentType(
          userRole,
          contract.contract_type as ApiDocumentType,
        )
      ) {
        return;
      }

      openDeleteModal(contract);
    },
    [openDeleteModal, userRole],
  );

  const handleOpenDrivePicker = useCallback(async () => {
    if (!canImportContract) {
      return;
    }

    await openDrivePicker();
  }, [canImportContract, openDrivePicker]);

  const handleImportSelectedDriveFiles = useCallback(async () => {
    if (!canImportContract) {
      return;
    }

    await importSelectedDriveFiles();
  }, [canImportContract, importSelectedDriveFiles]);

  const selectFolder = useCallback(
    (folderId: number) => {
      selectCollectionFolder(folderId);
      resetPagination();
    },
    [resetPagination, selectCollectionFolder],
  );

  return {
    activeContracts,
    activeFolder,
    addContract,
    bulkDeleteContracts,
    changeDateRange,
    changeSortOrder,
    dateRange,
    sortOrder,
    availableFolders: editableFolders,
    canCreateContract,
    canCreateFolder,
    canDeleteContract: canCreateContract,
    canEditContract: canCreateContract,
    canImportContract,
    canManageActiveFolder,
    changeFilter,
    changeItemsPerPage,
    changePage,
    changeSearch,
    clearDriveSelection,
    closeCreateForm,
    closeDeleteModal,
    closeEditForm,
    closePreview,
    confirmDelete,
    contractToDelete,
    contractToEdit,
    createFolder,
    deleting,
    deleteFolder,
    driveImportError,
    driveImportMessage,
    drivePickerError,
    error,
    filter,
    filteredContracts,
    folders,
    importSelectedDriveFiles: handleImportSelectedDriveFiles,
    isEmpty,
    isImportingDriveFiles,
    isOpeningDrivePicker,
    itemsPerPage,
    isLoading,
    openPreviewInNewTab,
    paginatedContracts,
    previewContract,
    previewError,
    previewLoading,
    previewUrl,
    reloadContracts,
    renameFolder,
    removeDriveFile,
    safeCurrentPage,
    search,
    selectedDriveFiles,
    selectFolder,
    showPreview,
    showDeleteModal,
    showEditForm,
    showForm,
    startIndex,
    totalPages,
    updateContract,
    userRole,
    viewContract: openPreview,
    openCreateForm: handleOpenCreateForm,
    openDeleteModal: handleOpenDeleteModal,
    openDrivePicker: handleOpenDrivePicker,
    openEditForm: handleOpenEditForm,
  };
}
