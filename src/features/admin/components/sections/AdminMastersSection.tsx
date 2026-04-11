"use client";

import { BookType, BriefcaseBusiness, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminServiceModal } from "@/features/admin/components/modals/AdminServiceModal";
import { AdminLoadingState } from "@/features/admin/components/shared/AdminLoadingState";
import { AdminSegmentedTabs } from "@/features/admin/components/shared/AdminSegmentedTabs";
import {
  type DocumentManagementCatalog,
} from "@/features/admin/hooks/use-admin-document-management-page";
import { useAdminDocumentTypes } from "@/features/admin/hooks/use-admin-document-types";
import { useAdminServices } from "@/features/admin/hooks/use-admin-services";
import { formatAdminDate } from "@/features/admin/lib/admin-formatters";

type AdminMastersSectionProps = {
  activeCatalog: DocumentManagementCatalog;
  onCatalogChange: (catalog: DocumentManagementCatalog) => void;
};

export function AdminMastersSection({ activeCatalog, onCatalogChange }: AdminMastersSectionProps) {
  const servicesSection = useAdminServices();
  const documentTypesSection = useAdminDocumentTypes();

  if ((activeCatalog === "services" && servicesSection.loading) || (activeCatalog === "document-types" && documentTypesSection.loading)) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200/70 bg-white px-8 py-7 shadow-sm shadow-slate-200/70">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Maestros del Negocio</h2>
              <p className="mt-1 text-sm text-slate-500">Catálogos editables de servicios y referencia operativa para tipos de documento.</p>
            </div>
          </div>

          {activeCatalog === "services" && (
            <button
              type="button"
              onClick={servicesSection.openCreateEditor}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <Plus className="h-4 w-4" />
              Nuevo servicio
            </button>
          )}
        </div>
      </section>

      <AdminSegmentedTabs
        activeTab={activeCatalog}
        onChange={onCatalogChange}
        tabs={[
          { id: "services", label: "Servicios", badge: servicesSection.stats.totalCount },
          { id: "document-types", label: "Tipos de Documento", badge: documentTypesSection.items.length },
        ]}
      />

      {activeCatalog === "services" ? (
        <>
          <section className="grid gap-4 lg:grid-cols-3">
            <article className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm shadow-slate-200/70">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Total</p>
              <p className="mt-3 text-4xl font-semibold text-slate-900">{servicesSection.stats.totalCount}</p>
            </article>
            <article className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm shadow-slate-200/70">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Activos</p>
              <p className="mt-3 text-4xl font-semibold text-emerald-600">{servicesSection.stats.activeCount}</p>
            </article>
            <article className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm shadow-slate-200/70">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">En uso</p>
              <p className="mt-3 text-4xl font-semibold text-blue-600">{servicesSection.stats.inUseCount}</p>
            </article>
          </section>

          {servicesSection.error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{servicesSection.error}</div>
          )}

          <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/80 text-left">
                <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Servicio</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Contratos</th>
                    <th className="px-6 py-4">Creado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 bg-white text-sm text-slate-700">
                  {servicesSection.services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 font-medium text-slate-900">{service.name}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            void servicesSection.toggleService(service);
                          }}
                          className={`inline-flex min-w-[112px] items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors ${service.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                        >
                          <span className={`h-5 w-9 rounded-full ${service.is_active ? "bg-emerald-500" : "bg-slate-300"}`}>
                            <span className={`mt-0.5 block h-4 w-4 rounded-full bg-white transition-transform ${service.is_active ? "translate-x-4" : "translate-x-0.5"}`} />
                          </span>
                          {service.is_active ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-blue-600">{service.documents_count}</td>
                      <td className="px-6 py-4 text-slate-500">{formatAdminDate(service.created_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => servicesSection.openEditEditor(service)}
                            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            title="Editar servicio"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("¿Eliminar este servicio del catálogo?")) {
                                void servicesSection.removeService(service.id);
                              }
                            }}
                            disabled={service.documents_count > 0}
                            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Eliminar servicio"
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

            {servicesSection.services.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-slate-500">Aún no hay servicios configurados para esta organización.</div>
            )}
          </section>

          <AdminServiceModal
            key={servicesSection.editingService ? `service-${servicesSection.editingService.id}` : "service-new"}
            isSubmitting={servicesSection.saving}
            onClose={servicesSection.closeEditor}
            onSubmit={servicesSection.saveService}
            open={servicesSection.isEditorOpen}
            service={servicesSection.editingService}
          />
        </>
      ) : (
        <>
          {documentTypesSection.error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{documentTypesSection.error}</div>
          )}
          <section className="grid gap-4 lg:grid-cols-2">
            {documentTypesSection.items.map((item) => (
              <article key={item.code} className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/70">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.code}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">{item.label}</h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
                    <BookType className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-500">{item.description}</p>
                <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-medium text-slate-600">Contratos actuales</span>
                  <span className="text-lg font-semibold text-blue-600">{item.count}</span>
                </div>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Catálogo fijo del sistema</p>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
