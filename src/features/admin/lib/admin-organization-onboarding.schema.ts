import { z } from 'zod';
import { ADMIN_ORGANIZATION_BUSINESS_TYPE_VALUES } from '@/features/admin/lib/admin-organization-onboarding.constants';

const businessTypeValues = new Set<string>(ADMIN_ORGANIZATION_BUSINESS_TYPE_VALUES);

export const adminOrganizationOnboardingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Ingresa el nombre de la empresa.')
    .max(255, 'El nombre no debe superar 255 caracteres.'),
  ruc: z
    .string()
    .trim()
    .regex(/^\d{11}$/, 'El RUC debe tener exactamente 11 digitos.'),
  address: z
    .string()
    .trim()
    .min(1, 'Ingresa la direccion legal.')
    .max(500, 'La direccion legal no debe superar 500 caracteres.'),
  companyType: z
    .string()
    .trim()
    .min(1, 'Selecciona el tipo de empresa.')
    .refine((value) => businessTypeValues.has(value), {
      message: 'Selecciona un tipo de empresa valido.',
    }),
  legalRepName: z
    .string()
    .trim()
    .min(1, 'Ingresa el representante legal.')
    .max(255, 'El nombre no debe superar 255 caracteres.'),
  legalRepDni: z
    .string()
    .trim()
    .regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 digitos.'),
  phone: z
    .string()
    .trim()
    .regex(/^\d{9}$/, 'El telefono debe tener exactamente 9 digitos.'),
});

export type AdminOrganizationOnboardingSchemaValues = z.infer<
  typeof adminOrganizationOnboardingSchema
>;
