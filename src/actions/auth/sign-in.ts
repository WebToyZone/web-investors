'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export type SignInResponse = {
  error?: string;
};

export async function signInWithCredentials(
  _prevState: SignInResponse | undefined,
  formData: FormData,
): Promise<SignInResponse> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/admin',
    });

    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Credenciales inválidas.' };
    }

    throw error;
  }
}
