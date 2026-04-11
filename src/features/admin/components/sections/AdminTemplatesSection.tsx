"use client";

import { Eye, FileStack, Pencil, Plus, RefreshCw, Send } from "lucide-react";
import { AdminLoadingState } from "@/features/admin/components/shared/AdminLoadingState";
import { TemplateEditModal } from "@/features/admin/components/page/templates/TemplateEditModal";
import { TemplateFormModal } from "@/features/admin/components/page/templates/TemplateFormModal";
import { TemplateViewModal } from "@/features/admin/components/page/templates/TemplateViewModal";
import { useAdminTemplates } from "@/features/admin/hooks/use-admin-templates";
import { formatAdminDate } from "@/features/admin/lib/admin-formatters";
import type { Template } from "@/types/api.types";

const getTemplateStateClasses = (state: string): string => {
  if (state === "PUBLISHED") return "bg-emerald-50 text-emerald-700";
  if (state === "ARCHIVED") return "bg-slate-100 text-slate-600";
  return "bg-amber-50 text-amber-700";
};

const STATE_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicada",
  ARCHIVED: "Archivada",
};

export function AdminTemplatesSection() {
  const section = useAdminTemplates();

  if (section.loading) {
    return <AdminLoadingState />;
  }

  const handleSaved = (template: Template, message: string) => {
    section.upsertTemplate(template);
    // Optionally show a toast — section.error is not for success toasts,
    // so we just close via the modal's own onClose.
    void message;
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200/70 bg-white px-8 py-7 shadow-sm shadow-slate-200/70">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <FileStack className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Plantillas de contratos</h2>
              <p className="mt-1 text-sm text-slate-500">
                Crea, edita, previsualiza y publica plantillas usando los endpoints del backend.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => { void section.reload(); }}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </button>
            <button
              type="button"
              onClick={section.openCreateEditor}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <Plus className="h-4 w-4" />
              Nueva plantilla
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-xl flex-1">
          <input
            type="search"
            value={section.search}
            onChange={(e) => section.setSearch(e.target.value)}
            placeholder="Buscar por nombre o descripción..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:w-auto">
          <article className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 shadow-sm shadow-slate-200/70">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Plantillas</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{section.stats.totalCount}</p>
          </article>
          <article className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 shadow-sm shadow-slate-200/70">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Borradores</p>
            <p className="mt-2 text-3xl font-semibold text-amber-600">{section.stats.draftCount}</p>
          </article>
          <article className="rounded-[24px] border border-slate-200/80 bg-white px-5 py-4 shadow-sm shadow-slate-200/70">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Publicadas</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">{section.stats.publishedCount}</p>
          </article>
        </div>
      </section>

      {section.error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {section.error}
        </div>
      )}

      <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/80 text-left">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Campos</th>
                <th className="px-6 py-4">Creada</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 bg-white text-sm text-slate-700">
              {section.filteredTemplates.map((template) => (
                <tr key={template.id}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{template.name}</p>
                      <p className="text-slate-500">{template.description ?? "Sin descripción"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getTemplateStateClasses(template.state)}`}>
                      {STATE_LABELS[template.state] ?? template.state}
                    </span>
                  </td>
                  <td className="px-6 py-4">{template.content.fields.length}</td>
                  <td className="px-6 py-4 text-slate-500">{formatAdminDate(template.created_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => section.openViewer(template)}
                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => section.openEditEditor(template)}
                        disabled={template.state !== "DRAFT"}
                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
                        title={template.state === "DRAFT" ? "Editar plantilla" : "Solo se pueden editar borradores"}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { void section.publishOneTemplate(template); }}
                        disabled={template.state !== "DRAFT" || section.saving}
                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Publicar plantilla"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {section.filteredTemplates.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-slate-500">
            {section.search
              ? "No hay plantillas que coincidan con la búsqueda."
              : "Todavía no hay plantillas. Crea la primera con '+ Nueva plantilla'."}
          </div>
        )}
      </section>

      {/* Modal de creación */}
      <TemplateFormModal
        open={section.isEditorOpen && !section.editingTemplate}
        onClose={section.closeEditor}
        onSaved={handleSaved}
      />

      {/* Modal de edición */}
      <TemplateEditModal
        key={section.editingTemplate?.id ?? "edit-closed"}
        template={section.editingTemplate}
        open={section.isEditorOpen && section.editingTemplate !== null}
        onClose={section.closeEditor}
        onSaved={handleSaved}
      />

      {/* Modal de visualización */}
      <TemplateViewModal
        key={section.viewingTemplate?.id ?? "view-closed"}
        template={section.viewingTemplate}
        onClose={section.closeViewer}
      />
    </div>
  );
}
