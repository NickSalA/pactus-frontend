'use client';

import { Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { SuperAdminLoginValues } from '@/features/superAdmin/lib/superAdminSchema';

type SuperAdminLoginFormProps = {
  error: string | null;
  form: UseFormReturn<SuperAdminLoginValues>;
  isSubmitting: boolean;
  onSubmit: (values: SuperAdminLoginValues) => Promise<void>;
};

export function SuperAdminLoginForm({
  error,
  form,
  isSubmitting,
  onSubmit,
}: SuperAdminLoginFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = form;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      className="w-full space-y-5 rounded-[2rem] border border-indigo-200/60 bg-white/95 px-6 py-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-sm sm:px-8"
    >
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <ShieldCheck className="h-7 w-7" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Acceso SuperAdmin
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Inicia sesion con tu correo y contrasena para crear organizaciones.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="super-admin-email" className="text-sm font-semibold text-slate-700">
            Correo
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="super-admin-email"
              type="email"
              autoComplete="email"
              placeholder="superadmin@empresa.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'super-admin-email-error' : undefined}
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              {...register('email')}
            />
          </div>
          {errors.email ? (
            <p id="super-admin-email-error" role="alert" className="text-xs font-semibold text-red-600">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="super-admin-password" className="text-sm font-semibold text-slate-700">
            Contrasena
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="super-admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Ingresa tu contrasena"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'super-admin-password-error' : undefined}
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              {...register('password')}
            />
          </div>
          {errors.password ? (
            <p id="super-admin-password-error" role="alert" className="text-xs font-semibold text-red-600">
              {errors.password.message}
            </p>
          ) : null}
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {isSubmitting ? 'Validando...' : 'Iniciar sesion'}
      </button>
    </form>
  );
}
