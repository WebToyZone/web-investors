'use client';

import { useState } from 'react';
import { FaArrowUp, FaCheck, FaPlus, FaTrashCan } from 'react-icons/fa6';
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
  SecondaryButton,
  SelectField,
  StatusBadge,
  TextField,
} from '@/components/admin/ui';

export default function GrowthAdminSection({
  data,
  onChange,
  onSave,
  isSaving,
}: {
  data: AdminContent['growth'];
  onChange: (value: AdminContent['growth']) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  const { revenue, milestones } = data;
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(
    milestones[0]?.id ?? 0,
  );
  const [validationError, setValidationError] = useState('');
  const selectedMilestone =
    milestones.find((milestone) => milestone.id === selectedMilestoneId) ??
    milestones[0];

  function updateRevenue(year: string, patch: Partial<GrowthRevenue>) {
    setValidationError('');
    onChange({
      ...data,
      revenue: revenue.map((item) =>
        item.year === year ? { ...item, ...patch } : item,
      ),
    });
  }

  function updateMilestone(id: number, patch: Partial<GrowthMilestone>) {
    setValidationError('');
    onChange({
      ...data,
      milestones: milestones.map((milestone) =>
        milestone.id === id ? { ...milestone, ...patch } : milestone,
      ),
    });
  }

  function addMilestone() {
    const nextId = Math.max(0, ...milestones.map((milestone) => milestone.id)) + 1;
    const nextMilestone: GrowthMilestone = {
      id: nextId,
      title: 'Nuevo milestone',
      locale: 'en',
      status: 'draft',
    };

    setSelectedMilestoneId(nextId);
    onChange({ ...data, milestones: [...milestones, nextMilestone] });
    setValidationError('');
  }

  function deleteMilestone(id: number) {
    const nextMilestones = milestones.filter((milestone) => milestone.id !== id);
    setSelectedMilestoneId(nextMilestones[0]?.id ?? 0);
    onChange({ ...data, milestones: nextMilestones });
    setValidationError('');
  }

  function moveMilestone(id: number, direction: -1 | 1) {
    const currentIndex = milestones.findIndex((milestone) => milestone.id === id);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= milestones.length) {
      return;
    }

    const nextMilestones = [...milestones];
    const currentMilestone = nextMilestones[currentIndex];
    nextMilestones[currentIndex] = nextMilestones[nextIndex];
    nextMilestones[nextIndex] = currentMilestone;
    onChange({ ...data, milestones: nextMilestones });
  }

  function handleSave() {
    const invalidRevenue = revenue.find(
      (item) => !item.year.trim() || !item.value.trim() || !item.label.trim(),
    );

    if (invalidRevenue) {
      setValidationError('Completa ano, valor y label en ingresos.');
      return;
    }

    if (!milestones.length) {
      setValidationError('Debe existir al menos un milestone.');
      return;
    }

    const invalidMilestone = milestones.find(
      (milestone) => !milestone.title.trim(),
    );

    if (invalidMilestone) {
      setSelectedMilestoneId(invalidMilestone.id);
      setValidationError('Completa el titulo del milestone antes de guardar.');
      return;
    }

    setValidationError('');
    onSave();
  }

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <div className='space-y-5'>
        <Panel title='Ingresos consolidados' eyebrow='Grafico'>
          <div className='grid gap-3 md:grid-cols-3'>
            {revenue.map((item) => (
              <div
                key={item.year}
                className='rounded-md border border-neutral-200 p-4'
              >
                <p className='text-sm font-bold text-neutral-500'>
                  {item.year}
                </p>
                <p className='mt-2 text-2xl font-black text-brand'>
                  {item.label}
                </p>
                <TextField
                  label='Valor numerico'
                  value={item.value}
                  onChange={(value) => updateRevenue(item.year, { value })}
                />
                <TextField
                  label='Label visible'
                  value={item.label}
                  onChange={(label) => updateRevenue(item.year, { label })}
                />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title='Milestones' eyebrow='Timeline'>
          <div className='space-y-3'>
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`flex items-center justify-between gap-4 rounded-md border p-4 ${
                  selectedMilestone?.id === milestone.id
                    ? 'border-brand bg-red-50/40'
                    : 'border-neutral-200'
                }`}
              >
                <button
                  type='button'
                  onClick={() => setSelectedMilestoneId(milestone.id)}
                  className='min-w-0 text-left'
                >
                  <p className='font-black text-neutral-950'>
                    {milestone.title}
                  </p>
                  <p className='text-xs text-neutral-500'>
                    {milestone.locale.toUpperCase()}
                  </p>
                </button>
                <div className='flex items-center gap-3'>
                  <StatusBadge status={milestone.status} />
                  <IconButton
                    label='Subir'
                    onClick={() => moveMilestone(milestone.id, -1)}
                  >
                    <FaArrowUp className='h-4 w-4' />
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
            <SecondaryButton icon={FaPlus} onClick={addMilestone}>
              Anadir milestone
            </SecondaryButton>
          </div>
        </Panel>
      </div>

      <Panel title='Editor milestone' eyebrow='Growth Journey'>
        {selectedMilestone ? (
          <div className='space-y-4'>
            {validationError ? (
              <FormNotice tone='danger'>{validationError}</FormNotice>
            ) : null}
            <TextField
              label='Titulo'
              value={selectedMilestone.title}
              onChange={(title) =>
                updateMilestone(selectedMilestone.id, { title })
              }
            />
            <SelectField
              label='Idioma'
              value={selectedMilestone.locale}
              options={[
                { label: 'English', value: 'en' },
                { label: 'Espanol', value: 'es' },
              ]}
              onChange={(locale) =>
                updateMilestone(selectedMilestone.id, {
                  locale: locale as GrowthMilestone['locale'],
                })
              }
            />
            <SelectField
              label='Estado'
              value={selectedMilestone.status}
              options={[
                { label: 'Publicado', value: 'published' },
                { label: 'Borrador', value: 'draft' },
                { label: 'Programado', value: 'scheduled' },
              ]}
              onChange={(status) =>
                updateMilestone(selectedMilestone.id, {
                  status: status as GrowthMilestone['status'],
                })
              }
            />
            <div className='grid grid-cols-2 gap-3'>
              <SecondaryButton icon={FaPlus} onClick={addMilestone}>
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
            <FormNotice tone='danger'>No hay milestones configurados.</FormNotice>
            <PrimaryButton icon={FaPlus} onClick={addMilestone}>
              Crear milestone
            </PrimaryButton>
          </div>
        )}
      </Panel>
    </div>
  );
}
