import { FaCheck, FaUserTie } from 'react-icons/fa6';
import type { AdminContent, BoardMember } from '@/components/admin/types';
import {
  ActionRow,
  Panel,
  PrimaryButton,
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
  const selectedMember = boardMembers[0];

  function updateMember(id: number, patch: Partial<BoardMember>) {
    onChange({
      members: boardMembers.map((member) =>
        member.id === id ? { ...member, ...patch } : member,
      ),
    });
  }

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <Panel title='Miembros del consejo' eyebrow='Board'>
        <div className='grid gap-3 lg:grid-cols-3'>
          {boardMembers.map((member) => (
            <div
              key={member.id}
              className='rounded-md border border-neutral-200 p-4'
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
              <div className='mt-4 flex items-center justify-between gap-3'>
                <span className='rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-700'>
                  {member.status === 'appointed' ? 'Nombrado' : 'Pendiente'}
                </span>
                <ActionRow />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title='Editor miembro' eyebrow='Persona'>
        <div className='space-y-4'>
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
          <TextField
            label='Descripcion'
            value='Co-Founder with 26 years of experience in the toy industry.'
            multiline
          />
          <PrimaryButton icon={FaCheck} onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar JSON'}
          </PrimaryButton>
        </div>
      </Panel>
    </div>
  );
}
