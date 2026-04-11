"use client";

import { useState } from "react";
import { Eye, Plus, Save, Trash2 } from "lucide-react";
import { previewTemplate } from "@/lib/api";
import { AdminModalShell } from "@/features/admin/components/shared/AdminModalShell";
import type {
  Template,
  TemplateContent,
  TemplateCreateRequest,
  TemplateField,
  TemplateUpdateRequest,
} from "@/types/api.types";

type AdminTemplateEditorModalProps = {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: TemplateCreateRequest | TemplateUpdateRequest) => Promise<void>;
  open: boolean;
  template: Template | null;
};

type FieldDraft = TemplateField;

const EMPTY_CONTENT: TemplateContent = {
  body_md: "",
  fields: [],
  version: "1.0",
};

const EMPTY_FIELD: FieldDraft = {
  key: "",
  label: "",
  type: "text",
  required: false,
};

const createBlankField = (): FieldDraft => ({ ...EMPTY_FIELD });

export function AdminTemplateEditorModal({ isSubmitting, onClose, onSubmit, open, template }: AdminTemplateEditorModalProps) {
  const [name, setName] = useState(template?.name ?? "");
  const [description, setDescription] = useState(template?.description ?? "");
  const [bodyMd, setBodyMd] = useState(template?.content.body_md ?? EMPTY_CONTENT.body_md);
  const [fields, setFields] = useState<FieldDraft[]>(template?.content.fields.map((field) => ({ ...field })) ?? []);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildContent = (): TemplateContent => ({
    body_md: bodyMd.trim(),
    fields: fields.map((field) => ({
      key: field.key.trim(),
      label: field.label.trim(),
      type: field.type.trim() || "text",
      required: field.required,
    })),
    version: template?.content.version ?? "1.0",
  });

  const handlePreview = async () => {
    if (!bodyMd.trim()) {
      setError("Ingresa el contenido Markdown de la plantilla para previsualizar.");
      return;
    }

    try {
      setPreviewLoading(true);
      setError(null);
      const result = await previewTemplate({ content: buildContent(), sample_data: {} });
      setPreview(result.markdown);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo previsualizar la plantilla.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async () => {
    const normalizedName = name.trim();
    if (!normalizedName || !bodyMd.trim()) {
      setError("Completa al menos el nombre y el contenido principal de la plantilla.");
      return;
    }

    const hasInvalidField = fields.some((field) => !field.key.trim() || !field.label.trim());
    if (hasInvalidField) {
      setError("Cada campo dinámico debe tener clave y etiqueta.");
      return;
    }

    try {
      setError(null);
      const payload = {
        name: normalizedName,
        description: description.trim() || null,
        content: buildContent(),
      } satisfies TemplateCreateRequest;
      await onSubmit(template ? (payload as TemplateUpdateRequest) : payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la plantilla.");
    }
  };

  return (
    <AdminModalShell
      description="Crea o actualiza plantillas en formato Markdown usando campos dinámicos reutilizables."
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              void handlePreview();
            }}
            disabled={previewLoading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Eye className="h-4 w-4" />
            {previewLoading ? "Previsualizando..." : "Previsualizar"}
          </button>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                void handleSubmit();
              }}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Guardando..." : template ? "Guardar cambios" : "Crear plantilla"}
            </button>
          </div>
        </div>
      }
      onClose={onClose}
      open={open}
      title={template ? "Editar Plantilla" : "Nueva Plantilla"}
    >
      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Descripción</label>
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Contenido Markdown</label>
          <textarea
            value={bodyMd}
            onChange={(event) => setBodyMd(event.target.value)}
            rows={12}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="space-y-4 rounded-[24px] border border-slate-200/80 bg-slate-50/70 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Campos dinámicos</h3>
              <p className="text-sm text-slate-500">Define los placeholders que luego llenará el usuario o la IA.</p>
            </div>
            <button
              type="button"
              onClick={() => setFields((previousFields) => [...previousFields, createBlankField()])}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              Agregar campo
            </button>
          </div>

          {fields.length === 0 && <p className="text-sm text-slate-500">Esta plantilla aún no tiene campos dinámicos.</p>}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={`${field.key}-${index}`} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_1fr_140px_auto_auto] md:items-center">
                <input
                  type="text"
                  placeholder="Clave"
                  value={field.key}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFields((previousFields) => previousFields.map((currentField, currentIndex) => currentIndex === index ? { ...currentField, key: value } : currentField));
                  }}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
                <input
                  type="text"
                  placeholder="Etiqueta"
                  value={field.label}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFields((previousFields) => previousFields.map((currentField, currentIndex) => currentIndex === index ? { ...currentField, label: value } : currentField));
                  }}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
                <select
                  value={field.type}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFields((previousFields) => previousFields.map((currentField, currentIndex) => currentIndex === index ? { ...currentField, type: value } : currentField));
                  }}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="text">Texto</option>
                  <option value="number">Número</option>
                  <option value="date">Fecha</option>
                  <option value="boolean">Booleano</option>
                </select>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setFields((previousFields) => previousFields.map((currentField, currentIndex) => currentIndex === index ? { ...currentField, required: checked } : currentField));
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Requerido
                </label>
                <button
                  type="button"
                  onClick={() => setFields((previousFields) => previousFields.filter((_, currentIndex) => currentIndex !== index))}
                  className="inline-flex items-center justify-center rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Eliminar campo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {preview && (
          <div className="rounded-[24px] border border-blue-200 bg-blue-50/50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Previsualización</h3>
            <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{preview}</pre>
          </div>
        )}

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      </div>
    </AdminModalShell>
  );
}
