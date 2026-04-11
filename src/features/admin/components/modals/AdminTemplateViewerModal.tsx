"use client";

import { AdminModalShell } from "@/features/admin/components/shared/AdminModalShell";
import { formatAdminDate } from "@/features/admin/lib/admin-formatters";
import type { Template } from "@/types/api.types";

type AdminTemplateViewerModalProps = {
  onClose: () => void;
  open: boolean;
  template: Template | null;
};

export function AdminTemplateViewerModal({ onClose, open, template }: AdminTemplateViewerModalProps) {
  return (
    <AdminModalShell
      description="Detalle y contenido de la plantilla seleccionada."
      onClose={onClose}
      open={open}
      title={template?.name ?? "Detalle de plantilla"}
    >
      {template ? (
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Estado</p>
              <p className="mt-2 text-base font-medium text-slate-900">{template.state}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Campos</p>
              <p className="mt-2 text-base font-medium text-slate-900">{template.content.fields.length}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Creada</p>
              <p className="mt-2 text-base font-medium text-slate-900">{formatAdminDate(template.created_at)}</p>
            </div>
          </div>

          {template.description && (
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50 px-5 py-4 text-sm text-slate-600">
              {template.description}
            </div>
          )}

          <div className="rounded-[24px] border border-slate-200/80 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-900">Contenido Markdown</h3>
            <pre className="mt-4 whitespace-pre-wrap text-sm text-slate-700">{template.content.body_md}</pre>
          </div>

          <div className="rounded-[24px] border border-slate-200/80 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-900">Campos dinámicos</h3>
            {template.content.fields.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Esta plantilla no define campos dinámicos.</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/80">
                <table className="min-w-full divide-y divide-slate-200/80 text-left text-sm text-slate-700">
                  <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Clave</th>
                      <th className="px-4 py-3">Etiqueta</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Requerido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 bg-white">
                    {template.content.fields.map((field) => (
                      <tr key={field.key}>
                        <td className="px-4 py-3 font-medium text-slate-900">{field.key}</td>
                        <td className="px-4 py-3">{field.label}</td>
                        <td className="px-4 py-3 uppercase text-slate-500">{field.type}</td>
                        <td className="px-4 py-3">{field.required ? "Sí" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </AdminModalShell>
  );
}
