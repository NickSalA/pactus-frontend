import type { ApiOrganizationResponse, ApiOrganizationUpdateRequest } from '@/types/api';
import type { AdminOrganizationOnboardingValues } from '@/features/admin/types/admin-organization-onboarding.types';

export function mapOrganizationToOnboardingValues(
  organization: ApiOrganizationResponse,
): AdminOrganizationOnboardingValues {
  return {
    name: organization.name ?? '',
    ruc: organization.ruc ?? '',
    address: organization.address ?? '',
    companyType: organization.company_type ?? '',
    legalRepName: organization.legal_rep_name ?? '',
    legalRepDni: organization.legal_rep_dni ?? '',
    phone: organization.phone ?? '',
  };
}

export function buildAdminOrganizationOnboardingPayload(
  values: AdminOrganizationOnboardingValues,
): ApiOrganizationUpdateRequest {
  return {
    name: values.name.trim(),
    ruc: values.ruc.trim(),
    address: values.address.trim(),
    company_type: values.companyType.trim(),
    legal_rep_name: values.legalRepName.trim(),
    legal_rep_dni: values.legalRepDni.trim(),
    phone: values.phone.trim(),
  };
}
