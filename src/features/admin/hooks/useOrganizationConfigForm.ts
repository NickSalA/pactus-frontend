'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMyOrganization } from '@/queries/hooks/organizations/queries';
import type { ApiOrganizationResponse } from '@/types/api';
import {
  adminOrganizationConfigSchema,
  type AdminOrganizationConfigValues,
} from '@/features/admin/lib/organizationConfig.schema';

function mapOrganizationToConfigValues(
  org: ApiOrganizationResponse,
): AdminOrganizationConfigValues {
  return {
    name: org.name ?? '',
    ruc: org.ruc ?? '',
    isActive: org.is_active ?? true,
    email: org.email ?? '',
    phone: org.phone ?? '',
    city: org.city ?? '',
    jurisdiction: org.jurisdiction ?? '',
    address: org.address ?? '',
    legalRepName: org.legal_rep_name ?? '',
    legalRepDni: org.legal_rep_dni ?? '',
    companyType: org.company_type ?? '',
    objetoSocial: org.objeto_social ?? '',
    autorizacionEntidad: org.autorizacion_entidad ?? '',
    autorizacionEmitidaPor: org.autorizacion_emitida_por ?? '',
    autorizacionFecha: org.autorizacion_fecha ?? '',
  };
}

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
  const { data: organization, isLoading: isLoadingOrganization } = useMyOrganization();

  const form = useForm<AdminOrganizationConfigValues>({
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(adminOrganizationConfigSchema),
    shouldFocusError: true,
  });

  useEffect(() => {
    if (organization) {
      form.reset(mapOrganizationToConfigValues(organization));
    }
  }, [form, organization]);

  // SCRUM-34: replace with useUpdateMyOrganization mutation
  const onSubmit = (data: AdminOrganizationConfigValues): void => {
    console.log('Form data:', data);
  };

  return { form, onSubmit, isLoadingOrganization };
}
