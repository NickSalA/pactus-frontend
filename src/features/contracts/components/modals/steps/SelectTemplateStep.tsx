'use client';

import { CheckCircle2, LoaderCircle } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { StepHeading } from '@/features/contracts/components/ui/StepHeading';
import { getTemplateFieldCount } from '@/lib/templateFields';
import { getDocumentTypeLabel } from '@/lib/document.utils';
import type { ApiDocumentType, ApiTemplateResponse } from '@/types/api';

type SelectTemplateStepProps = {
  currentWizardStep: number;
  wizardSteps: readonly string[];
  flowError: string | null;
  canChooseDocumentType: boolean;
  allowedDocumentTypes?: readonly ApiDocumentType[] | null;
  selectedDocumentType: ApiDocumentType;
  selectedTemplateId: number | null;
  templatesLoading: boolean;
  templatesError: string | null;
  visibleTemplates: readonly ApiTemplateResponse[];
  onSelectTemplate: (template: ApiTemplateResponse) => void;
  onDocumentTypeChange: (documentType: ApiDocumentType) => void;
};

export function SelectTemplateStep({
  currentWizardStep,
  wizardSteps,
  flowError,
  canChooseDocumentType,
  allowedDocumentTypes,
  selectedDocumentType,
  selectedTemplateId,
  templatesLoading,
  templatesError,
  visibleTemplates,
  onSelectTemplate,
  onDocumentTypeChange,
}: SelectTemplateStepProps) {
  return (
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
              Revisa el nombre, el formato y la descripción antes de continuar.
            </p>
          </div>

          {canChooseDocumentType ? (
            <Select
              variant="md"
              value={selectedDocumentType}
              onChange={(event) =>
                onDocumentTypeChange(event.target.value as ApiDocumentType)
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

        {templatesLoading && (
          <div className="flex min-h-[280px] items-center justify-center">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Cargando plantillas publicadas...
            </div>
          </div>
        )}

        {!templatesLoading && templatesError && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {templatesError}
          </div>
        )}

        {!templatesLoading && !templatesError && (
          <div className="mt-5 grid auto-rows-max gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleTemplates.map((template) => {
              const isSelected = template.id === selectedTemplateId;

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onSelectTemplate(template)}
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
                    {template.description ?? 'Sin descripción adicional.'}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                      {getTemplateFieldCount(template.content)} dato
                      {getTemplateFieldCount(template.content) === 1 ? '' : 's'}
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
                No hay plantillas publicadas disponibles para el tipo documental
                seleccionado.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}