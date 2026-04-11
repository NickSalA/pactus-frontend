"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Eye, FileText, Layers3, X } from "lucide-react";
import { previewTemplate, updateTemplate } from "@/lib/api/templates";
import type {
  Template,
  TemplateContent,
  TemplatePreviewResponse,
} from "@/types/api.types";
import { TemplateSummaryAccordion } from "./TemplateSummaryAccordion";
import { TemplateWizardProgress } from "./TemplateWizardProgress";

type TemplateEditModalProps = {
  template: Template | null;
  open: boolean;
  onClose: () => void;
  onSaved: (template: Template, message: string) => void;
};

type EditStep = 1 | 2 | 3 | 4;
const STEPS = ["Datos base", "Contenido", "Campos", "Validación"];

const FIELD_TYPE_LABELS: Record<string, string> = {
  text: "Texto",
  number: "Número",
  date: "Fecha",
  boolean: "Sí / No",
};

const EMPTY_CONTENT: TemplateContent = { body_md: "", fields: [], version: "1.0" };

function extractFieldKeys(bodyMd: string): string[] {
  return [...new Set([...bodyMd.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]))];
}

const buildInitialState = (template: Template | null) => ({
  templateId: template?.id ?? null,
  name: template?.name ?? "",
  description: template?.description ?? "",
  content: template?.content ?? EMPTY_CONTENT,
  state: template?.state ?? "DRAFT",
});

export function TemplateEditModal({ template, open, onClose, onSaved }: TemplateEditModalProps) {
  const [{ templateId, name, description, content, state }, setEditorState] = useState(
    buildInitialState(template),
  );
  const [currentStep, setCurrentStep] = useState<EditStep>(1);
  const [maxStepReached, setMaxStepReached] = useState<EditStep>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewResult, setPreviewResult] = useState<TemplatePreviewResponse | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [baseSummaryExpanded, setBaseSummaryExpanded] = useState(false);
  const [contentSummaryExpanded, setContentSummaryExpanded] = useState(false);
  const [fieldsSummaryExpanded, setFieldsSummaryExpanded] = useState(false);

  useEffect(() => {
    if (!open) return;
    setEditorState(buildInitialState(template));
    setCurrentStep(1);
    setMaxStepReached(1);
    setFormError(null);
    setPreviewError(null);
    setPreviewResult(null);
    setBaseSummaryExpanded(false);
    setContentSummaryExpanded(false);
    setFieldsSummaryExpanded(false);
  }, [open, template]);

  const isReadonly = state !== "DRAFT";

  // Campos derivados del markdown en tiempo real
  const detectedFieldKeys = useMemo(() => extractFieldKeys(content.body_md), [content.body_md]);
  const derivedFields = useMemo(() => {
    const existingMap = new Map(content.fields.map((f) => [f.key, f]));
    return detectedFieldKeys.map(
      (key) => existingMap.get(key) ?? { key, label: key, type: "text", required: false },
    );
  }, [detectedFieldKeys, content.fields]);

  const markdownLines = useMemo(
    () => content.body_md.split(/\r?\n/).filter((l) => l.trim()).length,
    [content.body_md],
  );
  const requiredCount = derivedFields.filter((f) => f.required).length;

  if (!open || !template) return null;

  const setContent = (next: TemplateContent) =>
    setEditorState((prev) => ({ ...prev, content: next }));

  const validateStep = (step: EditStep): string | null => {
    if (step === 1 && !name.trim()) return "El nombre es obligatorio.";
    if (step === 2 && !content.body_md.trim()) return "El contenido no puede estar vacío.";
    if (step === 4) {
      if (!name.trim()) return "El nombre es obligatorio.";
      if (!content.body_md.trim()) return "El contenido no puede estar vacío.";
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) { setFormError(error); return; }
    setFormError(null);
    setPreviewError(null);
    if (currentStep < 4) {
      const next = (currentStep + 1) as EditStep;
      setCurrentStep(next);
      setMaxStepReached((prev) => (prev < next ? next : prev));
    }
  };

  const handlePrev = () => {
    setFormError(null);
    setPreviewError(null);
    if (currentStep > 1) setCurrentStep((currentStep - 1) as EditStep);
  };

  const handlePreview = async () => {
    const error = validateStep(4);
    if (error) { setPreviewError(error); setPreviewResult(null); return; }
    setPreviewError(null);
    setIsPreviewing(true);
    try {
      const result = await previewTemplate({
        content: { ...content, body_md: content.body_md.trim(), fields: derivedFields },
      });
      setPreviewResult(result);
    } catch (err) {
      setPreviewResult(null);
      setPreviewError(err instanceof Error ? err.message : "No se pudo generar la vista previa.");
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleSave = async () => {
    const error = validateStep(4);
    if (error) { setFormError(error); return; }
    if (!templateId || isReadonly || isSaving) return;
    setFormError(null);
    setIsSaving(true);
    try {
      const saved = await updateTemplate(templateId, {
        name: name.trim(),
        description: description.trim() || null,
        content: {
          ...content,
          body_md: content.body_md.trim(),
          version: content.version ?? "1.0",
          fields: derivedFields,
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

  const basePreview = (
    <p className="mt-0.5 truncate text-sm text-slate-700">
      <span className="font-medium">{name.trim() || "Sin nombre"}</span>
      <span className="text-slate-400"> · {description.trim() || "Sin descripción"}</span>
    </p>
  );

  const contentPreview = (
    <p className="mt-0.5 text-sm text-slate-700">
      <span className="font-medium">{markdownLines}</span>
      <span className="text-slate-400"> línea{markdownLines === 1 ? "" : "s"} · {content.body_md.length} caracteres</span>
    </p>
  );

  const fieldsPreview = (
    <p className="mt-0.5 text-sm text-slate-700">
      <span className="font-medium">{derivedFields.length}</span>
      <span className="text-slate-400"> campo{derivedFields.length === 1 ? "" : "s"} · {requiredCount} requerido{requiredCount === 1 ? "" : "s"}</span>
    </p>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => { if (!isSaving && !isPreviewing) onClose(); }}
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
            disabled={isSaving || isPreviewing}
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
                  setPreviewError(null);
                }
              }}
              steps={STEPS}
            />

            {isReadonly && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                Esta plantilla está en estado <strong className="mx-1">{state}</strong>. Solo se pueden editar plantillas en estado <strong>DRAFT</strong>.
              </div>
            )}

            {(formError || previewError) && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError ?? previewError}
              </div>
            )}

            {/* Accordions de pasos anteriores */}
            {currentStep >= 2 && (
              <TemplateSummaryAccordion
                expanded={baseSummaryExpanded}
                onToggle={() => setBaseSummaryExpanded((p) => !p)}
                preview={basePreview}
                title="Datos base"
              >
                <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-4 text-sm text-slate-600">
                  <p><span className="font-medium text-slate-800">Nombre:</span> {name || "Sin nombre"}</p>
                  <p className="mt-2"><span className="font-medium text-slate-800">Descripción:</span> {description || "Sin descripción"}</p>
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

            {currentStep >= 4 && (
              <TemplateSummaryAccordion
                expanded={fieldsSummaryExpanded}
                onToggle={() => setFieldsSummaryExpanded((p) => !p)}
                preview={fieldsPreview}
                title="Campos"
              >
                <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-4">
                  {derivedFields.length === 0 ? (
                    <p className="text-sm text-slate-500">No hay campos detectados.</p>
                  ) : (
                    <div className="space-y-2">
                      {derivedFields.map((field) => (
                        <div
                          key={field.key}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        >
                          <div>
                            <p className="font-medium text-slate-800">{field.label}</p>
                            <p className="font-mono text-xs text-slate-500">{`{{${field.key}}}`}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-700">
                              {FIELD_TYPE_LABELS[field.type] ?? field.type}
                            </span>
                            {field.required && (
                              <span className="rounded-full bg-red-100 px-2 py-1 font-medium text-red-700">Requerido</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                      Empieza por la información esencial para identificar la plantilla.
                    </p>
                  </div>
                </div>
                <div className="grid gap-4">
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">
                      Nombre de la plantilla <span className="text-red-500">*</span>
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setEditorState((prev) => ({ ...prev, name: e.target.value }))}
                      disabled={isReadonly}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Descripción</span>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setEditorState((prev) => ({ ...prev, description: e.target.value }))}
                      disabled={isReadonly}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>
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
                      Mantén el foco en el markdown. El resto del contexto queda resumido arriba.
                    </p>
                  </div>
                </div>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    Markdown de la plantilla <span className="text-red-500">*</span>
                  </span>
                  <textarea
                    value={content.body_md}
                    onChange={(e) => setContent({ ...content, body_md: e.target.value })}
                    rows={20}
                    disabled={isReadonly}
                    placeholder={"Usa placeholders como {{ trabajador_nombre }} o variables automáticas del backend."}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-4 font-mono text-sm leading-6 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>
              </section>
            )}

            {/* Step 3 — Campos (solo lectura, auto-detectados del markdown) */}
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
                        Detectados automáticamente del contenido de la plantilla.
                      </p>
                    </div>
                  </div>
                </div>

                {derivedFields.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    Esta plantilla no tiene campos detectados todavía.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50">
                          {["Clave", "Etiqueta", "Tipo", "Requerido"].map((h) => (
                            <th
                              key={h}
                              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {derivedFields.map((field) => (
                          <tr key={field.key} className="hover:bg-slate-50/60">
                            <td className="px-4 py-3 font-mono text-xs text-slate-700">{field.key}</td>
                            <td className="px-4 py-3 font-medium text-slate-800">{field.label}</td>
                            <td className="px-4 py-3 text-slate-600">
                              {FIELD_TYPE_LABELS[field.type] ?? field.type}
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
                )}
              </section>
            )}

            {/* Step 4 — Validación */}
            {currentStep === 4 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Validación visual</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Revisa el resumen anterior y genera una preview antes de guardar si necesitas validar el render.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { void handlePreview(); }}
                  disabled={isPreviewing || isSaving || isReadonly}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPreviewing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-blue-700" />
                      Generando preview...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Probar preview
                    </>
                  )}
                </button>

                {previewResult ? (
                  <div className="mt-5 space-y-4">
                    {previewResult.warnings.length > 0 && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        {previewResult.warnings.map((w) => (
                          <p key={w}>• {w}</p>
                        ))}
                      </div>
                    )}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Markdown renderizado
                      </p>
                      <pre className="mt-3 max-h-[340px] overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {previewResult.markdown}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
                    La preview aparece aquí para que no tengas que volver a revisar toda la plantilla de arriba abajo.
                  </div>
                )}
              </section>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : handlePrev}
            disabled={isSaving || isPreviewing}
            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {currentStep === 1 ? "Cancelar" : "← Anterior"}
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isReadonly}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { void handleSave(); }}
              disabled={isReadonly || isSaving || isPreviewing}
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
