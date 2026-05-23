'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarClock,
  FileText,
  Layers3,
  Tag,
  X,
} from 'lucide-react';
import {
  getAllTemplateFields,
  getTemplateFieldCount,
  getTemplateOperationalFields,
  normalizeTemplateFieldType,
  TEMPLATE_FIELD_TYPE_LABELS,
} from '@/lib/templateFields';
import { getDocumentTypeLabel } from '@/lib/document.utils';
import type { ApiTemplateResponse, ApiTemplateField } from '@/types/api';
import { TemplateWizardProgress } from '@/components/modals/TemplateWizardProgress';

type TemplateViewModalProps = {
  template: ApiTemplateResponse | null;
  warnings?: string[];
  onClose: () => void;
};

type ViewStep = 1 | 2 | 3;
const STEPS = ['Resumen', 'Contenido', 'Campos'];

const STATE_STYLES: Record<ApiTemplateResponse['state'], string> = {
  DRAFT: 'bg-amber-100 text-amber-700',
  PUBLISHED: 'bg-emerald-100 text-emerald-700',
  ARCHIVED: 'bg-slate-200 text-slate-700',
};

export function TemplateViewModal({
  template,
  warnings = [],
  onClose,
}: TemplateViewModalProps) {
  const [currentStep, setCurrentStep] = useState<ViewStep>(1);
  const contractFields = template?.content.fields ?? [];
  const operationalFields = useMemo(
    () => getTemplateOperationalFields(template?.content),
    [template?.content],
  );

  const markdownLines = useMemo(
    () =>
      template?.content.body_md.split(/\r?\n/).filter((l) => l.trim()).length ??
      0,
    [template?.content.body_md],
  );
  const requiredFieldsCount = useMemo(
    () =>
      getAllTemplateFields(template?.content).filter((f) => f.required).length,
    [template?.content],
  );

  if (!template) return null;

  const renderFieldTable = (
    fields: ApiTemplateField[],
    emptyMessage: string,
  ) => {
    if (fields.length === 0) {
      return (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              {['Clave', 'Etiqueta', 'Tipo', 'Placeholder', 'Requerido'].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {fields.map((field) => (
              <tr key={field.key} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs text-slate-700">
                  {field.key}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {field.label}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {
                    TEMPLATE_FIELD_TYPE_LABELS[
                      normalizeTemplateFieldType(field.type)
                    ]
                  }
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {field.placeholder?.trim() || '-'}
                </td>
                <td className="px-4 py-3">
                  {field.required ? (
                    <span className="text-red-600">Sí</span>
                  ) : (
                    <span className="text-slate-400">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                {template.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Revisión guiada de la plantilla sin perder el contexto clave.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            <TemplateWizardProgress
              currentStep={currentStep}
              onStepClick={(step) => setCurrentStep(step as ViewStep)}
              steps={STEPS}
            />

            {currentStep === 1 && (
              <div className="space-y-5">
                {warnings.length > 0 && (
                  <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900">
                          Advertencias del borrador
                        </p>
                        <ul className="mt-2 space-y-2 text-sm text-amber-800">
                          {warnings.map((warning, index) => (
                            <li key={`${warning}-${index}`}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>
                )}

                <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {template.name}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {template.description ??
                          'Esta plantilla no tiene una descripción adicional.'}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${STATE_STYLES[template.state]}`}
                    >
                      {template.state}
                    </span>
                  </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-slate-500" />
                      <p className="text-sm font-semibold text-slate-800">
                        Metadatos
                      </p>
                    </div>
                    <dl className="mt-4 space-y-3 text-sm text-slate-600">
                      <div className="flex items-center justify-between gap-4">
                        <dt>Organización</dt>
                        <dd className="font-medium text-slate-800">
                          {template.organization_id}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt>Versión</dt>
                        <dd className="font-medium text-slate-800">
                          {template.content.version ?? '1.0'}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt>Tipo documental</dt>
                        <dd className="font-medium text-slate-800">
                          {getDocumentTypeLabel(template.document_type)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt>Formato</dt>
                        <dd className="text-right font-medium text-slate-800">
                          <span className="block">
                            {template.format_label ?? 'Sin formato'}
                          </span>
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt>Campos</dt>
                        <dd className="font-medium text-slate-800">
                          {getTemplateFieldCount(template.content)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-slate-500" />
                      <p className="text-sm font-semibold text-slate-800">
                        Trazabilidad
                      </p>
                    </div>
                    <dl className="mt-4 space-y-3 text-sm text-slate-600">
                      <div className="flex items-center justify-between gap-4">
                        <dt>Creada</dt>
                        <dd className="font-medium text-slate-800">
                          {template.created_at
                            ? new Date(template.created_at).toLocaleString(
                                'es-PE',
                              )
                            : 'Sin fecha'}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt>Campos requeridos</dt>
                        <dd className="font-medium text-slate-800">
                          {requiredFieldsCount}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <dt>Líneas markdown</dt>
                        <dd className="font-medium text-slate-800">
                          {markdownLines}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </section>
              </div>
            )}

            {currentStep === 2 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Markdown de la plantilla
                </p>
                <pre className="mt-4 max-h-[56vh] overflow-y-auto whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {template.content.body_md}
                </pre>
              </section>
            )}

            {currentStep === 3 && (
              <div className="space-y-5">
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Layers3 className="h-4 w-4 text-slate-500" />
                    <p className="text-sm font-semibold text-slate-800">
                      Campos del contrato
                    </p>
                  </div>
                  {renderFieldTable(
                    contractFields,
                    'Esta plantilla no define campos visibles dentro del contrato.',
                  )}
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Layers3 className="h-4 w-4 text-slate-500" />
                    <p className="text-sm font-semibold text-slate-800">
                      Campos operativos
                    </p>
                  </div>
                  {renderFieldTable(
                    operationalFields,
                    'Esta plantilla no define campos operativos adicionales.',
                  )}
                </section>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={
              currentStep === 1
                ? onClose
                : () => setCurrentStep((currentStep - 1) as ViewStep)
            }
            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {currentStep === 1 ? 'Cerrar' : '← Anterior'}
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep + 1) as ViewStep)}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}