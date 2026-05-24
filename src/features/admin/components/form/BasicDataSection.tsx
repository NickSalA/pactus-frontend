'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import type { AdminOrganizationConfigValues } from '@/features/admin/lib/organizationConfig.schema';
import { AdminOrganizationFieldError } from '@/features/admin/components/ui/AdminOrganizationFieldError';

const inputBase =
  'min-h-10 w-full rounded-xl border border-brand-neutral-300 bg-brand-neutral-50 px-3.5 py-2 text-sm text-brand-neutral-900 outline-none transition-colors placeholder:text-brand-neutral-400 hover:border-brand-neutral-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-blue-100';

const inputError =
  'border-brand-red-500 focus:border-brand-red-500 focus:ring-brand-red-100';

export function BasicDataSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AdminOrganizationConfigValues>();

  return (
    <section>
      <h3 className="mb-3 text-xl font-semibold text-blue-600">Datos Básicos</h3>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 border-b border-slate-100 px-5 py-3">
          <label htmlFor="org-name" className="text-sm text-slate-600">
            Razón social o nombre
          </label>
          <div>
            <input
              id="org-name"
              type="text"
              placeholder="Ej. Empresa de Servicios S.A.C"
              {...register('name')}
              className={cn(inputBase, errors.name && inputError)}
            />
            <AdminOrganizationFieldError id="org-name-error" message={errors.name?.message} />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 border-b border-slate-100 px-5 py-3">
          <label htmlFor="org-ruc" className="text-sm text-slate-600">
            RUC
          </label>
          <div>
            <input
              id="org-ruc"
              type="text"
              inputMode="numeric"
              maxLength={11}
              placeholder="20123456789"
              {...register('ruc')}
              className={cn(inputBase, errors.ruc && inputError)}
            />
            <AdminOrganizationFieldError id="org-ruc-error" message={errors.ruc?.message} />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 px-5 py-3">
          <span className="text-sm text-slate-600">Estado</span>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-brand-blue-100',
                    field.value ? 'bg-blue-600' : 'bg-slate-300',
                  )}
                >
                  <span
                    className={cn(
                      'h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                      field.value ? 'translate-x-6' : 'translate-x-1',
                    )}
                  />
                </button>
                <span className="text-sm text-slate-500">
                  {field.value ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}
