import { FaCheck, FaUserTie } from 'react-icons/fa6';
import { boardMembers } from '@/components/admin/mock-data';
import {
  ActionRow,
  Panel,
  PrimaryButton,
  TextField,
} from '@/components/admin/ui';

export default function BoardAdminSection() {
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
          <TextField label='Nombre' value='Alex Prieto' />
          <TextField label='Cargo EN' value='President' />
          <TextField label='Cargo ES' value='Presidente' />
          <TextField label='Foto' value='/board/alex-prieto.webp' />
          <TextField
            label='Descripcion'
            value='Co-Founder with 26 years of experience in the toy industry.'
            multiline
          />
          <PrimaryButton icon={FaCheck}>Guardar miembro</PrimaryButton>
        </div>
      </Panel>
    </div>
  );
}
