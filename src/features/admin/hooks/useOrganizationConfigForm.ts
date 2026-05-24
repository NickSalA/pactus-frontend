'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  adminOrganizationConfigSchema,
  type AdminOrganizationConfigValues,
} from '@/features/admin/lib/organizationConfig.schema';

const DEFAULT_VALUES: AdminOrganizationConfigValues = {
  name: '',
  ruc: '',
  isActive: true,
  email: '',
  phone: '',
  city: '',
  jurisdiction: '',
  address: '',
  legalRepName: '',
  legalRepDni: '',
  companyType: '',
  objetoSocial: '',
  autorizacionEntidad: '',
  autorizacionEmitidaPor: '',
  autorizacionFecha: '',
};

export function useOrganizationConfigForm() {
  const form = useForm<AdminOrganizationConfigValues>({
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(adminOrganizationConfigSchema),
    shouldFocusError: true,
  });

  // SCRUM-34: replace with useUpdateMyOrganization mutation
  const onSubmit = (data: AdminOrganizationConfigValues): void => {
    console.log('Form data:', data);
  };

  return { form, onSubmit };
}
