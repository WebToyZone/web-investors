'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { CreateAdminUserSchema } from '@/schemas/admin-user.schema';
import {
  createAdminUser,
  EmailAlreadyInUseError,
  listAdminUsers,
  type AdminUserSummary,
} from '@/services/admin-users/admin-users.service';
import { sendAdminUserCreatedEmail } from '@/services/email/send-admin-user-created-email';

export type CreateAdminUserResponse = {
  success?: string;
  error?: string;
  users?: AdminUserSummary[];
};

export async function createAdminUserAction(
  input: unknown,
): Promise<CreateAdminUserResponse> {
  const session = await auth();
  if (!session?.user) {
    return { error: 'No autorizado.' };
  }

  const parsed = CreateAdminUserSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  try {
    const { user, temporaryPassword } = await createAdminUser(parsed.data);

    try {
      await sendAdminUserCreatedEmail({
        name: user.name,
        email: user.email,
        temporaryPassword,
      });
    } catch (emailError) {
      console.error('Admin user created but email failed to send:', emailError);
      const users = await listAdminUsers();
      return {
        error:
          'El usuario se creó pero no se pudo enviar el email de notificación.',
        users,
      };
    }

    const users = await listAdminUsers();
    revalidatePath('/admin');

    return {
      success: `Usuario creado. Se envio la contrasena a ${user.email}.`,
      users,
    };
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError) {
      return { error: error.message };
    }

    console.error('Admin user create error:', error);
    return { error: 'No se pudo crear el usuario.' };
  }
}
