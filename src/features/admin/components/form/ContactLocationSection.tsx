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

const PERU_CITIES = [
  'Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura',
  'Cusco', 'Iquitos', 'Huancayo', 'Tacna', 'Chimbote',
] as const;

const COUNTRIES = ['Perú', 'Colombia', 'Chile', 'Ecuador', 'Bolivia'] as const;

export function ContactLocationSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdminOrganizationConfigValues>();

  return (
    <section>
      <h3 className="mb-3 text-xl font-semibold text-blue-600">Contacto y Ubicación</h3>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 border-b border-slate-100 px-5 py-3">
          <label htmlFor="org-email" className="text-sm text-slate-600">
            Correo electrónico corporativo
          </label>
          <div>
            <input
              id="org-email"
              type="email"
              placeholder="Ej. Contrato@empresa.com"
              {...register('email')}
              className={cn(inputBase, errors.email && inputError)}
            />
            <AdminOrganizationFieldError id="org-email-error" message={errors.email?.message} />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 border-b border-slate-100 px-5 py-3">
          <label htmlFor="org-phone" className="text-sm text-slate-600">
            Teléfono corporativo
          </label>
          <div>
            <input
              id="org-phone"
              type="text"
              inputMode="numeric"
              maxLength={9}
              placeholder="987654321"
              {...register('phone')}
              className={cn(inputBase, errors.phone && inputError)}
            />
            <AdminOrganizationFieldError id="org-phone-error" message={errors.phone?.message} />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 border-b border-slate-100 px-5 py-3">
          <label htmlFor="org-city" className="text-sm text-slate-600">
            Ciudad
          </label>
          <div className="relative">
            <select
              id="org-city"
              {...register('city')}
              className={cn(selectBase, errors.city && inputError)}
            >
              <option value="">Selecciona una ciudad</option>
              {PERU_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-neutral-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 border-b border-slate-100 px-5 py-3">
          <label htmlFor="org-jurisdiction" className="text-sm text-slate-600">
            País
          </label>
          <div className="relative">
            <select
              id="org-jurisdiction"
              {...register('jurisdiction')}
              className={cn(selectBase, errors.jurisdiction && inputError)}
            >
              <option value="">Selecciona un país</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-neutral-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-[2fr_3fr] items-center gap-x-8 px-5 py-3">
          <label htmlFor="org-address" className="text-sm text-slate-600">
            Dirección Legal
          </label>
          <div>
            <input
              id="org-address"
              type="text"
              placeholder="Ej. Av. Las manzanas 2434"
              {...register('address')}
              className={cn(inputBase, errors.address && inputError)}
            />
            <AdminOrganizationFieldError id="org-address-error" message={errors.address?.message} />
          </div>
        </div>
      </div>
    </section>
  );
}
