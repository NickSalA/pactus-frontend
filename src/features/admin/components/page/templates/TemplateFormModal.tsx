"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { generateTemplateDraft } from "@/lib/api/templates";
import { getDocumentTypeLabel } from "@/lib/document.utils";
import { Select } from "@/components/ui/Select";
import type {
  DocumentType,
  TemplateGenerationMode,
  Template,
  TemplateFormatResponse,
} from "@/types/api.types";
import { TemplateSummaryAccordion } from "./TemplateSummaryAccordion";
import { TemplateWizardProgress } from "./TemplateWizardProgress";

type TemplateFormStep = 1 | 2 | 3;

const WIZARD_STEPS = ["Formato", "Detalles", "Generar borrador"];

type TemplateFormModalProps = {
  allowedDocumentTypes: readonly DocumentType[] | null;
  formats: TemplateFormatResponse[];
  open: boolean;
  onClose: () => void;
  onSaved: (template: Template, message: string, warnings?: string[]) => void;
};

const isPdfFile = (file: File): boolean => {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
};

export function TemplateFormModal({ allowedDocumentTypes, formats, open, onClose, onSaved }: TemplateFormModalProps) {
  // Step 1 state
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null);
  const [selectedFormatCode, setSelectedFormatCode] = useState("");

  // Step 2 state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Step 3 state
  const [instructions, setInstructions] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [generationMode, setGenerationMode] = useState<TemplateGenerationMode>("adaptive");
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Wizard state
  const [currentStep, setCurrentStep] = useState<TemplateFormStep>(1);
  const [maxStepReached, setMaxStepReached] = useState<TemplateFormStep>(1);
  const [visible, setVisible] = useState(true);
  const [stepError, setStepError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Summary accordion state
  const [summary1Expanded, setSummary1Expanded] = useState(false);
  const [summary2Expanded, setSummary2Expanded] = useState(false);

  const visibleFormats = useMemo(() => {
    return formats.filter((format) => !selectedDocumentType || format.document_type === selectedDocumentType);
  }, [formats, selectedDocumentType]);

  const selectedFormat = useMemo(() => {
    return formats.find((format) => format.format_code === selectedFormatCode) ?? null;
  }, [formats, selectedFormatCode]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const initialDocumentType = allowedDocumentTypes?.[0] ?? formats[0]?.document_type ?? null;
    const initialFormat = formats.find((format) => format.document_type === initialDocumentType) ?? formats[0] ?? null;

    setSelectedDocumentType(initialDocumentType);
    setSelectedFormatCode(initialFormat?.format_code ?? "");
    setName(initialFormat?.default_name ?? "");
    setDescription(initialFormat?.default_description ?? "");
    setInstructions("");
    setJurisdiction("");
    setGenerationMode("adaptive");
    setReferenceFile(null);
    setDragActive(false);
    setCurrentStep(1);
    setMaxStepReached(1);
    setVisible(true);
    setStepError(null);
    setSummary1Expanded(false);
    setSummary2Expanded(false);
  }, [allowedDocumentTypes, formats, open]);

  useEffect(() => {
    if (!selectedDocumentType || !selectedFormat || selectedFormat.document_type === selectedDocumentType) {
      return;
    }

    const nextFormat = formats.find((format) => format.document_type === selectedDocumentType) ?? null;
    setSelectedFormatCode(nextFormat?.format_code ?? "");
    setName(nextFormat?.default_name ?? "");
    setDescription(nextFormat?.default_description ?? "");
  }, [formats, selectedDocumentType, selectedFormat]);

  if (!open) {
    return null;
  }

  const navigateToStep = (step: TemplateFormStep) => {
    setVisible(false);
    window.setTimeout(() => {
      setCurrentStep(step);
      setStepError(null);
      setSummary1Expanded(false);
      setSummary2Expanded(false);
      setMaxStepReached((previous) => (step > previous ? step : previous) as TemplateFormStep);
      setVisible(true);
    }, 150);
  };

  const handleSelectFormat = (formatCode: string) => {
    const nextFormat = formats.find((format) => format.format_code === formatCode) ?? null;
    setSelectedFormatCode(formatCode);
    if (nextFormat) {
      setSelectedDocumentType(nextFormat.document_type);
      setName(nextFormat.default_name);
      setDescription(nextFormat.default_description ?? "");
    }
  };

  const handleReferenceFile = (file: File | null) => {
    if (!file) {
      setReferenceFile(null);
      return;
    }

    if (!isPdfFile(file)) {
      setStepError("Solo se admite PDF como archivo de referencia.");
      return;
    }

    setStepError(null);
    setReferenceFile(file);
  };

  const validateStep1 = (): string | null => {
    if (!selectedFormat) {
      return "Debes seleccionar un formato.";
    }
    return null;
  };

  const goNext = () => {
    if (currentStep === 1) {
      const error = validateStep1();
      if (error) {
        setStepError(error);
        return;
      }
      navigateToStep(2);
      return;
    }

    if (currentStep === 2) {
      navigateToStep(3);
    }
  };

  const goPrev = () => {
    navigateToStep((currentStep - 1) as TemplateFormStep);
  };

  const handleSubmit = async () => {
    if (!selectedFormat) {
      setStepError("Debes seleccionar un formato.");
      return;
    }

    setIsSubmitting(true);
    setStepError(null);

    try {
      const normalizedName = name.trim() || null;
      const normalizedDescription = description.trim() || null;
      const requestDocumentType = (allowedDocumentTypes?.length ?? 0) !== 1 ? selectedFormat.document_type : null;

      const response = await generateTemplateDraft(
        {
          description: normalizedDescription,
          document_type: requestDocumentType,
          format_code: selectedFormat.format_code,
          generation_mode: generationMode,
          instructions: instructions.trim() || null,
          jurisdiction: jurisdiction.trim() || null,
          name: normalizedName,
        },
        referenceFile,
      );

      const message = response.warnings.length > 0
        ? `Borrador generado con ${response.warnings.length} advertencia(s).`
        : "Borrador generado correctamente.";

      onSaved(response.template, message, response.warnings);
      onClose();
    } catch (error) {
      setStepError(error instanceof Error ? error.message : "No se pudo completar la creación de la plantilla.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Summary previews
  const step1Preview = selectedFormat ? (
    <p className="mt-0.5 truncate text-sm text-slate-700">
      <span className="font-medium">{selectedFormat.label}</span>
      <span className="text-slate-400"> · {getDocumentTypeLabel(selectedFormat.document_type)}</span>
    </p>
  ) : null;

  const step2Preview = (
    <p className="mt-0.5 truncate text-sm text-slate-700">
      <span className="font-medium">{name || "-"}</span>
      {description && <span className="text-slate-400"> · {description}</span>}
    </p>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Nueva plantilla</h3>
              <p className="mt-1 text-sm text-slate-500">
                Completa los pasos para generar un borrador de plantilla.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard progress */}
        <div className="border-b border-slate-100 px-6 pt-5 pb-4">
          <TemplateWizardProgress
            currentStep={currentStep}
            maxStepReached={maxStepReached}
            onStepClick={(step) => navigateToStep(step as TemplateFormStep)}
            steps={WIZARD_STEPS}
          />
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div
            className={`space-y-5 transition-opacity duration-150 ${visible ? "opacity-100" : "opacity-0"}`}
          >
            {stepError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {stepError}
              </div>
            )}

            {formats.length === 0 ? (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                No hay formatos disponibles para tu rol.
              </div>
            ) : (
              <>
                {/* ── STEP 1: Formato ── */}
                {currentStep === 1 && (
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 className="text-base font-semibold text-slate-900">Selecciona el tipo de documento</h4>
                        <p className="mt-1 text-sm text-slate-500">
                          Elige el formato que mejor se adapte a tu plantilla.
                        </p>
                      </div>
                      {(allowedDocumentTypes?.length ?? 0) !== 1 ? (
                        <Select
                          variant="lg"
                          value={selectedDocumentType ?? ""}
                          onChange={(event) => setSelectedDocumentType(event.target.value as DocumentType)}
                        >
                          {(allowedDocumentTypes ?? ["LABOR", "COMPANY"]).map((documentType) => (
                            <option key={documentType} value={documentType}>
                              {getDocumentTypeLabel(documentType)}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                          {getDocumentTypeLabel(selectedDocumentType ?? allowedDocumentTypes?.[0] ?? "COMPANY")}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {visibleFormats.map((format) => {
                        const isSelected = selectedFormatCode === format.format_code;

                        return (
                          <button
                            key={format.id}
                            type="button"
                            onClick={() => handleSelectFormat(format.format_code)}
                            className={`rounded-3xl border p-5 text-left transition ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p className="font-semibold text-slate-900">{format.label}</p>
                              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                {getDocumentTypeLabel(format.document_type)}
                              </span>
                            </div>
                            <p className="mt-4 text-sm text-slate-600">
                              {format.default_description ?? "Sin descripción por defecto."}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* ── STEP 2: Detalles ── */}
                {currentStep === 2 && (
                  <>
                    {/* Summary of Step 1 */}
                    <TemplateSummaryAccordion
                      expanded={summary1Expanded}
                      onToggle={() => setSummary1Expanded((previous) => !previous)}
                      preview={step1Preview}
                      title="Formato seleccionado"
                    >
                      <div className="border-t border-slate-200 bg-white px-4 py-4">
                        {selectedFormat && (
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">{selectedFormat.label}</p>
                              {selectedFormat.default_description && (
                                <p className="mt-2 text-sm text-slate-600">{selectedFormat.default_description}</p>
                              )}
                            </div>
                            <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700">
                              {getDocumentTypeLabel(selectedFormat.document_type)}
                            </span>
                          </div>
                        )}
                      </div>
                    </TemplateSummaryAccordion>

                    {/* Step 2 fields */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="mb-5">
                        <h4 className="text-base font-semibold text-slate-900">Datos de la plantilla</h4>
                        <p className="mt-1 text-sm text-slate-500">
                          Puedes personalizar el nombre y la descripción antes de continuar.
                        </p>
                      </div>

                      <div className="grid gap-4">
                        <label className="space-y-1.5">
                          <span className="text-sm font-medium text-slate-700">Nombre</span>
                          <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder={selectedFormat?.default_name ?? "Nombre de la plantilla"}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                          />
                        </label>

                        <label className="space-y-1.5">
                          <span className="text-sm font-medium text-slate-700">Descripción</span>
                          <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            rows={3}
                            placeholder={selectedFormat?.default_description ?? "Descripción opcional"}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                          />
                        </label>
                      </div>
                    </section>
                  </>
                )}

                {/* ── STEP 3: Generar borrador ── */}
                {currentStep === 3 && (
                  <>
                    {/* Summary of Step 1 */}
                    <TemplateSummaryAccordion
                      expanded={summary1Expanded}
                      onToggle={() => setSummary1Expanded((previous) => !previous)}
                      preview={step1Preview}
                      title="Formato seleccionado"
                    >
                      <div className="border-t border-slate-200 bg-white px-4 py-4">
                        {selectedFormat && (
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">{selectedFormat.label}</p>
                              {selectedFormat.default_description && (
                                <p className="mt-2 text-sm text-slate-600">{selectedFormat.default_description}</p>
                              )}
                            </div>
                            <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700">
                              {getDocumentTypeLabel(selectedFormat.document_type)}
                            </span>
                          </div>
                        )}
                      </div>
                    </TemplateSummaryAccordion>

                    {/* Summary of Step 2 */}
                    <TemplateSummaryAccordion
                      expanded={summary2Expanded}
                      onToggle={() => setSummary2Expanded((previous) => !previous)}
                      preview={step2Preview}
                      title="Datos de la plantilla"
                    >
                      <div className="border-t border-slate-200 bg-white px-4 py-4 space-y-3">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Nombre</p>
                          <p className="mt-0.5 text-sm text-slate-800">{name || <span className="text-slate-400">Sin nombre</span>}</p>
                        </div>
                        {description && (
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Descripción</p>
                            <p className="mt-0.5 text-sm text-slate-800">{description}</p>
                          </div>
                        )}
                      </div>
                    </TemplateSummaryAccordion>

                    {/* Step 3 fields */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="mb-5">
                        <h4 className="text-base font-semibold text-slate-900">Instrucciones para el borrador</h4>
                        <p className="mt-1 text-sm text-slate-500">
                          Puedes usar instrucciones de texto, un PDF de referencia, o ambos para mejorar el resultado.
                        </p>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                            <div className="mb-4">
                              <h5 className="text-sm font-semibold text-slate-900">Modo de generación</h5>
                              <p className="mt-1 text-xs text-slate-500">
                                Controla qué tan literal será el borrador respecto a la referencia entregada.
                              </p>
                            </div>

                            <div>
                              <label className="space-y-1.5">
                                <span className="text-sm font-medium text-slate-700">Generación</span>
                                <Select
                                  variant="lg"
                                  className="w-full"
                                  value={generationMode}
                                  onChange={(event) => setGenerationMode(event.target.value as TemplateGenerationMode)}
                                >
                                  <option value="adaptive">Adaptativa</option>
                                  <option value="strict">Estricta</option>
                                </Select>
                              </label>
                            </div>
                          </div>

                          <label className="space-y-1.5">
                            <span className="text-sm font-medium text-slate-700">Instrucciones</span>
                            <textarea
                              value={instructions}
                              onChange={(event) => setInstructions(event.target.value)}
                              rows={6}
                              placeholder="Preservar estructura, convertir variables a placeholders y mantener el tono legal esperado."
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                            />
                          </label>

                          <label className="space-y-1.5">
                            <span className="text-sm font-medium text-slate-700">Jurisdicción</span>
                            <input
                              type="text"
                              value={jurisdiction}
                              onChange={(event) => setJurisdiction(event.target.value)}
                              placeholder="Ej: PE, Lima, Perú"
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                            />
                          </label>
                        </div>

                        <div className="flex h-full flex-col">
                          <div
                            onDragEnter={(event) => {
                              event.preventDefault();
                              setDragActive(true);
                            }}
                            onDragOver={(event) => {
                              event.preventDefault();
                              setDragActive(true);
                            }}
                            onDragLeave={(event) => {
                              event.preventDefault();
                              setDragActive(false);
                            }}
                            onDrop={(event) => {
                              event.preventDefault();
                              setDragActive(false);
                              handleReferenceFile(event.dataTransfer.files?.[0] ?? null);
                            }}
                            className={`flex h-full flex-col items-center justify-center rounded-3xl border-2 border-dashed px-5 py-8 text-center transition ${
                              dragActive
                                ? "border-blue-500 bg-blue-50"
                                : referenceFile
                                  ? "border-emerald-300 bg-emerald-50/60"
                                  : "border-slate-300 bg-slate-50/60 hover:border-blue-300 hover:bg-blue-50/40"
                            }`}
                          >
                            {referenceFile ? (
                              <div className="space-y-3">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">{referenceFile.name}</p>
                                  <p className="mt-1 text-xs text-slate-500">{(referenceFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleReferenceFile(null)}
                                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                  Quitar PDF
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
                                  <Upload className="h-5 w-5" />
                                </div>
                                <p className="mt-4 text-sm font-medium text-slate-700">PDF de referencia (opcional)</p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Arrastra un archivo aquí o usa el botón para seleccionarlo.
                                </p>
                                <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
                                  <Upload className="h-4 w-4" />
                                  Seleccionar PDF
                                  <input
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    className="hidden"
                                    onChange={(event) => {
                                      handleReferenceFile(event.target.files?.[0] ?? null);
                                      event.target.value = "";
                                    }}
                                  />
                                </label>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : goPrev}
            disabled={isSubmitting}
            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {currentStep === 1 ? "Cancelar" : "← Anterior"}
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={formats.length === 0}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                void handleSubmit();
              }}
              disabled={isSubmitting || formats.length === 0}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
            >
              {isSubmitting ? "Generando..." : "Generar borrador"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
