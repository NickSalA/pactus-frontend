"use client";

import { FolderKanban, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminFolderModal } from "@/features/admin/components/modals/AdminFolderModal";
import { AdminLoadingState } from "@/features/admin/components/shared/AdminLoadingState";
import { useAdminFolders } from "@/features/admin/hooks/use-admin-folders";
import { formatAdminDate, getFolderVisibilityLabel } from "@/features/admin/lib/admin-formatters";

export function AdminFoldersSection() {
  const section = useAdminFolders();

  if (section.loading) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200/70 bg-white px-8 py-7 shadow-sm shadow-slate-200/70">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FolderKanban className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Gestor de Carpetas</h2>
              <p className="mt-1 text-sm text-slate-500">Vista administrativa de carpetas creadas por RRHH y Manager dentro de la organización.</p>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-medium text-slate-400"
            title="Las carpetas se crean desde cuentas HR o Manager"
          >
            <Plus className="h-4 w-4" />
            Nueva carpeta
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm shadow-slate-200/70">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Carpetas totales</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900">{section.stats.totalFolders}</p>
        </article>
        <article className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm shadow-slate-200/70">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Documentos organizados</p>
          <p className="mt-3 text-4xl font-semibold text-blue-600">{section.stats.totalDocuments}</p>
        </article>
        <article className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm shadow-slate-200/70">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Carpetas RRHH</p>
          <p className="mt-3 text-4xl font-semibold text-emerald-600">{section.stats.hrCount}</p>
          <p className="mt-2 text-sm text-slate-500">{section.stats.managerCount} carpetas de Manager</p>
        </article>
      </section>

      {section.error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{section.error}</div>
      )}

      <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/80 text-left">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th className="px-6 py-4">Carpeta</th>
                <th className="px-6 py-4">Visible para</th>
                <th className="px-6 py-4">Creada por</th>
                <th className="px-6 py-4">Documentos</th>
                <th className="px-6 py-4">Creada</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 bg-white text-sm text-slate-700">
              {section.folders.map((folder) => (
                <tr key={folder.id}>
                  <td className="px-6 py-4 font-medium text-slate-900">{folder.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                      {getFolderVisibilityLabel(folder.owner_role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{folder.created_by_name || "Sin nombre"}</p>
                      <p className="text-slate-500">{folder.created_by_email || "Sin correo"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-blue-600">{folder.documents_count}</td>
                  <td className="px-6 py-4 text-slate-500">{formatAdminDate(folder.created_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => section.openEditFolder(folder)}
                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        title="Editar carpeta"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("¿Eliminar esta carpeta? Los documentos quedarán sin carpeta asignada.")) {
                            void section.removeFolder(folder.id);
                          }
                        }}
                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Eliminar carpeta"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {section.folders.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-slate-500">Aún no existen carpetas registradas en la organización.</div>
        )}
      </section>

      <AdminFolderModal
        key={section.editingFolder ? `folder-${section.editingFolder.id}` : "folder-edit"}
        folder={section.editingFolder}
        isSubmitting={section.saving}
        onClose={section.closeEditor}
        onSubmit={section.saveFolder}
        open={section.isEditorOpen}
      />
    </div>
  );
}
