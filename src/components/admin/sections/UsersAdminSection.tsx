'use client';

import { useState } from 'react';
import { FaCheck, FaPaperPlane, FaPlus, FaTrash } from 'react-icons/fa6';
import { createAdminUserAction } from '@/actions/admin-users/create-admin-user';
import { deleteAdminUserAction } from '@/actions/admin-users/delete-admin-user';
import { resendAdminUserPasswordAction } from '@/actions/admin-users/resend-admin-user-password';
import { updateAdminUserAction } from '@/actions/admin-users/update-admin-user';
import type { AdminUserSummary } from '@/services/admin-users/admin-users.service';
import {
  FormNotice,
  IconButton,
  Panel,
  PrimaryButton,
  TextField,
} from '@/components/admin/ui';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(
    new Date(iso),
  );
}

function UserRow({
  user,
  isCurrentUser,
  disableDelete,
  onSaved,
  onNotice,
}: {
  user: AdminUserSummary;
  isCurrentUser: boolean;
  disableDelete: boolean;
  onSaved: (users: AdminUserSummary[]) => void;
  onNotice: (notice: { tone: 'neutral' | 'danger'; message: string }) => void;
}) {
  const [name, setName] = useState(user.name);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const dirty = name.trim() !== user.name;

  async function handleSaveName() {
    if (!name.trim()) {
      onNotice({ tone: 'danger', message: 'El nombre no puede estar vacio.' });
      return;
    }

    setIsSaving(true);
    const result = await updateAdminUserAction({ id: user.id, name: name.trim() });
    setIsSaving(false);

    if (result.users) {
      onSaved(result.users);
    }
    onNotice({
      tone: result.error ? 'danger' : 'neutral',
      message: result.error ?? result.success ?? '',
    });
  }

  async function handleDelete() {
    if (
      !window.confirm(`Eliminar a ${user.name} (${user.email})? Esta accion no se puede deshacer.`)
    ) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteAdminUserAction(user.id);
    setIsDeleting(false);

    if (result.users) {
      onSaved(result.users);
    }
    onNotice({
      tone: result.error ? 'danger' : 'neutral',
      message: result.error ?? result.success ?? '',
    });
  }

  async function handleResendPassword() {
    setIsResending(true);
    const result = await resendAdminUserPasswordAction(user.id);
    setIsResending(false);

    if (result.users) {
      onSaved(result.users);
    }
    onNotice({
      tone: result.error ? 'danger' : 'neutral',
      message: result.error ?? result.success ?? '',
    });
  }

  const deleteDisabled = isCurrentUser || disableDelete || isDeleting;
  const deleteTitle = isCurrentUser
    ? 'No podes eliminar tu propia cuenta'
    : disableDelete
      ? 'No se puede eliminar el ultimo usuario'
      : 'Eliminar';

  return (
    <div className='grid gap-3 rounded-md border border-neutral-200 p-3 md:grid-cols-[1fr_1fr_auto] md:items-end'>
      <TextField
        label='Nombre'
        value={name}
        onChange={setName}
      />
      <TextField label='Email' value={user.email} />
      <div className='flex items-center gap-2 md:justify-end'>
        <IconButton
          label='Guardar nombre'
          onClick={handleSaveName}
          disabled={!dirty || isSaving}
        >
          <FaCheck className='h-4 w-4' />
        </IconButton>
        <IconButton
          label='Reenviar contrasena'
          onClick={handleResendPassword}
          disabled={isResending}
        >
          <FaPaperPlane className='h-4 w-4' />
        </IconButton>
        <IconButton
          label={deleteTitle}
          onClick={handleDelete}
          disabled={deleteDisabled}
        >
          <FaTrash className='h-4 w-4' />
        </IconButton>
      </div>
      <p className='text-xs text-neutral-500 md:col-span-3'>
        Creado el {formatDate(user.createdAt)}
        {isCurrentUser ? ' - Este sos vos' : ''}
      </p>
    </div>
  );
}

export default function UsersAdminSection({
  initialUsers,
  currentUserId,
}: {
  initialUsers: AdminUserSummary[];
  currentUserId: number;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [notice, setNotice] = useState<{
    tone: 'neutral' | 'danger';
    message: string;
  } | null>(null);

  async function handleCreate() {
    if (!name.trim() || !email.trim()) {
      setNotice({ tone: 'danger', message: 'Completa nombre y email.' });
      return;
    }

    setIsCreating(true);
    const result = await createAdminUserAction({
      name: name.trim(),
      email: email.trim(),
    });
    setIsCreating(false);

    if (result.users) {
      setUsers(result.users);
    }
    if (!result.error) {
      setName('');
      setEmail('');
    }
    setNotice({
      tone: result.error ? 'danger' : 'neutral',
      message: result.error ?? result.success ?? '',
    });
  }

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <Panel title='Usuarios con acceso' eyebrow='Cuentas'>
        <div className='space-y-3'>
          {notice?.message ? (
            <FormNotice tone={notice.tone}>{notice.message}</FormNotice>
          ) : null}
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isCurrentUser={user.id === currentUserId}
              disableDelete={users.length <= 1}
              onSaved={setUsers}
              onNotice={setNotice}
            />
          ))}
        </div>
      </Panel>

      <Panel title='Agregar usuario' eyebrow='Nuevo acceso'>
        <div className='space-y-4'>
          <TextField
            label='Nombre'
            name='new-user-name'
            autoComplete='off'
            value={name}
            onChange={setName}
          />
          <TextField
            label='Email'
            name='new-user-email'
            autoComplete='off'
            value={email}
            onChange={setEmail}
            type='email'
          />
          <p className='text-xs text-neutral-500'>
            Se genera una contrasena temporal y se envia por email a esta
            direccion junto con el link de acceso.
          </p>
          <PrimaryButton icon={FaPlus} onClick={handleCreate} disabled={isCreating}>
            {isCreating ? 'Creando...' : 'Crear usuario'}
          </PrimaryButton>
        </div>
      </Panel>
    </div>
  );
}
