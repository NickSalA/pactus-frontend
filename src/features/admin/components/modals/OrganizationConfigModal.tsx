'use client';

import { FormProvider } from 'react-hook-form';
import { Save } from 'lucide-react';
import { AdminModalShell } from '@/features/admin/components/shared/AdminModalShell';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useOrganizationConfigForm } from '@/features/admin/hooks/useOrganizationConfigForm';
import { BasicDataSection } from '@/features/admin/components/form/BasicDataSection';
import { ContactLocationSection } from '@/features/admin/components/form/ContactLocationSection';
import { LegalRepresentationSection } from '@/features/admin/components/form/LegalRepresentationSection';
import { AccreditationPermitsSection } from '@/features/admin/components/form/AccreditationPermitsSection';

type OrganizationConfigModalProps = {
  onClose: () => void;
  open: boolean;
};

export function OrganizationConfigModal({ onClose, open }: OrganizationConfigModalProps) {
  const { form, onSubmit, isLoadingOrganization, submissionError } =
    useOrganizationConfigForm(onClose);
  const isSubmitting = form.formState.isSubmitting;

  return (
    <FormProvider {...form}>
      <AdminModalShell
        title="Configuración de la organización"
        onClose={onClose}
        open={open}
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              disabled={isSubmitting || isLoadingOrganization}
              onClick={() => void form.handleSubmit(onSubmit)()}
              className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        }
      >
        <div className="flex gap-6">
          <aside className="w-36 shrink-0">
            <button
              type="button"
              className="w-full rounded-xl bg-blue-600 px-4 py-2 text-left text-sm font-medium text-white"
            >
              Organización
            </button>
          </aside>

          <div className="flex-1 space-y-10">
            {isLoadingOrganization ? (
              <LoadingSkeleton
                message="Cargando configuración..."
                className="min-h-64"
              />
            ) : (
              <>
                <BasicDataSection />
                <ContactLocationSection />
                <LegalRepresentationSection />
                <AccreditationPermitsSection />

                {submissionError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submissionError}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </AdminModalShell>
    </FormProvider>
  );
}
