'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaArrowUpFromBracket,
  FaCheck,
  FaPen,
  FaPlus,
  FaTrashCan,
  FaUserTie,
  FaXmark,
} from 'react-icons/fa6';
import type {
  AdminContent,
  BoardMember,
  PendingBoardSeat,
} from '@/components/admin/types';
import {
  FormNotice,
  IconButton,
  Panel,
  PrimaryButton,
  SecondaryButton,
  TextField,
} from '@/components/admin/ui';

type MemberDraft = {
  name: string;
  image: string;
  translations: BoardMember['translations'];
};

function createDefaultMemberDraft(): MemberDraft {
  return {
    name: '',
    image: '',
    translations: {
      en: { role: '', description: '' },
      es: { role: '', description: '' },
    },
  };
}

type SeatDraft = {
  name: string;
  image: string;
  translations: PendingBoardSeat['translations'];
};

function createDefaultSeatDraft(): SeatDraft {
  return {
    name: 'TBC',
    image: '',
    translations: {
      en: { role: '' },
      es: { role: '' },
    },
  };
}

function PhotoUploadField({
  image,
  onUpload,
  onClear,
}: {
  image: string;
  onUpload: (file: File | undefined) => void;
  onClear: () => void;
}) {
  return (
    <div className='space-y-3'>
      <span className='block text-xs font-bold uppercase text-neutral-500'>
        Foto
      </span>
      {image ? (
        <div className='flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2'>
          <div className='flex min-w-0 items-center gap-3'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=''
              className='h-10 w-10 shrink-0 rounded-full border border-neutral-200 bg-white object-cover'
            />
            <span className='truncate text-xs text-neutral-600'>{image}</span>
          </div>
          <IconButton label='Quitar foto' onClick={onClear}>
            <FaXmark className='h-4 w-4' />
          </IconButton>
        </div>
      ) : (
        <div className='flex h-28 flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 text-center'>
          <FaArrowUpFromBracket className='h-6 w-6 text-brand' />
          <p className='mt-2 text-xs font-bold text-neutral-950'>
            Sube una foto
          </p>
          <input
            type='file'
            accept='image/*'
            onChange={(event) => onUpload(event.target.files?.[0])}
            className='mt-3 max-w-full text-xs text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white'
          />
        </div>
      )}
    </div>
  );
}

export default function BoardAdminSection({
  data,
  onChange,
  onSave,
  isSaving,
  createRequestId,
}: {
  data: AdminContent['board'];
  onChange: (value: AdminContent['board']) => void;
  onSave: () => void;
  isSaving: boolean;
  createRequestId: number;
}) {
  const { members: boardMembers, pendingSeats } = data;

  const [formMode, setFormMode] = useState<'new' | 'edit'>('new');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<MemberDraft>(() =>
    createDefaultMemberDraft(),
  );
  const [validationError, setValidationError] = useState('');
  const pendingSaveRef = useRef(false);

  const [seatFormMode, setSeatFormMode] = useState<'new' | 'edit'>('new');
  const [editingSeatId, setEditingSeatId] = useState<number | null>(null);
  const [seatDraft, setSeatDraft] = useState<SeatDraft>(() =>
    createDefaultSeatDraft(),
  );
  const [seatValidationError, setSeatValidationError] = useState('');
  const pendingSeatSaveRef = useRef(false);

  function startNewMember() {
    setFormMode('new');
    setEditingId(null);
    setDraft(createDefaultMemberDraft());
    setValidationError('');
  }

  function startEditMember(member: BoardMember) {
    setFormMode('edit');
    setEditingId(member.id);
    setDraft({
      name: member.name,
      image: member.image,
      translations: {
        en: { ...member.translations.en },
        es: { ...member.translations.es },
      },
    });
    setValidationError('');
  }

  function updateName(name: string) {
    setValidationError('');
    setDraft((current) => ({ ...current, name }));
  }

  function updateTranslation(
    locale: 'en' | 'es',
    patch: Partial<BoardMember['translations']['en']>,
  ) {
    setValidationError('');
    setDraft((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: { ...current.translations[locale], ...patch },
      },
    }));
  }

  function handleImageChange(file: File | undefined) {
    if (!file) {
      return;
    }

    // Local-only for now: stores the file name as the public path. The
    // actual upload to AWS storage will replace this once wired up.
    setValidationError('');
    setDraft((current) => ({ ...current, image: `/board/${file.name}` }));
  }

  function clearImage() {
    setDraft((current) => ({ ...current, image: '' }));
  }

  function startNewSeat() {
    setSeatFormMode('new');
    setEditingSeatId(null);
    setSeatDraft(createDefaultSeatDraft());
    setSeatValidationError('');
  }

  function startEditSeat(seat: PendingBoardSeat) {
    setSeatFormMode('edit');
    setEditingSeatId(seat.id);
    setSeatDraft({
      name: seat.name,
      image: seat.image,
      translations: {
        en: { ...seat.translations.en },
        es: { ...seat.translations.es },
      },
    });
    setSeatValidationError('');
  }

  function updateSeatName(name: string) {
    setSeatValidationError('');
    setSeatDraft((current) => ({ ...current, name }));
  }

  function updateSeatTranslation(locale: 'en' | 'es', role: string) {
    setSeatValidationError('');
    setSeatDraft((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: { role },
      },
    }));
  }

  function handleSeatImageChange(file: File | undefined) {
    if (!file) {
      return;
    }

    // Local-only for now: stores the file name as the public path. The
    // actual upload to AWS storage will replace this once wired up.
    setSeatValidationError('');
    setSeatDraft((current) => ({ ...current, image: `/board/${file.name}` }));
  }

  function clearSeatImage() {
    setSeatDraft((current) => ({ ...current, image: '' }));
  }

  const lastCreateRequestId = useRef(createRequestId);

  useEffect(() => {
    if (createRequestId === lastCreateRequestId.current) {
      return;
    }

    lastCreateRequestId.current = createRequestId;
    startNewMember();
  }, [createRequestId]);

  useEffect(() => {
    if (!pendingSaveRef.current) {
      return;
    }

    pendingSaveRef.current = false;
    onSave();
  }, [boardMembers, onSave]);

  useEffect(() => {
    if (!pendingSeatSaveRef.current) {
      return;
    }

    pendingSeatSaveRef.current = false;
    onSave();
  }, [pendingSeats, onSave]);

  function deleteMember(id: number) {
    const nextMembers = boardMembers.filter((member) => member.id !== id);
    onChange({ ...data, members: nextMembers });

    if (editingId === id) {
      startNewMember();
    }
  }

  function moveMember(id: number, direction: -1 | 1) {
    const currentIndex = boardMembers.findIndex((member) => member.id === id);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= boardMembers.length) {
      return;
    }

    const nextMembers = [...boardMembers];
    const currentMember = nextMembers[currentIndex];
    nextMembers[currentIndex] = nextMembers[nextIndex];
    nextMembers[nextIndex] = currentMember;

    onChange({ ...data, members: nextMembers });
    setValidationError('');
  }

  function handleSave() {
    if (
      !draft.name.trim() ||
      !draft.image.trim() ||
      !draft.translations.en.role.trim() ||
      !draft.translations.es.role.trim()
    ) {
      setValidationError(
        'Completa nombre, foto y cargo en ambos idiomas antes de guardar.',
      );
      return;
    }

    const nextMembers =
      formMode === 'edit' && editingId !== null
        ? boardMembers.map((member) =>
            member.id === editingId ? { ...member, ...draft } : member,
          )
        : [
            ...boardMembers,
            {
              id: Math.max(0, ...boardMembers.map((member) => member.id)) + 1,
              ...draft,
            },
          ];

    pendingSaveRef.current = true;
    onChange({ ...data, members: nextMembers });
    startNewMember();
  }

  function deleteSeat(id: number) {
    const nextSeats = pendingSeats.filter((seat) => seat.id !== id);
    onChange({ ...data, pendingSeats: nextSeats });

    if (editingSeatId === id) {
      startNewSeat();
    }
  }

  function moveSeat(id: number, direction: -1 | 1) {
    const currentIndex = pendingSeats.findIndex((seat) => seat.id === id);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= pendingSeats.length) {
      return;
    }

    const nextSeats = [...pendingSeats];
    const currentSeat = nextSeats[currentIndex];
    nextSeats[currentIndex] = nextSeats[nextIndex];
    nextSeats[nextIndex] = currentSeat;

    onChange({ ...data, pendingSeats: nextSeats });
    setSeatValidationError('');
  }

  function handleSaveSeat() {
    if (
      !seatDraft.name.trim() ||
      !seatDraft.image.trim() ||
      !seatDraft.translations.en.role.trim() ||
      !seatDraft.translations.es.role.trim()
    ) {
      setSeatValidationError(
        'Completa nombre, foto y cargo en ambos idiomas antes de guardar.',
      );
      return;
    }

    const nextSeats =
      seatFormMode === 'edit' && editingSeatId !== null
        ? pendingSeats.map((seat) =>
            seat.id === editingSeatId ? { ...seat, ...seatDraft } : seat,
          )
        : [
            ...pendingSeats,
            {
              id: Math.max(0, ...pendingSeats.map((seat) => seat.id)) + 1,
              ...seatDraft,
            },
          ];

    pendingSeatSaveRef.current = true;
    onChange({ ...data, pendingSeats: nextSeats });
    startNewSeat();
  }

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <div className='space-y-5'>
        <Panel title='Miembros del consejo' eyebrow='Board'>
          <div className='grid gap-3 lg:grid-cols-3'>
            {boardMembers.map((member, index) => (
              <div
                key={member.id}
                className={`rounded-md border p-4 ${
                  formMode === 'edit' && editingId === member.id
                    ? 'border-brand bg-red-50/40'
                    : 'border-neutral-200'
                }`}
              >
                <button
                  type='button'
                  onClick={() => startEditMember(member)}
                  className='block w-full text-left'
                >
                  {member.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.image}
                      alt=''
                      className='h-20 w-20 rounded-full border border-neutral-200 object-cover'
                    />
                  ) : (
                    <div className='flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-brand'>
                      <FaUserTie className='h-9 w-9' />
                    </div>
                  )}
                  <p className='mt-4 text-lg font-black text-neutral-950'>
                    {member.name}
                  </p>
                  <p className='text-sm font-bold text-brand'>
                    {member.translations.en.role}
                  </p>
                  <p className='mt-2 text-xs text-neutral-500'>
                    ES: {member.translations.es.role}
                  </p>
                </button>
                <div className='mt-4 flex justify-end gap-2'>
                  <IconButton
                    label='Editar'
                    onClick={() => startEditMember(member)}
                  >
                    <FaPen className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Subir'
                    onClick={() => moveMember(member.id, -1)}
                    disabled={index <= 0}
                  >
                    <FaArrowUp className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Bajar'
                    onClick={() => moveMember(member.id, 1)}
                    disabled={index === boardMembers.length - 1}
                  >
                    <FaArrowDown className='h-4 w-4' />
                  </IconButton>
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
          </div>
        </Panel>

        <Panel title='Asientos pendientes' eyebrow='TBC'>
          <div className='flex items-center justify-between gap-3 border-b border-neutral-200 pb-4'>
            <p className='text-sm text-neutral-600'>
              Cargos aun sin nombrar, ej. Secretary, Financial Representative,
              Industry Representative.
            </p>
            <SecondaryButton icon={FaPlus} onClick={startNewSeat}>
              Nuevo asiento
            </SecondaryButton>
          </div>

          <div className='mt-4 grid gap-3 lg:grid-cols-3'>
            {pendingSeats.map((seat, index) => (
              <div
                key={seat.id}
                className={`rounded-md border p-4 ${
                  seatFormMode === 'edit' && editingSeatId === seat.id
                    ? 'border-brand bg-red-50/40'
                    : 'border-neutral-200'
                }`}
              >
                <button
                  type='button'
                  onClick={() => startEditSeat(seat)}
                  className='block w-full text-left'
                >
                  {seat.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={seat.image}
                      alt=''
                      className='h-20 w-20 rounded-full border border-neutral-200 object-cover'
                    />
                  ) : (
                    <div className='flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-brand'>
                      <FaUserTie className='h-9 w-9' />
                    </div>
                  )}
                  <p className='mt-4 text-lg font-black text-neutral-950'>
                    {seat.name}
                  </p>
                  <p className='text-sm font-bold text-brand'>
                    {seat.translations.en.role}
                  </p>
                  <p className='mt-2 text-xs text-neutral-500'>
                    ES: {seat.translations.es.role}
                  </p>
                </button>
                <div className='mt-4 flex justify-end gap-2'>
                  <IconButton label='Editar' onClick={() => startEditSeat(seat)}>
                    <FaPen className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Subir'
                    onClick={() => moveSeat(seat.id, -1)}
                    disabled={index <= 0}
                  >
                    <FaArrowUp className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Bajar'
                    onClick={() => moveSeat(seat.id, 1)}
                    disabled={index === pendingSeats.length - 1}
                  >
                    <FaArrowDown className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Eliminar'
                    onClick={() => deleteSeat(seat.id)}
                    disabled={pendingSeats.length === 1}
                  >
                    <FaTrashCan className='h-4 w-4' />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className='space-y-5'>
        <Panel title='Editor miembro' eyebrow='Persona'>
          <div className='space-y-4'>
            {validationError ? (
              <FormNotice tone='danger'>{validationError}</FormNotice>
            ) : null}
            <h3 className='text-xl font-black text-neutral-950'>
              {formMode === 'edit' ? 'Editar miembro' : 'Nuevo miembro'}
            </h3>

            <PhotoUploadField
              image={draft.image}
              onUpload={handleImageChange}
              onClear={clearImage}
            />

            <TextField
              label='Nombre (comun a ambos idiomas)'
              value={draft.name}
              onChange={updateName}
            />

            <div className='space-y-3 rounded-md border border-neutral-200 p-3'>
              <span className='text-xs font-bold uppercase text-neutral-500'>
                Ingles
              </span>
              <TextField
                label='Cargo'
                value={draft.translations.en.role}
                onChange={(role) => updateTranslation('en', { role })}
              />
              <TextField
                label='Descripcion'
                multiline
                value={draft.translations.en.description}
                onChange={(description) =>
                  updateTranslation('en', { description })
                }
              />
            </div>

            <div className='space-y-3 rounded-md border border-neutral-200 p-3'>
              <span className='text-xs font-bold uppercase text-neutral-500'>
                Espanol
              </span>
              <TextField
                label='Cargo'
                value={draft.translations.es.role}
                onChange={(role) => updateTranslation('es', { role })}
              />
              <TextField
                label='Descripcion'
                multiline
                value={draft.translations.es.description}
                onChange={(description) =>
                  updateTranslation('es', { description })
                }
              />
            </div>

            <PrimaryButton icon={FaCheck} onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </PrimaryButton>
          </div>
        </Panel>

        <Panel title='Editor asiento pendiente' eyebrow='TBC'>
          <div className='space-y-4'>
            {seatValidationError ? (
              <FormNotice tone='danger'>{seatValidationError}</FormNotice>
            ) : null}
            <h3 className='text-xl font-black text-neutral-950'>
              {seatFormMode === 'edit' ? 'Editar asiento' : 'Nuevo asiento'}
            </h3>

            <PhotoUploadField
              image={seatDraft.image}
              onUpload={handleSeatImageChange}
              onClear={clearSeatImage}
            />

            <TextField
              label='Nombre (comun a ambos idiomas)'
              value={seatDraft.name}
              onChange={updateSeatName}
            />

            <TextField
              label='Cargo (Ingles)'
              value={seatDraft.translations.en.role}
              onChange={(role) => updateSeatTranslation('en', role)}
            />
            <TextField
              label='Cargo (Espanol)'
              value={seatDraft.translations.es.role}
              onChange={(role) => updateSeatTranslation('es', role)}
            />

            <PrimaryButton
              icon={FaCheck}
              onClick={handleSaveSeat}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </PrimaryButton>
          </div>
        </Panel>
      </div>
    </div>
  );
}
