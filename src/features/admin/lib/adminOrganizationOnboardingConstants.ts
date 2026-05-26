import type { LucideIcon } from 'lucide-react';
import {
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  Code2,
  GraduationCap,
  HeartPulse,
  MoreHorizontal,
  Store,
  Truck,
} from 'lucide-react';
import type {
  AdminOrganizationBusinessType,
  AdminOrganizationOnboardingStep,
  AdminOrganizationOnboardingValues,
} from '@/features/admin/types/adminOrganizationOnboardingTypes';

export const ADMIN_ORGANIZATION_ONBOARDING_DEFAULT_VALUES: AdminOrganizationOnboardingValues = {
  name: '',
  ruc: '',
  address: '',
  companyType: '',
  legalRepName: '',
  legalRepDni: '',
  phone: '',
};

export const ADMIN_ORGANIZATION_BUSINESS_TYPE_VALUES = [
  'technology',
  'consulting',
  'commerce',
  'health',
  'education',
  'real_estate',
  'finance',
  'manufacturing',
  'other',
] as const satisfies readonly AdminOrganizationBusinessType[];

export const ADMIN_ORGANIZATION_BUSINESS_TYPES: readonly {
  value: AdminOrganizationBusinessType;
  label: string;
  Icon: LucideIcon;
}[] = [
  { value: 'technology', label: 'Tecnologia', Icon: Code2 },
  { value: 'consulting', label: 'Consultoria', Icon: BriefcaseBusiness },
  { value: 'commerce', label: 'Comercio', Icon: Store },
  { value: 'health', label: 'Salud', Icon: HeartPulse },
  { value: 'education', label: 'Educacion', Icon: GraduationCap },
  { value: 'real_estate', label: 'Inmobiliaria', Icon: Building2 },
  { value: 'finance', label: 'Finanzas', Icon: ChartNoAxesCombined },
  { value: 'manufacturing', label: 'Manufactura', Icon: Truck },
  { value: 'other', label: 'Otros', Icon: MoreHorizontal },
];

export const ADMIN_ORGANIZATION_ONBOARDING_STEPS: readonly AdminOrganizationOnboardingStep[] = [
  {
    id: 1,
    label: 'Datos Generales',
    fields: ['name', 'ruc', 'address'],
  },
  {
    id: 2,
    label: 'Tipo de Empresa',
    fields: ['companyType'],
  },
  {
    id: 3,
    label: 'Datos Legales',
    fields: ['legalRepName', 'legalRepDni', 'phone'],
  },
];

export const ADMIN_ORGANIZATION_ONBOARDING_LAST_STEP = 3;
