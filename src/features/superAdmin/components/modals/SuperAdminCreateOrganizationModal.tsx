'use client';

import { Building2, CheckCircle2, Loader2, LogOut, Mail } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { SuperAdminCreateOrganizationValues } from '@/features/superAdmin/lib/superAdminSchema';

type SuperAdminCreateOrganizationModalProps = {
  adminName: string;
  error: string | null;
  form: UseFormReturn<SuperAdminCreateOrganizationValues>;
  isSubmitting: boolean;
  onLogout: () => Promise<void>;
  onSubmit: (values: SuperAdminCreateOrganizationValues) => Promise<void>;
  successMessage: string | null;
};

export function SuperAdminCreateOrganizationModal({
  adminName,
  error,
  form,
  isSubmitting,
  onLogout,
  onSubmit,
  successMessage,
}: SuperAdminCreateOrganizationModalProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = form;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <form
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="super-admin-create-organization-title"
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
        className="w-full max-w-lg rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-2xl shadow-indigo-950/20 sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Building2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 id="super-admin-create-organization-title" className="text-2xl font-bold text-slate-900">
              Crear organizacion
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sesion activa como {adminName}. Registra la organizacion y su administrador inicial.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              void onLogout();
            }}
            disabled={isSubmitting}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            aria-label="Cerrar sesion de super administrador"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="super-admin-organization-name" className="text-sm font-semibold text-slate-700">
              Nombre de la organizacion
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="super-admin-organization-name"
                type="text"
                placeholder="Ej. Pactus SAC"
                aria-invalid={Boolean(errors.organizationName)}
                aria-describedby={errors.organizationName ? 'super-admin-organization-name-error' : undefined}
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                {...register('organizationName')}
              />
            </div>
            {errors.organizationName ? (
              <p id="super-admin-organization-name-error" role="alert" className="text-xs font-semibold text-red-600">
                {errors.organizationName.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="super-admin-organization-admin-email" className="text-sm font-semibold text-slate-700">
              Email del administrador
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="super-admin-organization-admin-email"
                type="email"
                autoComplete="email"
                placeholder="admin@organizacion.com"
                aria-invalid={Boolean(errors.adminEmail)}
                aria-describedby={errors.adminEmail ? 'super-admin-organization-admin-email-error' : undefined}
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                {...register('adminEmail')}
              />
            </div>
            {errors.adminEmail ? (
              <p id="super-admin-organization-admin-email-error" role="alert" className="text-xs font-semibold text-red-600">
                {errors.adminEmail.message}
              </p>
            ) : null}
          </div>
        </div>

        {error ? (
          <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {successMessage ? (
          <p role="status" className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {successMessage} Redirigiendo al login...
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || Boolean(successMessage)}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {isSubmitting ? 'Creando...' : 'Crear organizacion'}
        </button>
      </form>
    </div>
  );
}
