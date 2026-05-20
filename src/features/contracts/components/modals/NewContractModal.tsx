'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FilePlus,
  FileText,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import { ContractFormProgress } from '@/features/contracts/components/form/ContractFormProgress';
import { Select } from '@/components/ui/Select';
import { FieldSectionHorizontalStepper } from '@/features/contracts/components/ui/FieldSectionHorizontalStepper';
import { LabeledField } from '@/features/contracts/components/ui/LabeledField';
import { SelectionCard } from '@/features/contracts/components/ui/SelectionCard';
import { StepHeading } from '@/features/contracts/components/ui/StepHeading';
import { useContractGeneration } from '@/features/contracts/hooks/use-contract-generation';
import type { DocumentFlatten } from '@/types/ui.types';
import type { ContractFolder } from '@/features/contracts/lib/contracts-utils';
import type { ApiDocumentType } from '@/types/api';
import { getDocumentTypeLabel } from '@/lib/document.utils';
import {
  getTemplateFieldCount,
  normalizeTemplateFieldType,
  TEMPLATE_FIELD_TYPE_LABELS,
} from '@/lib/templateFields';
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
    servicesState,
    shouldUseTextarea,
    submitState,
    templatesError,
    templatesState,
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
        className="relative flex h-[94vh] max-h-[980px] w-full max-w-[1280px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
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
                <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
                  <StepHeading
                    currentStep={currentWizardStep}
                    description="Elige si quieres subir un contrato existente o generar uno desde una plantilla publicada."
                    title="¿Cómo quieres agregar el contrato?"
                    totalSteps={wizardSteps.length}
                  />

                  {flowError && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {flowError}
                    </div>
                  )}

                  <div className="mt-6 grid flex-1 auto-rows-fr gap-4 md:grid-cols-2">
                    <SelectionCard
                      description="Carga un PDF ya firmado o en proceso para organizarlo dentro de tus contratos."
                      icon={<Upload className="h-7 w-7 text-blue-600" />}
                      onClick={() => handleSelectAction('upload')}
                      selected={selectedAction === 'upload'}
                      title="Subir contrato existente"
                    />
                    <SelectionCard
                      description="Elige una plantilla y completa los datos del contrato paso a paso."
                      icon={<FilePlus className="h-7 w-7 text-blue-600" />}
                      onClick={() => handleSelectAction('generate')}
                      selected={selectedAction === 'generate'}
                      title="Generar con plantilla"
                    />
                  </div>
                </div>
              )}

              {flow === 'select-template' && (
                <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-y-auto pr-1">
                  <StepHeading
                    currentStep={currentWizardStep}
                    description="Selecciona la plantilla que mejor se ajuste al contrato que vas a generar."
                    title="Elige una plantilla"
                    totalSteps={wizardSteps.length}
                  />

                  {flowError && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {flowError}
                    </div>
                  )}

                  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Plantillas disponibles
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Revisa el nombre, el formato y la descripción antes de
                          continuar.
                        </p>
                      </div>

                      {canChooseDocumentType ? (
                        <Select
                          variant="md"
                          value={selectedDocumentType}
                          onChange={(event) =>
                            handleDocumentTypeChange(
                              event.target.value as ApiDocumentType,
                            )
                          }
                        >
                          {(allowedDocumentTypes ?? ['LABOR', 'COMPANY']).map(
                            (documentType) => (
                              <option key={documentType} value={documentType}>
                                {getDocumentTypeLabel(documentType)}
                              </option>
                            ),
                          )}
                        </Select>
                      ) : (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                          {getDocumentTypeLabel(selectedDocumentType)}
                        </span>
                      )}
                    </div>

                    {templatesState === 'loading' && (
                      <div className="flex min-h-[280px] items-center justify-center">
                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Cargando plantillas publicadas...
                        </div>
                      </div>
                    )}

                    {templatesState !== 'loading' && templatesError && (
                      <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {templatesError}
                      </div>
                    )}

                    {templatesState !== 'loading' && !templatesError && (
                      <div className="mt-5 grid auto-rows-max gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {visibleTemplates.map((template) => {
                          const isSelected = template.id === selectedTemplateId;

                          return (
                            <button
                              key={template.id}
                              type="button"
                              onClick={() => handleSelectTemplate(template)}
                              className={`rounded-3xl border p-5 text-left transition ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50/70 shadow-sm'
                                  : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {template.name}
                                  </p>
                                  {template.format_label && (
                                    <p className="mt-1 text-xs text-slate-500">
                                      {template.format_label}
                                    </p>
                                  )}
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
                                )}
                              </div>

                              <p className="mt-4 text-sm leading-6 text-slate-600">
                                {template.description ??
                                  'Sin descripción adicional.'}
                              </p>

                              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                                  {getTemplateFieldCount(template.content)} dato
                                  {getTemplateFieldCount(template.content) === 1
                                    ? ''
                                    : 's'}
                                </span>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                                  Publicada
                                </span>
                              </div>
                            </button>
                          );
                        })}

                        {visibleTemplates.length === 0 && (
                          <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
                            No hay plantillas publicadas disponibles para el
                            tipo documental seleccionado.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {flow === 'services' && selectedTemplate && (
                <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-y-auto pr-1">
                  <StepHeading
                    currentStep={currentWizardStep}
                    description="Selecciona los servicios que formarán parte de este contrato. Puedes continuar sin agregar servicios."
                    title="Servicios del contrato"
                    totalSteps={wizardSteps.length}
                  />

                  {flowError && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {flowError}
                    </div>
                  )}

                  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Servicios seleccionados
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Cada servicio puede incluir descripción, valor y rango
                          de fechas.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={addServiceItem}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar servicio
                      </button>
                    </div>

                    {servicesState === 'loading' && (
                      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Cargando catálogo de servicios...
                      </div>
                    )}

                    {servicesError && (
                      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        {servicesError}
                      </div>
                    )}

                    {serviceItems.length === 0 ? (
                      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                        Aún no has agregado servicios. Puedes continuar y
                        añadirlos más adelante si lo necesitas.
                      </div>
                    ) : (
                      <div className="mt-5 space-y-4">
                        {serviceItems.map((item, index) => (
                          <div
                            key={item.key}
                            className="rounded-2xl border border-slate-200 p-4"
                          >
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  Servicio {index + 1}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {serviceNameById.get(item.service_id) ??
                                    'Completa la información del servicio'}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeServiceItem(item.key)}
                                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Quitar
                              </button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <LabeledField label="Servicio" required>
                                <Select
                                  variant="md"
                                  className="w-full"
                                  value={item.service_id}
                                  onChange={(event) =>
                                    handleServiceItemChange(
                                      item.key,
                                      'service_id',
                                      event.target.value,
                                    )
                                  }
                                >
                                  <option value="">
                                    Selecciona un servicio
                                  </option>
                                  {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                      {service.name}
                                    </option>
                                  ))}
                                </Select>
                              </LabeledField>

                              <LabeledField label="Moneda" required>
                                <Select
                                  variant="md"
                                  className="w-full"
                                  value={item.currency}
                                  onChange={(event) =>
                                    handleServiceItemChange(
                                      item.key,
                                      'currency',
                                      event.target.value,
                                    )
                                  }
                                >
                                  <option value="">Selecciona moneda</option>
                                  {CURRENCY_OPTIONS.map((currency) => (
                                    <option key={currency} value={currency}>
                                      {currency}
                                    </option>
                                  ))}
                                </Select>
                              </LabeledField>

                              <LabeledField label="Descripción">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(event) =>
                                    handleServiceItemChange(
                                      item.key,
                                      'description',
                                      event.target.value,
                                    )
                                  }
                                  placeholder="Detalle opcional"
                                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />
                              </LabeledField>

                              <LabeledField label="Valor" required>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.value}
                                  onChange={(event) =>
                                    handleServiceItemChange(
                                      item.key,
                                      'value',
                                      event.target.value,
                                    )
                                  }
                                  placeholder="0.00"
                                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />
                              </LabeledField>

                              <LabeledField label="Fecha de inicio" required>
                                <input
                                  type="date"
                                  value={item.start_date}
                                  onChange={(event) =>
                                    handleServiceItemChange(
                                      item.key,
                                      'start_date',
                                      event.target.value,
                                    )
                                  }
                                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />
                              </LabeledField>

                              <LabeledField label="Fecha de fin" required>
                                <input
                                  type="date"
                                  value={item.end_date}
                                  onChange={(event) =>
                                    handleServiceItemChange(
                                      item.key,
                                      'end_date',
                                      event.target.value,
                                    )
                                  }
                                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />
                              </LabeledField>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {flow === 'folder' && (
                <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-y-auto pr-1">
                  <StepHeading
                    currentStep={currentWizardStep}
                    description="Elige la carpeta donde quieres guardar el contrato generado."
                    title="Carpeta destino"
                    totalSteps={wizardSteps.length}
                  />

                  {flowError && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {flowError}
                    </div>
                  )}

                  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Ubicación del contrato
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Si no eliges una carpeta, el contrato quedará disponible
                        en la vista general.
                      </p>
                    </div>

                    {availableFolders.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                        Aún no hay carpetas disponibles. El contrato se guardará
                        sin carpeta.
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
                        <LabeledField label="Carpeta destino">
                          <Select
                            variant="md"
                            className="w-full"
                            value={folderId ?? ''}
                            onChange={(event) =>
                              handleFolderChange(event.target.value)
                            }
                          >
                            <option value="">Sin carpeta</option>
                            {availableFolders.map((folder) => (
                              <option key={folder.id} value={folder.id}>
                                {folder.name}
                              </option>
                            ))}
                          </Select>
                        </LabeledField>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                            Selección actual
                          </p>
                          <p className="mt-2 text-base font-semibold text-slate-900">
                            {selectedFolderName ?? 'Sin carpeta'}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Puedes cambiar esta ubicación más adelante si lo
                            necesitas.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {flow === 'fill-template' && selectedTemplate && (
                <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.667fr)]">
                  <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                            {selectedTemplate.document_type === 'COMPANY' ? (
                              <Building2 className="h-5 w-5" />
                            ) : (
                              <User className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                              Datos del contrato
                            </h2>
                            <p className="text-xs text-slate-500">
                              {selectedTemplate.name}
                            </p>
                          </div>
                        </div>

                        {requiredFieldsCount > 0 && (
                          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <span className="text-xs text-slate-500">
                              Obligatorios:
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {completedRequiredFieldsCount}/
                              {requiredFieldsCount}
                            </span>
                          </div>
                        )}
                      </div>

                      {sectionTimelineItems.length > 0 && (
                        <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3">
                          <FieldSectionHorizontalStepper
                            activeId={currentSectionItem?.id ?? null}
                            items={sectionTimelineItems}
                            onSelect={handleStepperSelect}
                          />
                        </div>
                      )}

                      {flowError && (
                        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          {flowError}
                        </div>
                      )}

                      {submitState === 'success' && generatedDocument && (
                        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                            <div>
                              <p className="font-semibold">
                                Contrato generado correctamente
                              </p>
                              <p className="mt-1 text-emerald-800">
                                Revisa el PDF y luego guarda para cerrar este
                                flujo.
                              </p>
                              <p className="mt-1 text-emerald-800">
                                {generatedDocument.type +
                                  ' - ' +
                                  generatedDocument.client}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                      {sectionTimelineItems.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                          Esta plantilla no necesita datos adicionales. Genera
                          el contrato cuando estés listo.
                        </div>
                      ) : currentSectionItem ? (
                        <div>
                          <h3 className="mb-5 text-base font-semibold text-slate-800">
                            {currentSectionItem.title}
                          </h3>

                          {isCurrentSectionOperational ? (
                            <LabeledField label={operationalNameLabel} required>
                              <input
                                type="text"
                                value={partyName}
                                onChange={(event) =>
                                  handlePartyNameChange(event.target.value)
                                }
                                placeholder={operationalNamePlaceholder}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                              />
                            </LabeledField>
                          ) : currentFieldSection ? (
                            <div className="grid gap-4 md:grid-cols-2">
                              {currentFieldSection.fields.map((field) => {
                                const fieldType = normalizeTemplateFieldType(
                                  field.type,
                                );
                                const value = fieldValues[field.key];

                                if (fieldType === 'boolean') {
                                  return (
                                    <div
                                      key={field.key}
                                      className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3"
                                    >
                                      <label className="flex items-center justify-between gap-4">
                                        <div>
                                          <p className="text-sm font-medium text-slate-800">
                                            {field.label}
                                            {field.required && (
                                              <span className="ml-1 text-red-500">
                                                *
                                              </span>
                                            )}
                                          </p>
                                          <p className="mt-1 text-xs text-slate-500">
                                            {
                                              TEMPLATE_FIELD_TYPE_LABELS[
                                                fieldType
                                              ]
                                            }
                                          </p>
                                        </div>
                                        <input
                                          type="checkbox"
                                          checked={value === true}
                                          onChange={(event) =>
                                            handleDynamicFieldChange(
                                              field.key,
                                              event.target.checked,
                                            )
                                          }
                                          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                                        />
                                      </label>
                                    </div>
                                  );
                                }

                                if (shouldUseTextarea(field)) {
                                  return (
                                    <LabeledField
                                      key={field.key}
                                      label={field.label}
                                      required={field.required}
                                    >
                                      <textarea
                                        rows={3}
                                        value={
                                          typeof value === 'string' ? value : ''
                                        }
                                        onChange={(event) =>
                                          handleDynamicFieldChange(
                                            field.key,
                                            event.target.value,
                                          )
                                        }
                                        placeholder={getFieldPlaceholder(field)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </LabeledField>
                                  );
                                }

                                return (
                                  <LabeledField
                                    key={field.key}
                                    label={field.label}
                                    required={field.required}
                                  >
                                    <input
                                      type={
                                        fieldType === 'date'
                                          ? 'date'
                                          : fieldType === 'time'
                                            ? 'time'
                                            : fieldType === 'number'
                                              ? 'number'
                                              : 'text'
                                      }
                                      value={
                                        typeof value === 'string' ? value : ''
                                      }
                                      onChange={(event) =>
                                        handleDynamicFieldChange(
                                          field.key,
                                          event.target.value,
                                        )
                                      }
                                      placeholder={getFieldPlaceholder(field)}
                                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    />
                                  </LabeledField>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={handleSectionPrevious}
                          disabled={submitState === 'loading'}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Anterior
                        </button>

                        {isLastSection ? (
                          <button
                            type="button"
                            onClick={() => {
                              void handleGenerateOnLastSection();
                            }}
                            disabled={
                              submitState === 'loading' ||
                              Boolean(generationValidationError)
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {submitState === 'loading' ? (
                              <>
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Generando...
                              </>
                            ) : (
                              <>
                                <FileText className="h-4 w-4" />
                                Generar contrato
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSectionNext}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                          >
                            Siguiente
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </section>

                  <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                    <div className="border-b border-slate-200 bg-white px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {submitState === 'success'
                            ? 'Previsualización'
                            : 'Resumen'}
                        </p>
                        {previewUrl && (
                          <a
                            href={previewUrl}
                            rel="noreferrer"
                            target="_blank"
                            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            Abrir
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto p-4">
                      {submitState === 'success' &&
                      generatedDocument &&
                      previewUrl ? (
                        <div className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                          <iframe
                            key={previewUrl}
                            title={`Vista previa de ${generatedDocument.type} - ${generatedDocument.client}`}
                            src={previewUrl}
                            className="h-full min-h-0 w-full bg-white"
                          />
                        </div>
                      ) : submitState === 'loading' ? (
                        <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
                          <LoaderCircle className="h-10 w-10 animate-spin text-blue-600" />
                          <div>
                            <p className="text-base font-medium text-slate-800">
                              Generando el documento
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              Preparando el PDF para su revisión...
                            </p>
                          </div>
                        </div>
                      ) : submitState === 'error' && flowError ? (
                        <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-red-200 bg-white px-6 text-center">
                          <FileText className="h-10 w-10 text-red-400" />
                          <div>
                            <p className="text-base font-medium text-slate-800">
                              Error al generar
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {flowError}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
                          <FileText className="h-10 w-10 text-slate-300" />
                          <div>
                            <p className="text-base font-medium text-slate-800">
                              La previsualización aparecerá aquí
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              Completa las secciones y usa el botón{' '}
                              <span className="font-medium text-slate-700">
                                Generar contrato
                              </span>{' '}
                              para ver el PDF.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
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
