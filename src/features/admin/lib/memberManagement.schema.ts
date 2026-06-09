import { z } from 'zod';

const MEMBER_ROLES = ['WORKER', 'HR', 'MANAGER', 'ADMIN'] as const;

export const addMemberSchema = z.object({
  email: z
    .string()
    .min(1, 'Ingresa un correo electrónico.')
    .email('El correo electrónico no es válido.'),
  role: z.enum(MEMBER_ROLES, {
    errorMap: () => ({ message: 'Selecciona un rol válido.' }),
  }),
});

export type AddMemberValues = z.infer<typeof addMemberSchema>;

export const editMemberSchema = z.object({
  role: z.enum(MEMBER_ROLES, {
    errorMap: () => ({ message: 'Selecciona un rol válido.' }),
  }),
});

export type EditMemberValues = z.infer<typeof editMemberSchema>;
