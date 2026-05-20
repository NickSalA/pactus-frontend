'use client';

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  LoaderCircle,
  User,
} from 'lucide-react';
import type { ApiTemplateResponse, ApiTemplateField } from '@/types/api';
import type { FieldSection } from '@/features/contracts/lib/field-utils';
import type { FieldSectionNavItem } from '@/features/contracts/types/FieldSectionNavItem';
import type { DynamicFieldValues } from '@/features/contracts/hooks/use-contract-generation';
import { FieldSectionHorizontalStepper } from '@/features/contracts/components/ui/FieldSectionHorizontalStepper';
import { LabeledField } from '@/features/contracts/components/ui/LabeledField';
import {
  normalizeTemplateFieldType,
  TEMPLATE_FIELD_TYPE_LABELS,
} from '@/lib/templateFields';

type FillTemplateStepProps = {
  selectedTemplate: ApiTemplateResponse;
  currentWizardStep: number;
  wizardSteps: readonly string[];
  sectionTimelineItems: readonly FieldSectionNavItem[];
  currentSectionItem: FieldSectionNavItem | null;
  currentFieldSection: FieldSection | null;
  fieldSections: readonly FieldSection[];
  fieldValues: DynamicFieldValues;
  requiredFieldsCount: number;
  completedRequiredFieldsCount: number;
  isCurrentSectionOperational: boolean;
  isLastSection: boolean;
  generationValidationError: string | null;
  submitState: 'idle' | 'loading' | 'success' | 'error';
  flowError: string | null;
  partyName: string;
  operationalNameLabel: string;
  operationalNamePlaceholder: string;
  shouldUseTextarea: (field: ApiTemplateField) => boolean;
  getFieldPlaceholder: (field: ApiTemplateField) => string;
  onStepperSelect: (id: string) => void;
  onSectionNext: () => void;
  onSectionPrevious: () => void;
  onGenerateOnLastSection: () => void;
  onPartyNameChange: (value: string) => void;
  onDynamicFieldChange: (fieldKey: string, value: string | boolean) => void;
  onSaveCurrentSection: () => void;
};

export function FillTemplateStep({
  selectedTemplate,
  currentWizardStep,
  wizardSteps,
  sectionTimelineItems,
  currentSectionItem,
  currentFieldSection,
  fieldSections,
  fieldValues,
  requiredFieldsCount,
  completedRequiredFieldsCount,
  isCurrentSectionOperational,
  isLastSection,
  generationValidationError,
  submitState,
  flowError,
  partyName,
  operationalNameLabel,
  operationalNamePlaceholder,
  shouldUseTextarea,
  getFieldPlaceholder,
  onStepperSelect,
  onSectionNext,
  onSectionPrevious,
  onGenerateOnLastSection,
  onPartyNameChange,
  onDynamicFieldChange,
  onSaveCurrentSection,
}: FillTemplateStepProps) {
  return (
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
              <p className="text-xs text-slate-500">{selectedTemplate.name}</p>
            </div>
          </div>

          {requiredFieldsCount > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-xs text-slate-500">Obligatorios:</span>
              <span className="text-sm font-bold text-slate-900">
                {completedRequiredFieldsCount}/{requiredFieldsCount}
              </span>
            </div>
          )}
        </div>

        {sectionTimelineItems.length > 0 && (
          <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3">
            <FieldSectionHorizontalStepper
              activeId={currentSectionItem?.id ?? null}
              items={sectionTimelineItems}
              onSelect={onStepperSelect}
            />
          </div>
        )}

        {flowError && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {flowError}
          </div>
        )}

        {submitState === 'success' && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold">Contrato generado correctamente</p>
                <p className="mt-1 text-emerald-800">
                  Revisa el PDF y luego guarda para cerrar este flujo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {sectionTimelineItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
            Esta plantilla no necesita datos adicionales. Genera el contrato
            cuando estés listo.
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
                  onChange={(event) => onPartyNameChange(event.target.value)}
                  placeholder={operationalNamePlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </LabeledField>
            ) : currentFieldSection ? (
              <div className="grid gap-4 md:grid-cols-2">
                {currentFieldSection.fields.map((field) => {
                  const fieldType = normalizeTemplateFieldType(field.type);
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
                                <span className="ml-1 text-red-500">*</span>
                              )}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {TEMPLATE_FIELD_TYPE_LABELS[fieldType]}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={value === true}
                            onChange={(event) =>
                              onDynamicFieldChange(
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
                          value={typeof value === 'string' ? value : ''}
                          onChange={(event) =>
                            onDynamicFieldChange(field.key, event.target.value)
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
                        value={typeof value === 'string' ? value : ''}
                        onChange={(event) =>
                          onDynamicFieldChange(field.key, event.target.value)
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
            onClick={onSectionPrevious}
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
                void onGenerateOnLastSection();
              }}
              disabled={
                submitState === 'loading' || Boolean(generationValidationError)
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
              onClick={onSectionNext}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
