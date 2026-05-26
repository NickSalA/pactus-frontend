import { z } from 'zod';

export const superAdminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Ingresa tu correo.')
    .email('Ingresa un correo electronico valido.'),
  password: z.string().min(1, 'Ingresa tu contrasena.'),
});

export const superAdminCreateOrganizationSchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(1, 'Ingresa el nombre de la organizacion.')
    .max(255, 'El nombre no debe superar 255 caracteres.'),
  adminEmail: z
    .string()
    .trim()
    .min(1, 'Ingresa el correo del administrador.')
    .email('Ingresa un correo electronico valido.'),
});

export type SuperAdminLoginValues = z.infer<typeof superAdminLoginSchema>;
export type SuperAdminCreateOrganizationValues = z.infer<
  typeof superAdminCreateOrganizationSchema
>;
