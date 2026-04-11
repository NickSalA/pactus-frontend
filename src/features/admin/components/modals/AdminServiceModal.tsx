"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { AdminModalShell } from "@/features/admin/components/shared/AdminModalShell";
import type {
  ServiceCatalogItem,
  ServiceCatalogItemCreateRequest,
  ServiceCatalogItemUpdateRequest,
} from "@/types/api.types";

type AdminServiceModalProps = {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: ServiceCatalogItemCreateRequest | ServiceCatalogItemUpdateRequest) => Promise<void>;
  open: boolean;
  service: ServiceCatalogItem | null;
};

export function AdminServiceModal({ isSubmitting, onClose, onSubmit, open, service }: AdminServiceModalProps) {
  const [name, setName] = useState(service?.name ?? "");
  const [isActive, setIsActive] = useState(service?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const normalizedName = name.trim();
    if (!normalizedName) {
      setError("Ingresa un nombre válido para el servicio.");
      return;
    }

    try {
      setError(null);
      await onSubmit({ name: normalizedName, is_active: isActive });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el servicio.");
    }
  };

  return (
    <AdminModalShell
      description="Administra los servicios disponibles para asignar dentro de contratos de la organización."
      footer={
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
            {isSubmitting ? "Guardando..." : service ? "Guardar cambios" : "Crear servicio"}
          </button>
        </div>
      }
      onClose={onClose}
      open={open}
      title={service ? "Editar Servicio" : "Nuevo Servicio"}
    >
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Nombre del servicio</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Servicio activo
        </label>

        {service && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Este servicio aparece en {service.documents_count} contrato{service.documents_count === 1 ? "" : "s"}.
          </div>
        )}

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      </div>
    </AdminModalShell>
  );
}
