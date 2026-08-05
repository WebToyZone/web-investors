import { z } from 'zod';

export const CreateAdminUserSchema = z.object({
  name: z.string().trim().min(2, 'El nombre es requerido').max(100, 'Nombre demasiado largo'),
  email: z.string().trim().email('Email inválido').max(120, 'Email demasiado largo'),
});

export type CreateAdminUserInput = z.infer<typeof CreateAdminUserSchema>;

export const UpdateAdminUserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(2, 'El nombre es requerido').max(100, 'Nombre demasiado largo'),
});

export type UpdateAdminUserInput = z.infer<typeof UpdateAdminUserSchema>;
