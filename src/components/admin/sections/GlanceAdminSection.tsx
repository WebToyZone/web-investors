import { FaCheck, FaEye } from 'react-icons/fa6';
import { kpis } from '@/components/admin/mock-data';
import {
  ActionRow,
  MetricCard,
  Panel,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  TextField,
} from '@/components/admin/ui';

export default function GlanceAdminSection() {
  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <div className='space-y-5'>
        <section className='grid gap-3 sm:grid-cols-3'>
          <MetricCard label='KPIs activos' value={kpis.length} />
          <MetricCard label='Idiomas' value='EN / ES' />
          <MetricCard label='Pendientes' value='1' />
        </section>

        <Panel title='KPIs visibles' eyebrow='At a Glance'>
          <div className='grid gap-3 md:grid-cols-2'>
            {kpis.map((kpi) => (
              <div
                key={kpi.id}
                className='flex items-center justify-between gap-4 rounded-md border border-neutral-200 p-4'
              >
                <div className='min-w-0'>
                  <p className='text-2xl font-black text-brand'>{kpi.value}</p>
                  <p className='truncate text-sm font-bold text-neutral-950'>
                    {kpi.label}
                  </p>
                  <p className='mt-1 text-xs text-neutral-500'>
                    {kpi.locale.toUpperCase()} - {kpi.icon}
                  </p>
                </div>
                <div className='flex shrink-0 flex-col items-end gap-3'>
                  <StatusBadge status={kpi.status} />
                  <ActionRow />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title='Editor KPI' eyebrow='Campos DB'>
        <div className='space-y-4'>
          <TextField label='Valor visible' value='$19,75M' />
          <TextField label='Etiqueta EN' value='2025 Revenue' />
          <TextField label='Etiqueta ES' value='Ingresos 2025' />
          <TextField label='Icono' value='/icons/revenue.webp' />
          <div className='grid grid-cols-2 gap-3'>
            <SecondaryButton icon={FaEye}>Preview</SecondaryButton>
            <PrimaryButton icon={FaCheck}>Guardar</PrimaryButton>
          </div>
        </div>
      </Panel>
    </div>
  );
}
