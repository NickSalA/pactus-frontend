'use client';

import { useCallback, useState } from 'react';
import {
  buildFormStateWithDefaultType,
  type FormState,
} from '@/features/contracts/lib/contract-form.utils';
import { buildContractFormDataPayload } from '@/features/contracts/lib/contract-form-payloads';
import { useContractFormFile } from '@/features/contracts/hooks/use-contract-form-file';
import { useContractFormServices } from '@/features/contracts/hooks/use-contract-form-services';
import {
  useContractFormWizard,
  type ContractFormStep,
} from '@/features/contracts/hooks/use-contract-form-wizard';
import { updateDocument, uploadDocument } from '@/api';
import {
  canManageDocumentType,
  getDefaultWritableDocumentType,
  getWritableDocumentTypes,
} from '@/lib/permissions';
import { useAuthStore } from '@/store';
import type { Document, DocumentState } from '@/types/api.types';
import type { ContractFolder } from '@/features/contracts/lib/contracts-utils';

type ContractFormProps = {
  readonly availableFolders?: readonly ContractFolder[];
  readonly defaultFolderId?: number | null;
  readonly editMode?: boolean;
  readonly initialData?: Document;
  readonly onAdd: (contract: Document) => void;
  readonly onClose: () => void;
};

export type { ContractFormStep };

export function useContractForm({
  availableFolders = [],
  defaultFolderId = null,
  editMode = false,
  initialData,
  onAdd,
  onClose,
}: ContractFormProps) {
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const allowedDocumentTypes = getWritableDocumentTypes(userRole);
  const defaultDocumentType =
    getDefaultWritableDocumentType(userRole) ?? 'COMPANY';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(() =>
    buildFormStateWithDefaultType(initialData, defaultDocumentType),
  );

  const fileState = useContractFormFile({
    editMode,
    initialData,
    onInvalidFile: setError,
  });

  const servicesState = useContractFormServices({
    form,
    initialData,
    setForm,
  });

  const {
    addingService,
    buildServiceItemsPayload,
    cancelNewService: resetNewService,
    contractTotal,
    editingServiceKey,
    handleNewDraftChange,
    handleServiceChange,
    newServiceDraft,
    removeServiceItem,
    saveNewService: commitNewService,
    serviceOptions,
    servicesLoadError,
    servicesLoading,
    setEditingServiceKey,
    startAddingService: beginAddingService,
  } = servicesState;

  const validateStep2 = useCallback((): string | null => {
    if (addingService) {
      return 'Guarda o cancela el servicio actual antes de continuar.';
    }

    try {
      buildServiceItemsPayload();
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : 'Error en los servicios.';
    }
  }, [addingService, buildServiceItemsPayload]);

  const wizardState = useContractFormWizard({
    form,
    onBeforePrev: resetNewService,
    setForm,
    validateStep2,
  });

  const {
    closeSummary1,
    currentStep,
    goNext,
    goPrev,
    handleSummary1DraftChange,
    openSummary1,
    saveSummary1,
    setStepError,
    setSummary2Expanded,
    stepError,
    summary1Draft,
    summary1Expanded,
    summary2Expanded,
    visible,
  } = wizardState;

  const startAddingService = useCallback(() => {
    beginAddingService();
    setStepError(null);
  }, [beginAddingService, setStepError]);

  const cancelNewService = useCallback(() => {
    resetNewService();
    setStepError(null);
  }, [resetNewService, setStepError]);

  const saveNewService = useCallback(() => {
    const serviceError = commitNewService();
    setStepError(serviceError);
  }, [commitNewService, setStepError]);

  const setContractState = useCallback((nextState: DocumentState) => {
    setForm((previous) => ({ ...previous, state: nextState }));
  }, []);

  const handleFieldChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;

      if (name === 'folder_id') {
        setForm((previous) => ({
          ...previous,
          folder_id: value ? Number(value) : null,
        }));
        return;
      }

      if (
        name === 'type' &&
        allowedDocumentTypes &&
        !allowedDocumentTypes.includes(value as FormState['type'])
      ) {
        return;
      }

      setForm((previous) => ({ ...previous, [name]: value }));
    },
    [allowedDocumentTypes],
  );

  const {
    dragActive,
    file,
    fileError,
    handleDrag,
    handleDrop,
    handleFileChange,
    hasValidFile,
    keepOriginalFile,
    removeFile,
    setFileError,
    setKeepOriginalFile,
  } = fileState;

  const handleSubmit = useCallback(async () => {
    if (!hasValidFile) {
      setFileError(true);
      setError('Adjuntar un archivo asociado al contrato.');
      return;
    }

    if (!editMode && !file) {
      setFileError(true);
      setError('Debes seleccionar un archivo.');
      return;
    }

    if (!canManageDocumentType(userRole, form.type)) {
      setError('No tienes permisos para gestionar este tipo de contrato.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setFileError(false);

      const formDataPayload = buildContractFormDataPayload({
        contractTotal,
        currency: form.contract_currency,
        editMode,
        initialData,
      });
      const serviceItemsPayload = buildServiceItemsPayload();

      const result =
        editMode && initialData
          ? await updateDocument(initialData.id, {
              folder_id: form.folder_id,
              form_data: formDataPayload,
              service_items: serviceItemsPayload,
              state: form.state,
              contract_type: form.type as 'COMPANY' | 'LABOR',
            })
          : await uploadDocument({
              folder_id: defaultFolderId,
              form_data: formDataPayload,
              service_items: serviceItemsPayload,
              state: form.state,
              contract_type: form.type as 'COMPANY' | 'LABOR',
            });

      onAdd(result);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Error al ${editMode ? 'actualizar' : 'crear'} contrato`,
      );
    } finally {
      setLoading(false);
    }
  }, [
    buildServiceItemsPayload,
    contractTotal,
    defaultFolderId,
    editMode,
    file,
    form,
    hasValidFile,
    initialData,
    onAdd,
    onClose,
    setFileError,
    userRole,
  ]);

  return {
    addingService,
    allowedDocumentTypes,
    availableFolders,
    cancelNewService,
    closeSummary1,
    contractTotal,
    currentStep,
    dragActive,
    editingServiceKey,
    error,
    file,
    fileError,
    form,
    goNext,
    goPrev,
    handleDrag,
    handleDrop,
    handleFieldChange,
    handleFileChange,
    handleNewDraftChange,
    handleServiceChange,
    handleSubmit,
    handleSummary1DraftChange,
    hasValidFile,
    keepOriginalFile,
    loading,
    newServiceDraft,
    openSummary1,
    removeFile,
    removeServiceItem,
    saveNewService,
    saveSummary1,
    serviceOptions,
    servicesLoadError,
    servicesLoading,
    setContractState,
    setEditingServiceKey,
    setKeepOriginalFile,
    setSummary2Expanded,
    startAddingService,
    stepError,
    summary1Draft,
    summary1Expanded,
    summary2Expanded,
    visible,
  };
}
