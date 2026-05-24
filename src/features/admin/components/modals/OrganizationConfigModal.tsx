'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { Save } from 'lucide-react';
import { AdminModalShell } from '@/features/admin/components/shared/AdminModalShell';
import type { AdminOrganizationConfigValues } from '@/features/admin/lib/organizationConfig.schema';
import { BasicDataSection } from '@/features/admin/components/form/BasicDataSection';
import { ContactLocationSection } from '@/features/admin/components/form/ContactLocationSection';
import { LegalRepresentationSection } from '@/features/admin/components/form/LegalRepresentationSection';
import { AccreditationPermitsSection } from '@/features/admin/components/form/AccreditationPermitsSection';

// SCRUM-32: replace with zodResolver + useMyOrganization default values + handleSubmit
const EMPTY_DEFAULTS: AdminOrganizationConfigValues = {
  name: '', ruc: '', isActive: true,
  email: '', phone: '', city: '', jurisdiction: '', address: '',
  legalRepName: '', legalRepDni: '', companyType: '', objetoSocial: '',
  autorizacionEntidad: '', autorizacionEmitidaPor: '', autorizacionFecha: '',
};

type OrganizationConfigModalProps = {
  onClose: () => void;
  open: boolean;
};

export function OrganizationConfigModal({ onClose, open }: OrganizationConfigModalProps) {
  // SCRUM-32: replace with useForm({ resolver: zodResolver(adminOrganizationConfigSchema), defaultValues: fromAPI })
  const methods = useForm<AdminOrganizationConfigValues>({ defaultValues: EMPTY_DEFAULTS });

  return (
    <FormProvider {...methods}>
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
            <button
              type="button"
              className="w-full rounded-xl bg-blue-600 px-4 py-2 text-left text-sm font-medium text-white"
            >
              Organización
            </button>
          </aside>

          {/* RIGHT: Secciones del formulario */}
          <div className="flex-1 space-y-10">
            <BasicDataSection />
            <ContactLocationSection />
            <LegalRepresentationSection />
            <AccreditationPermitsSection />
          </div>
        </div>
      </AdminModalShell>
    </FormProvider>
  );
}
