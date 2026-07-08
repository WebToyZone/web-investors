import { redirect } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';
import { auth } from '@/auth';

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect('/admin');
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-neutral-100 px-5'>
      <div className='w-full max-w-sm rounded-md border border-neutral-200 bg-white p-8'>
        <p className='font-heading text-4xl leading-none text-brand'>EOLO</p>
        <p className='mt-1 text-sm font-bold uppercase text-neutral-500'>
          Investors admin
        </p>

        <h1 className='mt-6 text-xl font-black text-neutral-950'>
          Iniciar sesion
        </h1>

        <div className='mt-6'>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
