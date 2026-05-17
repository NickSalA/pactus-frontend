"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, FileText, Layers3, X } from "lucide-react";
import { updateTemplate } from "@/api/templates";
import {
  extractTemplateFieldKeys,
  formatTemplateFieldLabel,
  getAllTemplateFields,
  getTemplateOperationalFields,
  normalizeTemplateFieldType,
  TEMPLATE_FIELD_TYPE_LABELS,
} from "@/lib/template-fields";
import { getDocumentTypeLabel } from "@/lib/document.utils";
import type {
  Template,
  TemplateContent,
  TemplateField,
} from "@/types/api.types";
import { TemplateSummaryAccordion } from "./TemplateSummaryAccordion";
import { TemplateWizardProgress } from "./TemplateWizardProgress";

type TemplateEditModalProps = {
  template: Template | null;
  open: boolean;
  onClose: () => void;
  onSaved: (template: Template, message: string, warnings?: string[]) => void;
};

type EditStep = 1 | 2 | 3;
const STEPS = ["Datos base", "Contenido", "Campos"];

const EMPTY_CONTENT: TemplateContent = { body_md: "", fields: [], operational_fields: [], version: "1.0" };

const buildInitialState = (template: Template | null) => ({
  templateId: template?.id ?? null,
  name: template?.name ?? "",
  description: template?.description ?? "",
  documentType: template?.document_type ?? "LABOR",
  formatCode: template?.format_code ?? "",
  formatLabel: template?.format_label ?? "",
  content: template?.content ?? EMPTY_CONTENT,
  state: template?.state ?? "DRAFT",
});

const FIELDS_PAGE_SIZE = 12;

export function TemplateEditModal({ template, open, onClose, onSaved }: TemplateEditModalProps) {
  const [{ templateId, name, description, documentType, formatCode, formatLabel, content, state }, setEditorState] = useState(
    buildInitialState(template),
  );
  const [currentStep, setCurrentStep] = useState<EditStep>(1);
  const [maxStepReached, setMaxStepReached] = useState<EditStep>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [baseSummaryExpanded, setBaseSummaryExpanded] = useState(false);
  const [contentSummaryExpanded, setContentSummaryExpanded] = useState(false);
  const [fieldsPage, setFieldsPage] = useState(0);

  useEffect(() => {
    if (!open) return;
    setEditorState(buildInitialState(template));
    setCurrentStep(1);
    setMaxStepReached(1);
    setFormError(null);
    setBaseSummaryExpanded(false);
    setContentSummaryExpanded(false);
    setFieldsPage(0);
  }, [open, template]);

  const isReadonly = state !== "DRAFT";

  const detectedFieldKeys = useMemo(() => extractTemplateFieldKeys(content.body_md), [content.body_md]);
  const derivedFields = useMemo(() => {
    const existingMap = new Map(getAllTemplateFields(content).map((field) => [field.key, field]));
    return detectedFieldKeys.map((key) => {
      const existingField = existingMap.get(key);
      return existingField
        ? { ...existingField, type: normalizeTemplateFieldType(existingField.type) }
        : { key, label: formatTemplateFieldLabel(key), type: "text", required: false };
    });
  }, [content, detectedFieldKeys]);

  const visibleFieldKeys = useMemo(() => new Set(derivedFields.map((field) => field.key)), [derivedFields]);
  const operationalFields = useMemo(() => {
    return getTemplateOperationalFields(content).filter((field) => !visibleFieldKeys.has(field.key));
  }, [content, visibleFieldKeys]);

  const totalPages = Math.max(1, Math.ceil(derivedFields.length / FIELDS_PAGE_SIZE));
  const pagedFields = derivedFields.slice(fieldsPage * FIELDS_PAGE_SIZE, (fieldsPage + 1) * FIELDS_PAGE_SIZE);

  const markdownLines = useMemo(
    () => content.body_md.split(/\r?\n/).filter((l) => l.trim()).length,
    [content.body_md],
  );
  const requiredCount = [...derivedFields, ...operationalFields].filter((field) => field.required).length;

  if (!open || !template) return null;

  const setContent = (next: TemplateContent) =>
    setEditorState((prev) => ({ ...prev, content: next }));

  const validateStep = (step: EditStep): string | null => {
    if (step === 1 && !name.trim()) return "El nombre es obligatorio.";
    if (step === 2 && !content.body_md.trim()) return "El contenido no puede estar vacío.";
    return null;
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) { setFormError(error); return; }
    setFormError(null);
    if (currentStep < 3) {
      const next = (currentStep + 1) as EditStep;
      setCurrentStep(next);
      setMaxStepReached((prev) => (prev < next ? next : prev));
      setFieldsPage(0);
    }
  };

  const handlePrev = () => {
    setFormError(null);
    if (currentStep > 1) setCurrentStep((currentStep - 1) as EditStep);
  };

  const handleSave = async () => {
    const error = validateStep(1) ?? validateStep(2);
    if (error) { setFormError(error); return; }
    if (!templateId || isReadonly || isSaving) return;
    setFormError(null);
    setIsSaving(true);
    try {
      const visibleKeys = new Set(derivedFields.map((field) => field.key));
      const saved = await updateTemplate(templateId, {
        name: name.trim(),
        description: description.trim() || null,
        content: {
          ...content,
          body_md: content.body_md.trim(),
          version: content.version ?? "1.0",
          fields: derivedFields,
          operational_fields: getTemplateOperationalFields(content).filter((field) => !visibleKeys.has(field.key)),
        },
      });
      onSaved(saved, "Plantilla actualizada correctamente.");
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo guardar la plantilla.");
    } finally {
      setIsSaving(false);
    }
  };

  // Summary previews
  const basePreview = (
    <p className="mt-0.5 truncate text-sm text-slate-700">
      <span className="font-medium">{name.trim() || "Sin nombre"}</span>
      <span className="text-slate-400"> · {formatLabel || "Sin formato"}</span>
      {description.trim() && <span className="text-slate-400"> · {description.trim()}</span>}
    </p>
  );

  const contentPreview = (
    <p className="mt-0.5 text-sm text-slate-700">
      <span className="font-medium">{markdownLines}</span>
      <span className="text-slate-400"> línea{markdownLines === 1 ? "" : "s"} · {content.body_md.length} caracteres</span>
    </p>
  );

  const renderFieldTable = (fields: TemplateField[], emptyMessage: string) => {
    if (fields.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              {["Variable", "Etiqueta", "Tipo", "Placeholder", "Requerido"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {fields.map((field) => (
              <tr key={field.key} className="hover:bg-slate-50/60">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  {`{{${field.key}}}`}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{field.label}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {TEMPLATE_FIELD_TYPE_LABELS[normalizeTemplateFieldType(field.type)]}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{field.placeholder?.trim() || "-"}</td>
                <td className="px-4 py-3">
                  {field.required ? (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                      Sí
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                      No
                    </span>
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
      onClick={() => { if (!isSaving) onClose(); }}
    >
      <div
        className="relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Editar plantilla</h3>
              <p className="mt-1 text-sm text-slate-500">
                Organiza la edición paso a paso para validar antes de guardar.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            <TemplateWizardProgress
              currentStep={currentStep}
              maxStepReached={maxStepReached}
              onStepClick={(step) => {
                if (step <= maxStepReached) {
                  setCurrentStep(step as EditStep);
                  setFormError(null);
                }
              }}
              steps={STEPS}
            />

            {isReadonly && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                Esta plantilla está publicada y no puede editarse. Solo las plantillas en estado <strong className="mx-1">Borrador</strong> son modificables.
              </div>
            )}

            {formError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            {/* Summary accordions */}
            {currentStep >= 2 && (
              <TemplateSummaryAccordion
                expanded={baseSummaryExpanded}
                onToggle={() => setBaseSummaryExpanded((p) => !p)}
                preview={basePreview}
                title="Datos base"
              >
                <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-4 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-800">Nombre:</span> {name || "Sin nombre"}</p>
                  <p className="mt-2"><span className="font-medium text-slate-800">Tipo documental:</span> {getDocumentTypeLabel(documentType)}</p>
                  <p className="mt-2"><span className="font-medium text-slate-800">Formato:</span> {formatLabel || "Sin formato"}</p>
                  {description && <p className="mt-2"><span className="font-medium text-slate-800">Descripción:</span> {description}</p>}
                </div>
              </TemplateSummaryAccordion>
            )}

            {currentStep >= 3 && (
              <TemplateSummaryAccordion
                expanded={contentSummaryExpanded}
                onToggle={() => setContentSummaryExpanded((p) => !p)}
                preview={contentPreview}
                title="Contenido"
              >
                <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-4">
                  <pre className="max-h-52 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {content.body_md || "Sin contenido todavía."}
                  </pre>
                </div>
              </TemplateSummaryAccordion>
            )}

            {/* Step 1 — Datos base */}
            {currentStep === 1 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Datos base</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Información esencial para identificar la plantilla.
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">
                      Nombre <span className="text-red-500">*</span>
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setEditorState((prev) => ({ ...prev, name: e.target.value }))}
                      disabled={isReadonly}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>

                  <div className="space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Tipo documental</span>
                    <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                        {getDocumentTypeLabel(documentType)}
                      </span>
                    </div>
                  </div>

                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Descripción</span>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setEditorState((prev) => ({ ...prev, description: e.target.value }))}
                      disabled={isReadonly}
                      placeholder="Descripción opcional"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>

                  <div className="space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Formato</span>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm font-medium text-slate-800">
                      {formatLabel || "Sin formato"}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Step 2 — Contenido */}
            {currentStep === 2 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Contenido de la plantilla</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Edita el cuerpo en Markdown. Los campos se detectan automáticamente en el siguiente paso.
                    </p>
                  </div>
                </div>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    Markdown <span className="text-red-500">*</span>
                  </span>
                  <textarea
                    value={content.body_md}
                    onChange={(e) => setContent({ ...content, body_md: e.target.value })}
                    rows={20}
                    disabled={isReadonly}
                    placeholder="Usa placeholders como {{ trabajador_nombre }} para los campos del formulario."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-4 font-mono text-sm leading-6 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>
              </section>
            )}

            {/* Step 3 — Campos */}
            {currentStep === 3 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                          <Layers3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">Campos del formulario</h4>
                      <p className="mt-1 text-sm text-slate-500">
                        Campos detectados automáticamente a partir del contenido de la plantilla.
                      </p>
                    </div>
                      </div>
                      {(derivedFields.length > 0 || operationalFields.length > 0) && (
                        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {derivedFields.length + operationalFields.length} campo{derivedFields.length + operationalFields.length === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>

                    <div className="space-y-5">
                      <div>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-800">Campos del contrato</p>
                          {derivedFields.length > 0 && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              {derivedFields.length}
                            </span>
                          )}
                        </div>

                        {renderFieldTable(pagedFields, "No se detectaron campos visibles en el contenido de esta plantilla.")}

                        {derivedFields.length > 0 && totalPages > 1 && (
                          <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                            <span>
                              Mostrando {fieldsPage * FIELDS_PAGE_SIZE + 1}–{Math.min((fieldsPage + 1) * FIELDS_PAGE_SIZE, derivedFields.length)} de {derivedFields.length}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setFieldsPage((p) => p - 1)}
                                disabled={fieldsPage === 0}
                                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                ← Anterior
                              </button>
                              <span className="px-2 text-xs">
                                {fieldsPage + 1} / {totalPages}
                              </span>
                              <button
                                type="button"
                                onClick={() => setFieldsPage((p) => p + 1)}
                                disabled={fieldsPage >= totalPages - 1}
                                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Siguiente →
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-800">Campos operativos</p>
                          {operationalFields.length > 0 && (
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                              {operationalFields.length}
                            </span>
                          )}
                        </div>

                        {renderFieldTable(operationalFields, "No se definieron campos operativos adicionales en esta plantilla.")}
                      </div>
                    </div>
                  </section>
                )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : handlePrev}
            disabled={isSaving}
            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {currentStep === 1 ? "Cancelar" : "← Anterior"}
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { void handleSave(); }}
              disabled={isReadonly || isSaving}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
