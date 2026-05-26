import type { FieldPath } from 'react-hook-form';

export type AdminOrganizationBusinessType =
  | 'technology'
  | 'consulting'
  | 'commerce'
  | 'health'
  | 'education'
  | 'real_estate'
  | 'finance'
  | 'manufacturing'
  | 'other';

export type AdminOrganizationOnboardingStepId = 1 | 2 | 3;

export type AdminOrganizationOnboardingValues = {
  name: string;
  ruc: string;
  address: string;
  companyType: string;
  legalRepName: string;
  legalRepDni: string;
  phone: string;
};

export type AdminOrganizationOnboardingStep = {
  id: AdminOrganizationOnboardingStepId;
  label: string;
  fields: readonly FieldPath<AdminOrganizationOnboardingValues>[];
};
