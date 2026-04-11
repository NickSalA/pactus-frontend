"use client";

import { useEffect, useState } from "react";
import { FileText, Sparkles, Upload, X } from "lucide-react";
import { generateTemplateDraft } from "@/lib/api/templates";
import type { GenerateTemplateDraftRequest, Template } from "@/types/api.types";

type TemplateFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: (template: Template, message: string) => void;
};

type DraftFormState = {
  name: string;
  description: string;
  instructions: string;
  contractType: string;
  jurisdiction: string;
};

const buildDraftRequest = (draft: DraftFormState): GenerateTemplateDraftRequest => ({
  name: draft.name,
  description: draft.description,
  instructions: draft.instructions,
  contract_type: draft.contractType,
  jurisdiction: draft.jurisdiction,
});

const hasDraftFieldInput = (draft: DraftFormState): boolean =>
  [draft.name, draft.description, draft.instructions, draft.contractType, draft.jurisdiction].some(
    (v) => v.trim().length > 0,
  );

const isPdfFile = (file: File): boolean =>
  file.type === "application/pdf" || /\.pdf$/i.test(file.name);

export function TemplateFormModal({ open, onClose, onSaved }: TemplateFormModalProps) {
  const [draftForm, setDraftForm] = useState<DraftFormState>({
    name: "",
    description: "",
    instructions: "",
    contractType: "",
    jurisdiction: "",
  });
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDraftForm({ name: "", description: "", instructions: "", contractType: "", jurisdiction: "" });
    setReferenceFile(null);
    setDragActive(false);
    setFormError(null);
  }, [open]);

  if (!open) return null;

  const canGenerateDraft = hasDraftFieldInput(draftForm) || referenceFile !== null;

  const handleReferenceFile = (file: File | null) => {
    if (!file) { setReferenceFile(null); return; }
    if (!isPdfFile(file)) { setFormError("Solo se admite PDF como archivo de referencia."); return; }
    setFormError(null);
    setReferenceFile(file);
  };

  const handleGenerateDraft = async () => {
    setFormError(null);
    if (!canGenerateDraft) {
      setFormError("Debes completar al menos los campos del formulario o subir un PDF.");
      return;
    }
    setIsDrafting(true);
    try {
      const response = await generateTemplateDraft(buildDraftRequest(draftForm), referenceFile);
      const message =
        response.warnings.length > 0
          ? `Borrador generado con ${response.warnings.length} advertencia(s).`
          : "Borrador generado correctamente.";
      onSaved(response.template, message);
      onClose();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "No se pudo generar el borrador.");
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => { if (!isDrafting) onClose(); }}
    >
      <div
        className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
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
                Puedes crearla manualmente o generar un borrador desde formulario, PDF o ambas opciones.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDrafting}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-6">
          {/* Info banner */}
          <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white p-2 text-indigo-600 shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">Generación asistida por backend</p>
                <p className="mt-1 text-sm text-slate-600">
                  El formulario y el PDF son opcionales por separado. Si usas ambos, el borrador suele salir con mejor estructura y precisión.
                </p>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                Mejor precisión con ambas opciones
              </span>
            </div>
          </section>

          {formError && (
            <section className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </section>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left: form fields */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-semibold text-slate-800">Sección 1: Campos del formulario</h4>
                  <p className="mt-1 text-sm text-slate-500">Todos los campos son opcionales.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Opcional
                </span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Nombre sugerido</span>
                  <input
                    type="text"
                    value={draftForm.name}
                    onChange={(e) => setDraftForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Ej: Contrato de prestación de servicios"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Tipo de contrato</span>
                  <input
                    type="text"
                    value={draftForm.contractType}
                    onChange={(e) => setDraftForm((p) => ({ ...p, contractType: e.target.value }))}
                    placeholder="Ej: Laboral, comercial, servicios"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Descripción</span>
                  <input
                    type="text"
                    value={draftForm.description}
                    onChange={(e) => setDraftForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Breve contexto de uso de la plantilla"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Jurisdicción</span>
                  <input
                    type="text"
                    value={draftForm.jurisdiction}
                    onChange={(e) => setDraftForm((p) => ({ ...p, jurisdiction: e.target.value }))}
                    placeholder="Ej: Perú, Lima"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Instrucciones</span>
                  <textarea
                    value={draftForm.instructions}
                    onChange={(e) => setDraftForm((p) => ({ ...p, instructions: e.target.value }))}
                    rows={5}
                    placeholder="Describe cláusulas clave, tono legal, estructura esperada o restricciones del borrador."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </label>
              </div>
            </section>

            {/* Right: PDF upload */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-700">PDF de referencia</p>
              <p className="mt-1 text-sm text-slate-500">
                Sube un PDF opcional para preservar la estructura de un contrato base.
              </p>

              <div
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  handleReferenceFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className={`mt-5 rounded-3xl border-2 border-dashed px-5 py-8 text-center transition ${
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
                    <p className="mt-4 text-sm font-medium text-slate-700">Seleccionar PDF</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Sólo PDF. Si lo combinas con el formulario, el borrador mejora.
                    </p>
                    <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
                      <Upload className="h-4 w-4" />
                      Seleccionar PDF
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          handleReferenceFile(e.target.files?.[0] ?? null);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => { void handleGenerateDraft(); }}
                disabled={!canGenerateDraft || isDrafting}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
              >
                {isDrafting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generando borrador...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generar borrador
                  </>
                )}
              </button>

              {!canGenerateDraft && (
                <p className="mt-3 text-sm text-red-600">
                  Debes completar al menos los campos del formulario o subir un PDF.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
