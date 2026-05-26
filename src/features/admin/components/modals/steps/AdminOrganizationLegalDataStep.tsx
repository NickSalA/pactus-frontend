import { Card, CardContent } from '@/components/ui/card';
import { useFormContext } from 'react-hook-form';
import { AdminOrganizationTextField } from '@/features/admin/components/ui/AdminOrganizationTextField';
import type { AdminOrganizationOnboardingValues } from '@/features/admin/types/adminOrganizationOnboardingTypes';

export function AdminOrganizationLegalDataStep() {
  const {
    formState: { errors },
    register,
  } = useFormContext<AdminOrganizationOnboardingValues>();

  return (
    <Card className="gap-0 rounded-2xl border-brand-blue-200 bg-brand-neutral-50 py-0 shadow-xl">
      <CardContent className="space-y-4 p-4">
        <div>
          <h2 className="text-body-small-bold text-brand-neutral-900">
            Completa la informacion legal basica
          </h2>
        </div>

        <AdminOrganizationTextField
          id="admin-organization-legal-rep-name"
          label="Representante Legal"
          placeholder="Nombre completo"
          required
          error={errors.legalRepName?.message}
          {...register('legalRepName')}
        />
        <AdminOrganizationTextField
          id="admin-organization-legal-rep-dni"
          label="DNI del Representante Legal"
          inputMode="numeric"
          maxLength={8}
          placeholder="Documento de identidad"
          required
          error={errors.legalRepDni?.message}
          {...register('legalRepDni')}
        />
        <AdminOrganizationTextField
          id="admin-organization-phone"
          label="Telefono"
          inputMode="numeric"
          maxLength={9}
          placeholder="Telefono de contacto"
          required
          error={errors.phone?.message}
          {...register('phone')}
        />
      </CardContent>
    </Card>
  );
}
