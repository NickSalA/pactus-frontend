'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMyOrganization } from '@/queries/hooks/organizations/queries';
import { useUpdateMyOrganization } from '@/queries/hooks/organizations/mutations';
import type { ApiOrganizationResponse, ApiOrganizationUpdateRequest } from '@/types/api';
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

function buildUpdatePayload(
  values: AdminOrganizationConfigValues,
): ApiOrganizationUpdateRequest {
  return {
    name: values.name.trim(),
    ruc: values.ruc.trim(),
    is_active: values.isActive,
    email: values.email.trim() || null,
    phone: values.phone.trim() || null,
    city: values.city.trim() || null,
    jurisdiction: values.jurisdiction.trim() || null,
    address: values.address.trim() || null,
    legal_rep_name: values.legalRepName.trim() || null,
    legal_rep_dni: values.legalRepDni.trim() || null,
    company_type: values.companyType.trim() || null,
    objeto_social: values.objetoSocial.trim() || null,
    autorizacion_entidad: values.autorizacionEntidad.trim() || null,
    autorizacion_emitida_por: values.autorizacionEmitidaPor.trim() || null,
    autorizacion_fecha: values.autorizacionFecha.trim() || null,
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

export function useOrganizationConfigForm(onClose: () => void) {
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const { data: organization, isLoading: isLoadingOrganization } = useMyOrganization();
  const updateMutation = useUpdateMyOrganization();

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

  const onSubmit = async (data: AdminOrganizationConfigValues): Promise<void> => {
    try {
      setSubmissionError(null);
      await updateMutation.mutateAsync(buildUpdatePayload(data));
      onClose();
    } catch (err) {
      setSubmissionError(
        err instanceof Error ? err.message : 'No se pudo guardar la configuración.',
      );
    }
  };

  return { form, onSubmit, isLoadingOrganization, submissionError };
}
