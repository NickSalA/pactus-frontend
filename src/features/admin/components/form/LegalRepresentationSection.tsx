'use client';

import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { OrgConfigFormRow } from '@/features/admin/components/ui/OrgConfigFormRow';
import type { AdminOrganizationConfigValues } from '@/features/admin/lib/organizationConfig.schema';

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
      <h3 className="mb-3 text-xl font-semibold text-brand-primary">Representación Legal</h3>
      <div className="overflow-hidden rounded-2xl border border-slate-200 divide-y divide-slate-100">
        <OrgConfigFormRow label="Nombre del representante legal">
          <TextField
            variant="lg"
            placeholder="Ej. Juan Pérez"
            error={errors.legalRepName?.message}
            {...register('legalRepName')}
          />
        </OrgConfigFormRow>
        <OrgConfigFormRow label="DNI del representante">
          <TextField
            variant="lg"
            inputMode="numeric"
            maxLength={8}
            placeholder="12345678"
            error={errors.legalRepDni?.message}
            {...register('legalRepDni')}
          />
        </OrgConfigFormRow>
        <OrgConfigFormRow label="Tipo societario">
          <Select variant="lg" className="w-full" {...register('companyType')}>
            <option value="">Selecciona un tipo</option>
            {COMPANY_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
          {errors.companyType?.message && (
            <span className="text-xs text-red-500">{errors.companyType.message}</span>
          )}
        </OrgConfigFormRow>
        <OrgConfigFormRow label="Objeto social">
          <TextField
            variant="lg"
            placeholder="Ej. Empresa de servicios"
            error={errors.objetoSocial?.message}
            {...register('objetoSocial')}
          />
        </OrgConfigFormRow>
      </div>
    </section>
  );
}
