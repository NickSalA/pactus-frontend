'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { TextField } from '@/components/ui/TextField';
import { OrgConfigFormRow } from '@/features/admin/components/ui/OrgConfigFormRow';
import type { AdminOrganizationConfigValues } from '@/features/admin/lib/organizationConfig.schema';

export function BasicDataSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AdminOrganizationConfigValues>();

  return (
    <section>
      <h3 className="mb-5 text-xl font-semibold text-brand-primary">Datos Básicos</h3>
      <div className="overflow-hidden rounded-2xl border border-brand-neutral-200 divide-y divide-brand-neutral-100">
        <OrgConfigFormRow label="Razón social o nombre">
          <TextField
            variant="lg"
            placeholder="Ej. Empresa de Servicios S.A.C"
            error={errors.name?.message}
            {...register('name')}
          />
        </OrgConfigFormRow>
        <OrgConfigFormRow label="RUC">
          <TextField
            variant="lg"
            inputMode="numeric"
            maxLength={11}
            placeholder="20123456789"
            error={errors.ruc?.message}
            {...register('ruc')}
          />
        </OrgConfigFormRow>
        <OrgConfigFormRow label="Estado">
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
                    field.value ? 'bg-brand-primary' : 'bg-brand-neutral-300',
                  )}
                >
                  <span
                    className={cn(
                      'h-4 w-4 rounded-full bg-brand-neutral-50 shadow-sm transition-transform',
                      field.value ? 'translate-x-6' : 'translate-x-1',
                    )}
                  />
                </button>
                <span className="text-sm text-brand-neutral-500">
                  {field.value ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            )}
          />
        </OrgConfigFormRow>
      </div>
    </section>
  );
}
