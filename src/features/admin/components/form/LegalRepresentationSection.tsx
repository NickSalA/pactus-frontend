'use client';

import { useFormContext } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminOrganizationConfigValues } from '@/features/admin/lib/organizationConfig.schema';
import { AdminOrganizationFieldError } from '@/features/admin/components/ui/AdminOrganizationFieldError';

const inputBase =
  'min-h-10 w-full rounded-xl border border-brand-neutral-300 bg-brand-neutral-50 px-3.5 py-2 text-sm text-brand-neutral-900 outline-none transition-colors placeholder:text-brand-neutral-400 hover:border-brand-neutral-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-blue-100';

const selectBase =
  'min-h-10 w-full appearance-none rounded-xl border border-brand-neutral-300 bg-brand-neutral-50 px-3.5 py-2 pr-10 text-sm text-brand-neutral-900 outline-none transition-colors hover:border-brand-neutral-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-blue-100';

const inputError =
  'border-brand-red-500 focus:border-brand-red-500 focus:ring-brand-red-100';

const COMPANY_TYPES = [
  { value: 'S.A.C.', label: 'S.A.C.' },
  { value: 'S.A.', label: 'S.A.' },
  { value: 'E.I.R.L.', label: 'E.I.R.L.' },
  { value: 'S.R.L.', label: 'S.R.L.' },
] as const;

export function LegalRepresentationSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdminOrganizationConfigValues>();

  return (
    <section>
      <h3 className="mb-3 text-xl font-semibold text-blue-600">Representación legal</h3>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 border-b border-slate-100 px-5 py-3">
          <label htmlFor="org-legal-rep-name" className="text-sm text-slate-600">
            Nombre del representante legal
          </label>
          <div>
            <input
              id="org-legal-rep-name"
              type="text"
              placeholder="Ej. Juan Perez"
              {...register('legalRepName')}
              className={cn(inputBase, errors.legalRepName && inputError)}
            />
            <AdminOrganizationFieldError
              id="org-legal-rep-name-error"
              message={errors.legalRepName?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 border-b border-slate-100 px-5 py-3">
          <label htmlFor="org-legal-rep-dni" className="text-sm text-slate-600">
            DNI del representante
          </label>
          <div>
            <input
              id="org-legal-rep-dni"
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="987654321"
              {...register('legalRepDni')}
              className={cn(inputBase, errors.legalRepDni && inputError)}
            />
            <AdminOrganizationFieldError
              id="org-legal-rep-dni-error"
              message={errors.legalRepDni?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 border-b border-slate-100 px-5 py-3">
          <label htmlFor="org-company-type" className="text-sm text-slate-600">
            Tipo de societario
          </label>
          <div className="relative">
            <select
              id="org-company-type"
              {...register('companyType')}
              className={cn(selectBase, errors.companyType && inputError)}
            >
              <option value="">Selecciona un tipo</option>
              {COMPANY_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-neutral-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 px-5 py-3">
          <label htmlFor="org-objeto-social" className="text-sm text-slate-600">
            Objeto social
          </label>
          <div>
            <input
              id="org-objeto-social"
              type="text"
              placeholder="Ej. Empresa de servicios"
              {...register('objetoSocial')}
              className={cn(inputBase, errors.objetoSocial && inputError)}
            />
            <AdminOrganizationFieldError
              id="org-objeto-social-error"
              message={errors.objetoSocial?.message}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
