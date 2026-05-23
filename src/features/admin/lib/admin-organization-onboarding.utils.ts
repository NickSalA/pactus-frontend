import type { ApiOrganizationResponse } from '@/types/api';

const hasValue = (value: string | null | undefined): boolean =>
  Boolean(value?.trim());

export function isAdminOrganizationOnboardingComplete(
  organization: ApiOrganizationResponse,
): boolean {
  return [
    organization.name,
    organization.ruc,
    organization.address,
    organization.company_type,
    organization.legal_rep_name,
    organization.legal_rep_dni,
    organization.phone,
  ].every(hasValue);
}
