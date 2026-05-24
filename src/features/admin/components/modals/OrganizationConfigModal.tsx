'use client';

import { Save } from 'lucide-react';
import { AdminModalShell } from '@/features/admin/components/shared/AdminModalShell';

type OrganizationConfigModalProps = {
  onClose: () => void;
  open: boolean;
};

export function OrganizationConfigModal({ onClose, open }: OrganizationConfigModalProps) {
  return (
    <AdminModalShell
      title="Configuración de la organización"
      onClose={onClose}
      open={open}
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Save className="h-4 w-4" />
            Guardar cambios
          </button>
        </div>
      }
    >
      <div className="flex gap-6">
        {/* LEFT: Panel de navegación del modal */}
        <aside className="w-36 shrink-0">
          {/* PLACEHOLDER SCRUM-31: Aquí irán los ítems de navegación entre secciones */}
          <button
            type="button"
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-left text-sm font-medium text-white"
          >
            Organización
          </button>
        </aside>

        {/* RIGHT: Áreas del formulario */}
        <div className="flex-1 space-y-10">
          {/* PLACEHOLDER SCRUM-31: Sección — Datos Básicos */}
          <div />

          {/* PLACEHOLDER SCRUM-31: Sección — Contacto y Ubicación */}
          <div />

          {/* PLACEHOLDER SCRUM-31: Sección — Representación Legal */}
          <div />

          {/* PLACEHOLDER SCRUM-31: Sección — Acreditación y Permisos Oficiales */}
          <div />
        </div>
      </div>
    </AdminModalShell>
  );
}
