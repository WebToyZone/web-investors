'use server';

import { auth } from '@/auth';
import {
  listAdminUsers,
  regenerateAdminUserPassword,
  type AdminUserSummary,
} from '@/services/admin-users/admin-users.service';
import { sendAdminUserPasswordResetEmail } from '@/services/email/send-admin-user-created-email';

export type ResendAdminUserPasswordResponse = {
  success?: string;
  error?: string;
  users?: AdminUserSummary[];
};

export async function resendAdminUserPasswordAction(
  id: number,
): Promise<ResendAdminUserPasswordResponse> {
  const session = await auth();
  if (!session?.user) {
    return { error: 'No autorizado.' };
  }

  try {
    const { user, temporaryPassword } = await regenerateAdminUserPassword(id);

    await sendAdminUserPasswordResetEmail({
      name: user.name,
      email: user.email,
      temporaryPassword,
    });

    const users = await listAdminUsers();

    return {
      success: `Se envio una nueva contrasena a ${user.email}.`,
      users,
    };
  } catch (error) {
    console.error('Admin user password resend error:', error);
    return { error: 'No se pudo reenviar la contraseña.' };
  }
}
