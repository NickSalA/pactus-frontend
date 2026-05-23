'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ADMIN_ORGANIZATION_ONBOARDING_DEFAULT_VALUES } from '@/features/admin/lib/admin-organization-onboarding.constants';
import { adminOrganizationOnboardingSchema } from '@/features/admin/lib/admin-organization-onboarding.schema';
import { mapOrganizationToOnboardingValues } from '@/features/admin/lib/admin-organization-onboarding.payload';
import type { AdminOrganizationOnboardingValues } from '@/features/admin/types/admin-organization-onboarding.types';
import type { ApiOrganizationResponse } from '@/types/api';

export function useAdminOrganizationOnboardingForm(
  organization: ApiOrganizationResponse,
) {
  const form = useForm<AdminOrganizationOnboardingValues>({
    defaultValues: ADMIN_ORGANIZATION_ONBOARDING_DEFAULT_VALUES,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(adminOrganizationOnboardingSchema),
    shouldFocusError: true,
  });

  useEffect(() => {
    form.reset(mapOrganizationToOnboardingValues(organization));
  }, [form, organization]);

  return form;
}
