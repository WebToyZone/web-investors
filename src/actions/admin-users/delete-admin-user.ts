'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import {
  CannotDeleteLastUserError,
  CannotDeleteSelfError,
  deleteAdminUser,
  listAdminUsers,
  type AdminUserSummary,
} from '@/services/admin-users/admin-users.service';

export type DeleteAdminUserResponse = {
  success?: string;
  error?: string;
  users?: AdminUserSummary[];
};

export async function deleteAdminUserAction(
  id: number,
): Promise<DeleteAdminUserResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'No autorizado.' };
  }

  try {
    await deleteAdminUser(id, Number(session.user.id));
    const users = await listAdminUsers();
    revalidatePath('/admin');

    return { success: 'Usuario eliminado.', users };
  } catch (error) {
    if (
      error instanceof CannotDeleteSelfError ||
      error instanceof CannotDeleteLastUserError
    ) {
      return { error: error.message };
    }

    console.error('Admin user delete error:', error);
    return { error: 'No se pudo eliminar el usuario.' };
  }
}
