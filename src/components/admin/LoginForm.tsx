'use client';

import { useActionState } from 'react';
import { FaRightToBracket } from 'react-icons/fa6';
import { signInWithCredentials } from '@/actions/auth/sign-in';
import { FormNotice, PrimaryButton, TextField } from './ui';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    signInWithCredentials,
    undefined,
  );

  return (
    <form action={formAction} className='space-y-4'>
      {state?.error ? <FormNotice tone='danger'>{state.error}</FormNotice> : null}

      <TextField
        label='Correo electronico'
        name='email'
        type='email'
        autoComplete='username'
      />
      <TextField
        label='Contrasena'
        name='password'
        type='password'
        autoComplete='current-password'
      />

      <PrimaryButton icon={FaRightToBracket} type='submit' disabled={isPending}>
        {isPending ? 'Entrando...' : 'Entrar'}
      </PrimaryButton>
    </form>
  );
}
