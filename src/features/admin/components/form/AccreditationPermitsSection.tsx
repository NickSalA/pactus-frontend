'use client';

import { useFormContext } from 'react-hook-form';
import { TextField } from '@/components/ui/TextField';
import { OrgConfigFormRow } from '@/features/admin/components/ui/OrgConfigFormRow';
import type { AdminOrganizationConfigValues } from '@/features/admin/lib/organizationConfig.schema';

export function AccreditationPermitsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AdminOrganizationConfigValues>();

  return (
    <section>
      <h3 className="mb-3 text-xl font-semibold text-brand-primary">Acreditación y Permisos Oficiales</h3>
      <div className="overflow-hidden rounded-2xl border border-brand-neutral-200 divide-y divide-brand-neutral-100">
        <OrgConfigFormRow label="Entidad">
          <TextField
            variant="lg"
            placeholder="Ej. MINEDU"
            error={errors.autorizacionEntidad?.message}
            {...register('autorizacionEntidad')}
          />
        </OrgConfigFormRow>
        <OrgConfigFormRow label="Emitida por">
          <TextField
            variant="lg"
            placeholder="Ej. MINEDU"
            error={errors.autorizacionEmitidaPor?.message}
            {...register('autorizacionEmitidaPor')}
          />
        </OrgConfigFormRow>
        <OrgConfigFormRow label="Fecha de Autorización">
          <TextField
            variant="lg"
            placeholder="Ej. 01/01/2024"
            error={errors.autorizacionFecha?.message}
            {...register('autorizacionFecha')}
          />
        </OrgConfigFormRow>
      </div>
    </section>
  );
}
