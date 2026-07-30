'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaCheck,
  FaPen,
  FaTrashCan,
} from 'react-icons/fa6';
import type {
  AdminContent,
  GrowthMilestone,
  GrowthRevenue,
} from '@/components/admin/types';
import {
  FormNotice,
  IconButton,
  Panel,
  PrimaryButton,
  TextField,
} from '@/components/admin/ui';

type MilestoneDraft = {
  translations: GrowthMilestone['translations'];
};

function createDefaultDraft(): MilestoneDraft {
  return {
    translations: {
      en: { title: '', description: '' },
      es: { title: '', description: '' },
    },
  };
}

export default function GrowthAdminSection({
  data,
  onChange,
  onSave,
  isSaving,
  createRequestId,
}: {
  data: AdminContent['growth'];
  onChange: (value: AdminContent['growth']) => void;
  onSave: () => void;
  isSaving: boolean;
  createRequestId: number;
}) {
  const { revenue, milestones } = data;

  const [formMode, setFormMode] = useState<'new' | 'edit'>('new');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<MilestoneDraft>(() =>
    createDefaultDraft(),
  );
  const [validationError, setValidationError] = useState('');
  const pendingSaveRef = useRef(false);

  function updateRevenue(index: number, patch: Partial<GrowthRevenue>) {
    setValidationError('');
    onChange({
      ...data,
      revenue: revenue.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });
  }

  function startNewMilestone() {
    setFormMode('new');
    setEditingId(null);
    setDraft(createDefaultDraft());
    setValidationError('');
  }

  function startEditMilestone(milestone: GrowthMilestone) {
    setFormMode('edit');
    setEditingId(milestone.id);
    setDraft({
      translations: {
        en: { ...milestone.translations.en },
        es: { ...milestone.translations.es },
      },
    });
    setValidationError('');
  }

  function updateTranslation(
    locale: 'en' | 'es',
    patch: Partial<GrowthMilestone['translations']['en']>,
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

  const lastCreateRequestId = useRef(createRequestId);

  useEffect(() => {
    if (createRequestId === lastCreateRequestId.current) {
      return;
    }

    lastCreateRequestId.current = createRequestId;
    startNewMilestone();
  }, [createRequestId]);

  useEffect(() => {
    if (!pendingSaveRef.current) {
      return;
    }

    pendingSaveRef.current = false;
    onSave();
  }, [milestones, onSave]);

  function deleteMilestone(id: number) {
    const milestone = milestones.find((current) => current.id === id);
    if (
      !window.confirm(
        `Eliminar el milestone ${milestone?.translations.en.title ?? ''}? Esta accion no se puede deshacer.`,
      )
    ) {
      return;
    }

    const nextMilestones = milestones.filter((current) => current.id !== id);
    pendingSaveRef.current = true;
    onChange({ ...data, milestones: nextMilestones });

    if (editingId === id) {
      startNewMilestone();
    }
  }

  function moveMilestone(id: number, direction: -1 | 1) {
    const currentIndex = milestones.findIndex(
      (milestone) => milestone.id === id,
    );
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= milestones.length) {
      return;
    }

    const nextMilestones = [...milestones];
    const currentMilestone = nextMilestones[currentIndex];
    nextMilestones[currentIndex] = nextMilestones[nextIndex];
    nextMilestones[nextIndex] = currentMilestone;

    pendingSaveRef.current = true;
    onChange({ ...data, milestones: nextMilestones });
    setValidationError('');
  }

  function handleSaveRevenue() {
    const invalidRevenue = revenue.find(
      (item) =>
        !item.year.trim() || !item.currency.trim() || !item.value.trim(),
    );

    if (invalidRevenue) {
      setValidationError('Completa ano, moneda y valor en ingresos.');
      return;
    }

    setValidationError('');
    onSave();
  }

  function handleSaveMilestone() {
    if (
      !draft.translations.en.title.trim() ||
      !draft.translations.en.description.trim() ||
      !draft.translations.es.title.trim() ||
      !draft.translations.es.description.trim()
    ) {
      setValidationError(
        'Completa titulo y descripcion en ambos idiomas antes de guardar.',
      );
      return;
    }

    const nextMilestones =
      formMode === 'edit' && editingId !== null
        ? milestones.map((milestone) =>
            milestone.id === editingId
              ? { ...milestone, ...draft }
              : milestone,
          )
        : [
            ...milestones,
            {
              id:
                Math.max(0, ...milestones.map((milestone) => milestone.id)) +
                1,
              ...draft,
            },
          ];

    pendingSaveRef.current = true;
    onChange({ ...data, milestones: nextMilestones });
    startNewMilestone();
  }

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <div className='space-y-5'>
        <Panel title='Ingresos consolidados' eyebrow='Grafico'>
          <div className='grid gap-3 md:grid-cols-3'>
            {revenue.map((item, index) => (
              <div
                key={index}
                className='rounded-md border border-neutral-200 p-4'
              >
                <p className='mt-2 text-2xl font-black text-brand'>
                  {item.currency}
                  {item.value}
                </p>
                <TextField
                  label='Ano'
                  value={item.year}
                  onChange={(year) => updateRevenue(index, { year })}
                />
                <div className='grid grid-cols-[80px_1fr] gap-2'>
                  <TextField
                    label='Moneda'
                    value={item.currency}
                    onChange={(currency) => updateRevenue(index, { currency })}
                  />
                  <TextField
                    label='Valor numerico'
                    value={item.value}
                    onChange={(value) => updateRevenue(index, { value })}
                  />
                </div>
              </div>
            ))}
          </div>
          <PrimaryButton
            icon={FaCheck}
            onClick={handleSaveRevenue}
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </PrimaryButton>
        </Panel>

        <Panel title='Milestones' eyebrow='Timeline'>
          <div className='space-y-3'>
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`flex items-center justify-between gap-4 rounded-md border p-4 ${
                  formMode === 'edit' && editingId === milestone.id
                    ? 'border-brand bg-red-50/40'
                    : 'border-neutral-200'
                }`}
              >
                <button
                  type='button'
                  onClick={() => startEditMilestone(milestone)}
                  className='min-w-0 text-left'
                >
                  <p className='font-black text-neutral-950'>
                    {milestone.translations.en.title}
                  </p>
                  <p className='text-xs text-neutral-500'>
                    ES: {milestone.translations.es.title}
                  </p>
                </button>
                <div className='flex items-center gap-2'>
                  <IconButton
                    label='Editar'
                    onClick={() => startEditMilestone(milestone)}
                  >
                    <FaPen className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Subir'
                    onClick={() => moveMilestone(milestone.id, -1)}
                    disabled={index <= 0}
                  >
                    <FaArrowUp className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Bajar'
                    onClick={() => moveMilestone(milestone.id, 1)}
                    disabled={index === milestones.length - 1}
                  >
                    <FaArrowDown className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Eliminar'
                    onClick={() => deleteMilestone(milestone.id)}
                    disabled={milestones.length === 1}
                  >
                    <FaTrashCan className='h-4 w-4' />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title='Editor milestone' eyebrow='Growth Journey'>
        <div className='space-y-4'>
          {validationError ? (
            <FormNotice tone='danger'>{validationError}</FormNotice>
          ) : null}
          <h3 className='text-xl font-black text-neutral-950'>
            {formMode === 'edit' ? 'Editar milestone' : 'Nuevo milestone'}
          </h3>

          <div className='space-y-3 rounded-md border border-neutral-200 p-3'>
            <span className='text-xs font-bold uppercase text-neutral-500'>
              Ingles
            </span>
            <TextField
              label='Titulo'
              value={draft.translations.en.title}
              onChange={(title) => updateTranslation('en', { title })}
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
              label='Titulo'
              value={draft.translations.es.title}
              onChange={(title) => updateTranslation('es', { title })}
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

          <PrimaryButton
            icon={FaCheck}
            onClick={handleSaveMilestone}
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </PrimaryButton>
        </div>
      </Panel>
    </div>
  );
}
