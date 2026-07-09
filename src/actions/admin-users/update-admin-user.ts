'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { UpdateAdminUserSchema } from '@/schemas/admin-user.schema';
import {
  listAdminUsers,
  updateAdminUserName,
  type AdminUserSummary,
} from '@/services/admin-users/admin-users.service';

export type UpdateAdminUserResponse = {
  success?: string;
  error?: string;
  users?: AdminUserSummary[];
};

export async function updateAdminUserAction(
  input: unknown,
): Promise<UpdateAdminUserResponse> {
  const session = await auth();
  if (!session?.user) {
    return { error: 'No autorizado.' };
  }

  const parsed = UpdateAdminUserSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos invalidos.' };
  }

  try {
    await updateAdminUserName(parsed.data.id, parsed.data.name);
    const users = await listAdminUsers();
    revalidatePath('/admin');

    return { success: 'Usuario actualizado.', users };
  } catch (error) {
    console.error('Admin user update error:', error);
    return { error: 'No se pudo actualizar el usuario.' };
  }
}
