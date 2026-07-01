import { FaCheck } from 'react-icons/fa6';
import { milestones, revenue } from '@/components/admin/mock-data';
import {
  ActionRow,
  Panel,
  PrimaryButton,
  StatusBadge,
  TextField,
} from '@/components/admin/ui';

export default function GrowthAdminSection() {
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
                <TextField label='Valor numerico' value={item.value} />
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
                  <p className='font-bold text-neutral-950'>
                    {milestone.title}
                  </p>
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
          <PrimaryButton icon={FaCheck}>Guardar seccion</PrimaryButton>
        </div>
      </Panel>
    </div>
  );
}
