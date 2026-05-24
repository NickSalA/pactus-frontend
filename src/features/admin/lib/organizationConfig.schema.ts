import { z } from 'zod';

export const adminOrganizationConfigSchema = z.object({
  // Datos Básicos
  name: z
    .string()
    .trim()
    .min(1, 'Ingresa la razón social o nombre de la empresa.')
    .max(255, 'El nombre no debe superar 255 caracteres.'),
  ruc: z
    .string()
    .trim()
    .regex(/^\d{11}$/, 'El RUC debe tener exactamente 11 dígitos.'),
  isActive: z.boolean(),

  // Contacto y Ubicación
  email: z.union([
    z.string().trim().email('Ingresa un correo electrónico válido.'),
    z.literal(''),
  ]),
  phone: z.union([
    z.string().trim().regex(/^\d{9}$/, 'El teléfono debe tener exactamente 9 dígitos.'),
    z.literal(''),
  ]),
  city: z.string().trim(),
  jurisdiction: z.string().trim(),
  address: z
    .string()
    .trim()
    .max(500, 'La dirección no debe superar 500 caracteres.'),

  // Representación Legal
  legalRepName: z
    .string()
    .trim()
    .max(255, 'El nombre del representante no debe superar 255 caracteres.'),
  legalRepDni: z.union([
    z.string().trim().regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos.'),
    z.literal(''),
  ]),
  companyType: z.string().trim(),
  objetoSocial: z
    .string()
    .trim()
    .max(500, 'El objeto social no debe superar 500 caracteres.'),

  // Acreditación y Permisos Oficiales
  autorizacionEntidad: z.string().trim(),
  autorizacionEmitidaPor: z.string().trim(),
  autorizacionFecha: z.string().trim(),
});

export type AdminOrganizationConfigValues = z.infer<typeof adminOrganizationConfigSchema>;
