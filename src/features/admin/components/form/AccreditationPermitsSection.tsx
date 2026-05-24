'use client';

import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import type { AdminOrganizationConfigValues } from '@/features/admin/lib/organizationConfig.schema';
import { AdminOrganizationFieldError } from '@/features/admin/components/ui/AdminOrganizationFieldError';

const inputBase =
  'min-h-10 w-full rounded-xl border border-brand-neutral-300 bg-brand-neutral-50 px-3.5 py-2 text-sm text-brand-neutral-900 outline-none transition-colors placeholder:text-brand-neutral-400 hover:border-brand-neutral-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-blue-100';

const inputError =
  'border-brand-red-500 focus:border-brand-red-500 focus:ring-brand-red-100';

export function AccreditationPermitsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdminOrganizationConfigValues>();

  return (
    <section>
      <h3 className="mb-3 text-xl font-semibold text-blue-600">
        Acreditación y Permisos Oficiales
      </h3>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 border-b border-slate-100 px-5 py-3">
          <label htmlFor="org-autorizacion-entidad" className="text-sm text-slate-600">
            Entidad
          </label>
          <div>
            <input
              id="org-autorizacion-entidad"
              type="text"
              placeholder="Ej. MINEDU"
              {...register('autorizacionEntidad')}
              className={cn(inputBase, errors.autorizacionEntidad && inputError)}
            />
            <AdminOrganizationFieldError
              id="org-autorizacion-entidad-error"
              message={errors.autorizacionEntidad?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 border-b border-slate-100 px-5 py-3">
          <label htmlFor="org-autorizacion-emitida-por" className="text-sm text-slate-600">
            Emitida por
          </label>
          <div>
            <input
              id="org-autorizacion-emitida-por"
              type="text"
              placeholder="Ej. MINEDU"
              {...register('autorizacionEmitidaPor')}
              className={cn(inputBase, errors.autorizacionEmitidaPor && inputError)}
            />
            <AdminOrganizationFieldError
              id="org-autorizacion-emitida-por-error"
              message={errors.autorizacionEmitidaPor?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 px-5 py-3">
          <label htmlFor="org-autorizacion-fecha" className="text-sm text-slate-600">
            Fecha de Autorización
          </label>
          <div>
            <input
              id="org-autorizacion-fecha"
              type="text"
              placeholder="Ej. 01/01/2024"
              {...register('autorizacionFecha')}
              className={cn(inputBase, errors.autorizacionFecha && inputError)}
            />
            <AdminOrganizationFieldError
              id="org-autorizacion-fecha-error"
              message={errors.autorizacionFecha?.message}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
