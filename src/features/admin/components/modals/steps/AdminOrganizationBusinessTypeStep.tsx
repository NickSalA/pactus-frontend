import { Controller, useFormContext } from 'react-hook-form';
import { ADMIN_ORGANIZATION_BUSINESS_TYPES } from '@/features/admin/lib/admin-organization-onboarding.constants';
import { AdminOrganizationBusinessTypeOption } from '@/features/admin/components/ui/AdminOrganizationBusinessTypeOption';
import { AdminOrganizationFieldError } from '@/features/admin/components/ui/AdminOrganizationFieldError';
import type { AdminOrganizationOnboardingValues } from '@/features/admin/types/admin-organization-onboarding.types';

export function AdminOrganizationBusinessTypeStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AdminOrganizationOnboardingValues>();

  return (
    <fieldset className="space-y-5">
      <legend
        id="admin-organization-business-type-label"
        className="text-label-main-bold text-brand-neutral-900"
      >
        ¿Qué tipo de rubro se asocia más con tu empresa?
      </legend>

      <Controller
        control={control}
        name="companyType"
        render={({ field }) => (
          <div
            role="radiogroup"
            aria-labelledby="admin-organization-business-type-label"
            aria-describedby="admin-organization-business-type-error"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {ADMIN_ORGANIZATION_BUSINESS_TYPES.map((option) => (
              <AdminOrganizationBusinessTypeOption
                key={option.value}
                Icon={option.Icon}
                label={option.label}
                selected={field.value === option.value}
                onSelect={() => {
                  field.onChange(option.value);
                  field.onBlur();
                }}
              />
            ))}
          </div>
        )}
      />
      <AdminOrganizationFieldError
        id="admin-organization-business-type-error"
        message={errors.companyType?.message}
      />
    </fieldset>
  );
}
