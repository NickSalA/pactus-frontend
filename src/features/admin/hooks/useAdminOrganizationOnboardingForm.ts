'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ADMIN_ORGANIZATION_ONBOARDING_DEFAULT_VALUES } from '@/features/admin/lib/adminOrganizationOnboardingConstants';
import { adminOrganizationOnboardingSchema } from '@/features/admin/lib/adminOrganizationOnboardingSchema';
import { mapOrganizationToOnboardingValues } from '@/features/admin/lib/adminOrganizationOnboardingPayload';
import type { AdminOrganizationOnboardingValues } from '@/features/admin/types/adminOrganizationOnboardingTypes';
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
