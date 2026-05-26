import { Card, CardContent } from '@/components/ui/card';
import { useFormContext } from 'react-hook-form';
import { AdminOrganizationTextField } from '@/features/admin/components/ui/AdminOrganizationTextField';
import type { AdminOrganizationOnboardingValues } from '@/features/admin/types/adminOrganizationOnboardingTypes';

export function AdminOrganizationGeneralDataStep() {
  const {
    formState: { errors },
    register,
  } = useFormContext<AdminOrganizationOnboardingValues>();

  return (
    <Card className="gap-0 rounded-2xl border-brand-blue-200 bg-brand-neutral-50 py-0 shadow-xl">
      <CardContent className="space-y-4 p-4">
        <div>
          <h2 className="text-body-small-bold text-brand-neutral-900">
            Confirma los datos principales de tu empresa
          </h2>
        </div>

        <AdminOrganizationTextField
          id="admin-organization-name"
          label="Nombre de Empresa"
          placeholder="Ej. Pactus SAC"
          required
          error={errors.name?.message}
          {...register('name')}
        />
        <AdminOrganizationTextField
          id="admin-organization-ruc"
          label="RUC"
          inputMode="numeric"
          maxLength={11}
          placeholder="11 digitos"
          required
          error={errors.ruc?.message}
          {...register('ruc')}
        />
        <AdminOrganizationTextField
          id="admin-organization-address"
          label="Direccion Legal"
          placeholder="Av. Principal 123, Lima"
          required
          error={errors.address?.message}
          {...register('address')}
        />
      </CardContent>
    </Card>
  );
}
