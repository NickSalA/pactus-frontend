'use client';

import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FilePlus,
  FileText,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { ContractFormProgress } from '@/features/contracts/components/form/ContractFormProgress';
import { Select } from '@/components/ui/Select';
import { LabeledField } from '@/features/contracts/components/ui/LabeledField';
import { SelectionCard } from '@/features/contracts/components/ui/SelectionCard';
import { StepHeading } from '@/features/contracts/components/ui/StepHeading';
import {
  ContractSummaryPanel,
  FillTemplateStep,
  FolderStep,
  SelectActionStep,
  SelectTemplateStep,
  ServicesStep,
} from '@/features/contracts/components/modals/steps';
import { useContractGeneration } from '@/features/contracts/hooks/useContractGeneration';
import type { DocumentFlatten } from '@/types/ui.types';
import type { ContractFolder } from '@/features/contracts/lib/contractsUtils';
import type { ApiDocumentType } from '@/types/api';
import { getDocumentTypeLabel } from '@/lib/document.utils';
import { getTemplateFieldCount } from '@/lib/templateFields';
import { CURRENCY_OPTIONS } from '@/lib/document.utils';

const ContractForm = dynamic(
  () => import('@/features/contracts/components/form/ContractForm'),
  {
    loading: () => (
      <div className="flex h-full items-center justify-center p-8">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          Cargando formulario...
        </div>
      </div>
    ),
  },
);

export type NewContractModalProps = {
  availableFolders?: readonly ContractFolder[];
  defaultFolderId?: number | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (contract: DocumentFlatten) => void;
};

export function NewContractModal({
  availableFolders = [],
  defaultFolderId = null,
  open,
  onClose,
  onSubmit,
}: NewContractModalProps) {
  const {
    addServiceItem,
    allowedDocumentTypes,
    canChooseDocumentType,
    completedRequiredFieldsCount,
    currentFieldSection,
    fieldSections,
    currentSectionItem,
    currentWizardStep,
    flow,
    fieldValues,
    flowError,
    folderId,
    generatedDocument,
    generationValidationError,
    getFieldPlaceholder,
    handleBackFromUpload,
    handleClose,
    handleDocumentTypeChange,
    handleDynamicFieldChange,
    handleFolderChange,
    handleGenerateOnLastSection,
    handlePartyNameChange,
    handlePrimaryAction,
    handleSaveCurrentSection,
    handleSaveGeneratedContract,
    handleSecondaryAction,
    handleSectionNext,
    handleSectionPrevious,
    handleSelectAction,
    handleSelectTemplate,
    handleServiceItemChange,
    handleStepperSelect,
    isCurrentSectionOperational,
    isLastSection,
    operationalNameLabel,
    operationalNamePlaceholder,
    partyName,
    previewUrl,
    primaryButtonDisabled,
    primaryButtonLabel,
    removeServiceItem,
    requiredFieldsCount,
    secondaryButtonLabel,
    sectionTimelineItems,
    selectedAction,
    selectedDocumentType,
    selectedFolderName,
    selectedTemplate,
    selectedTemplateId,
    serviceItems,
    serviceNameById,
    services,
    servicesError,
    servicesLoading,
    shouldUseTextarea,
    submitState,
    templatesError,
    templatesLoading,
    visibleTemplates,
    wizardSteps,
  } = useContractGeneration({
    availableFolders,
    defaultFolderId,
    open,
    onClose,
    onSubmit,
  });

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative flex h-[94vh] max-h-245 w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>

        {flow === 'upload' ? (
          <ContractForm
            availableFolders={availableFolders}
            defaultFolderId={defaultFolderId}
            onAdd={onSubmit}
            onClose={handleBackFromUpload}
          />
        ) : (
          <>
            {flow !== 'select-action' && (
              <div className="shrink-0 border-b border-slate-100 px-7 pb-2 pt-6">
                <ContractFormProgress
                  currentStep={currentWizardStep}
                  steps={wizardSteps}
                />
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-hidden px-7 pb-6 pt-6">
              {flow === 'select-action' && (
                <SelectActionStep
                  currentWizardStep={currentWizardStep}
                  wizardSteps={wizardSteps}
                  flowError={flowError}
                  selectedAction={selectedAction}
                  onSelectAction={handleSelectAction}
                />
              )}

              {flow === 'select-template' && (
                <SelectTemplateStep
                  currentWizardStep={currentWizardStep}
                  wizardSteps={wizardSteps}
                  flowError={flowError}
                  canChooseDocumentType={canChooseDocumentType}
                  allowedDocumentTypes={allowedDocumentTypes}
                  selectedDocumentType={selectedDocumentType}
                  selectedTemplateId={selectedTemplateId}
                  templatesLoading={templatesLoading}
                  templatesError={templatesError}
                  visibleTemplates={visibleTemplates}
                  onSelectTemplate={handleSelectTemplate}
                  onDocumentTypeChange={handleDocumentTypeChange}
                />
              )}

              {flow === 'services' && selectedTemplate && (
                <ServicesStep
                  currentWizardStep={currentWizardStep}
                  wizardSteps={wizardSteps}
                  flowError={flowError}
                  servicesLoading={servicesLoading}
                  servicesError={servicesError}
                  serviceItems={serviceItems}
                  services={services}
                  serviceNameById={serviceNameById}
                  onAddServiceItem={addServiceItem}
                  onRemoveServiceItem={removeServiceItem}
                  onServiceItemChange={handleServiceItemChange}
                />
              )}

              {flow === 'folder' && (
                <FolderStep
                  currentWizardStep={currentWizardStep}
                  wizardSteps={wizardSteps}
                  flowError={flowError}
                  availableFolders={availableFolders}
                  folderId={folderId}
                  selectedFolderName={selectedFolderName}
                  onFolderChange={handleFolderChange}
                />
              )}

              {flow === 'fill-template' && selectedTemplate && (
                <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.667fr)]">
                  <FillTemplateStep
                    selectedTemplate={selectedTemplate}
                    currentWizardStep={currentWizardStep}
                    wizardSteps={wizardSteps}
                    sectionTimelineItems={sectionTimelineItems}
                    currentSectionItem={currentSectionItem}
                    currentFieldSection={currentFieldSection}
                    fieldSections={fieldSections}
                    fieldValues={fieldValues}
                    requiredFieldsCount={requiredFieldsCount}
                    completedRequiredFieldsCount={completedRequiredFieldsCount}
                    isCurrentSectionOperational={isCurrentSectionOperational}
                    isLastSection={isLastSection}
                    generationValidationError={generationValidationError}
                    submitState={submitState}
                    flowError={flowError}
                    partyName={partyName}
                    operationalNameLabel={operationalNameLabel}
                    operationalNamePlaceholder={operationalNamePlaceholder}
                    shouldUseTextarea={shouldUseTextarea}
                    getFieldPlaceholder={getFieldPlaceholder}
                    onStepperSelect={handleStepperSelect}
                    onSectionNext={handleSectionNext}
                    onSectionPrevious={handleSectionPrevious}
                    onGenerateOnLastSection={handleGenerateOnLastSection}
                    onPartyNameChange={handlePartyNameChange}
                    onDynamicFieldChange={handleDynamicFieldChange}
                    onSaveCurrentSection={handleSaveCurrentSection}
                  />

                  <ContractSummaryPanel
                    submitState={submitState}
                    generatedDocument={generatedDocument}
                    previewUrl={previewUrl}
                    flowError={flowError}
                  />
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 px-7 py-4">
              <button
                type="button"
                onClick={handleSecondaryAction}
                disabled={submitState === 'loading'}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                {secondaryButtonLabel}
              </button>

              {flow === 'fill-template' ? (
                submitState === 'success' && generatedDocument ? (
                  <button
                    type="button"
                    onClick={handleSaveGeneratedContract}
                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Guardar contrato
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveCurrentSection}
                    disabled={submitState === 'loading'}
                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Guardar
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    void handlePrimaryAction();
                  }}
                  disabled={primaryButtonDisabled}
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowRight className="h-4 w-4" />
                  {primaryButtonLabel}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
