'use client';

import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { OrgConfigFormRow } from '@/features/admin/components/ui/OrgConfigFormRow';
import type { AdminOrganizationConfigValues } from '@/features/admin/lib/organizationConfig.schema';

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
      <h3 className="mb-3 text-xl font-semibold text-brand-primary">Contacto y Ubicación</h3>
      <div className="overflow-hidden rounded-2xl border border-brand-neutral-200 divide-y divide-brand-neutral-100">
        <OrgConfigFormRow label="Correo electrónico corporativo">
          <TextField
            variant="lg"
            type="email"
            placeholder="Ej. Contrato@empresa.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </OrgConfigFormRow>
        <OrgConfigFormRow label="Teléfono corporativo">
          <TextField
            variant="lg"
            inputMode="numeric"
            maxLength={9}
            placeholder="987654321"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </OrgConfigFormRow>
        <OrgConfigFormRow label="Ciudad">
          <Select variant="lg" className="w-full" {...register('city')}>
            <option value="">Selecciona una ciudad</option>
            {PERU_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </Select>
          {errors.city?.message && (
            <span className="text-xs text-brand-red-500">{errors.city.message}</span>
          )}
        </OrgConfigFormRow>
        <OrgConfigFormRow label="País">
          <Select variant="lg" className="w-full" {...register('jurisdiction')}>
            <option value="">Selecciona un país</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </Select>
          {errors.jurisdiction?.message && (
            <span className="text-xs text-brand-red-500">{errors.jurisdiction.message}</span>
          )}
        </OrgConfigFormRow>
        <OrgConfigFormRow label="Dirección Legal">
          <TextField
            variant="lg"
            placeholder="Ej. Av. Las manzanas 2434"
            error={errors.address?.message}
            {...register('address')}
          />
        </OrgConfigFormRow>
      </div>
    </section>
  );
}
