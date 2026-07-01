import { FaCheck } from 'react-icons/fa6';
import type {
  AdminContent,
  GrowthMilestone,
  GrowthRevenue,
} from '@/components/admin/types';
import {
  ActionRow,
  Panel,
  PrimaryButton,
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

  function updateRevenue(year: string, patch: Partial<GrowthRevenue>) {
    onChange({
      ...data,
      revenue: revenue.map((item) =>
        item.year === year ? { ...item, ...patch } : item,
      ),
    });
  }

  function updateMilestone(id: number, patch: Partial<GrowthMilestone>) {
    onChange({
      ...data,
      milestones: milestones.map((milestone) =>
        milestone.id === id ? { ...milestone, ...patch } : milestone,
      ),
    });
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
              </div>
            ))}
          </div>
        </Panel>

        <Panel title='Milestones' eyebrow='Timeline'>
          <div className='space-y-3'>
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className='flex items-center justify-between gap-4 rounded-md border border-neutral-200 p-4'
              >
                <div>
                  <TextField
                    label='Titulo'
                    value={milestone.title}
                    onChange={(title) =>
                      updateMilestone(milestone.id, { title })
                    }
                  />
                  <p className='text-xs text-neutral-500'>
                    {milestone.locale.toUpperCase()}
                  </p>
                </div>
                <div className='flex items-center gap-3'>
                  <StatusBadge status={milestone.status} />
                  <ActionRow />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title='Texto de seccion' eyebrow='Growth Journey'>
        <div className='space-y-4'>
          <TextField label='Titulo EN' value='Growth Journey' />
          <TextField label='Periodo' value='2020 - 2025' />
          <TextField
            label='Lead'
            value='From an international family-owned company to a selective growth and M&A platform.'
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
