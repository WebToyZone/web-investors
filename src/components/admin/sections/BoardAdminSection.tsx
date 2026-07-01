'use client';

import { useState } from 'react';
import { FaCheck, FaPlus, FaTrashCan, FaUserTie } from 'react-icons/fa6';
import type { AdminContent, BoardMember } from '@/components/admin/types';
import {
  FormNotice,
  IconButton,
  Panel,
  PrimaryButton,
  SecondaryButton,
  SelectField,
  TextField,
} from '@/components/admin/ui';

export default function BoardAdminSection({
  data,
  onChange,
  onSave,
  isSaving,
}: {
  data: AdminContent['board'];
  onChange: (value: AdminContent['board']) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  const { members: boardMembers } = data;
  const [selectedMemberId, setSelectedMemberId] = useState(
    boardMembers[0]?.id ?? 0,
  );
  const [validationError, setValidationError] = useState('');
  const selectedMember =
    boardMembers.find((member) => member.id === selectedMemberId) ??
    boardMembers[0];

  function updateMember(id: number, patch: Partial<BoardMember>) {
    setValidationError('');
    onChange({
      members: boardMembers.map((member) =>
        member.id === id ? { ...member, ...patch } : member,
      ),
    });
  }

  function addMember() {
    const nextId = Math.max(0, ...boardMembers.map((member) => member.id)) + 1;
    const nextMember: BoardMember = {
      id: nextId,
      name: 'Nuevo miembro',
      role: 'Cargo pendiente',
      status: 'pending',
      locale: 'en',
      image: '/board/tbc.webp',
    };

    setSelectedMemberId(nextId);
    onChange({ members: [...boardMembers, nextMember] });
    setValidationError('');
  }

  function deleteMember(id: number) {
    const nextMembers = boardMembers.filter((member) => member.id !== id);
    setSelectedMemberId(nextMembers[0]?.id ?? 0);
    onChange({ members: nextMembers });
    setValidationError('');
  }

  function handleSave() {
    if (!boardMembers.length) {
      setValidationError('Debe existir al menos un miembro del board.');
      return;
    }

    const invalidMember = boardMembers.find(
      (member) =>
        !member.name.trim() || !member.role.trim() || !member.image.trim(),
    );

    if (invalidMember) {
      setSelectedMemberId(invalidMember.id);
      setValidationError('Completa nombre, cargo y foto antes de guardar.');
      return;
    }

    setValidationError('');
    onSave();
  }

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <Panel title='Miembros del consejo' eyebrow='Board'>
        <div className='grid gap-3 lg:grid-cols-3'>
          {boardMembers.map((member) => (
            <div
              key={member.id}
              className={`rounded-md border p-4 ${
                selectedMember?.id === member.id
                  ? 'border-brand bg-red-50/40'
                  : 'border-neutral-200'
              }`}
            >
              <button
                type='button'
                onClick={() => setSelectedMemberId(member.id)}
                className='block w-full text-left'
              >
                <div className='flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-brand'>
                  <FaUserTie className='h-9 w-9' />
                </div>
                <p className='mt-4 text-lg font-black text-neutral-950'>
                  {member.name}
                </p>
                <p className='text-sm font-bold text-brand'>{member.role}</p>
                <p className='mt-2 text-xs text-neutral-500'>
                  {member.status} - {member.locale.toUpperCase()} - {member.image}
                </p>
              </button>
              <div className='mt-4 flex items-center justify-between gap-3'>
                <span className='rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-700'>
                  {member.status === 'appointed' ? 'Nombrado' : 'Pendiente'}
                </span>
                <IconButton
                  label='Eliminar'
                  onClick={() => deleteMember(member.id)}
                  disabled={boardMembers.length === 1}
                >
                  <FaTrashCan className='h-4 w-4' />
                </IconButton>
              </div>
            </div>
          ))}
          <button
            type='button'
            onClick={addMember}
            className='flex min-h-56 flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-white p-4 text-center text-brand transition-colors hover:border-brand hover:bg-red-50/40'
          >
            <FaPlus className='h-6 w-6' />
            <span className='mt-2 text-sm font-black'>Anadir miembro</span>
          </button>
        </div>
      </Panel>

      <Panel title='Editor miembro' eyebrow='Persona'>
        {selectedMember ? (
          <div className='space-y-4'>
            {validationError ? (
              <FormNotice tone='danger'>{validationError}</FormNotice>
            ) : null}
            <TextField
              label='Nombre'
              value={selectedMember.name}
              onChange={(name) => updateMember(selectedMember.id, { name })}
            />
            <TextField
              label='Cargo'
              value={selectedMember.role}
              onChange={(role) => updateMember(selectedMember.id, { role })}
            />
            <TextField
              label='Foto'
              value={selectedMember.image}
              onChange={(image) => updateMember(selectedMember.id, { image })}
            />
            <SelectField
              label='Idioma'
              value={selectedMember.locale}
              options={[
                { label: 'English', value: 'en' },
                { label: 'Espanol', value: 'es' },
              ]}
              onChange={(locale) =>
                updateMember(selectedMember.id, {
                  locale: locale as BoardMember['locale'],
                })
              }
            />
            <SelectField
              label='Estado'
              value={selectedMember.status}
              options={[
                { label: 'Nombrado', value: 'appointed' },
                { label: 'Pendiente', value: 'pending' },
              ]}
              onChange={(status) =>
                updateMember(selectedMember.id, {
                  status: status as BoardMember['status'],
                })
              }
            />
            <div className='grid grid-cols-2 gap-3'>
              <SecondaryButton icon={FaPlus} onClick={addMember}>
                Nuevo
              </SecondaryButton>
              <PrimaryButton
                icon={FaCheck}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Guardar JSON'}
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            <FormNotice tone='danger'>No hay miembros configurados.</FormNotice>
            <PrimaryButton icon={FaPlus} onClick={addMember}>
              Crear miembro
            </PrimaryButton>
          </div>
        )}
      </Panel>
    </div>
  );
}
