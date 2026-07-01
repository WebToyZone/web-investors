import { FaCheck, FaEye } from 'react-icons/fa6';
import type { AdminContent, KpiStat } from '@/components/admin/types';
import {
  ActionRow,
  MetricCard,
  Panel,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  TextField,
} from '@/components/admin/ui';

export default function GlanceAdminSection({
  data,
  onChange,
  onSave,
  isSaving,
}: {
  data: AdminContent['glance'];
  onChange: (value: AdminContent['glance']) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  const { kpis } = data;
  const selectedKpi = kpis[0];

  function updateKpi(id: number, patch: Partial<KpiStat>) {
    onChange({
      kpis: kpis.map((kpi) => (kpi.id === id ? { ...kpi, ...patch } : kpi)),
    });
  }

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
          <TextField
            label='Valor visible'
            value={selectedKpi.value}
            onChange={(value) => updateKpi(selectedKpi.id, { value })}
          />
          <TextField
            label='Etiqueta'
            value={selectedKpi.label}
            onChange={(label) => updateKpi(selectedKpi.id, { label })}
          />
          <TextField
            label='Icono'
            value={selectedKpi.icon}
            onChange={(icon) => updateKpi(selectedKpi.id, { icon })}
          />
          <div className='grid grid-cols-2 gap-3'>
            <SecondaryButton icon={FaEye}>Preview</SecondaryButton>
            <PrimaryButton icon={FaCheck} onClick={onSave} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar JSON'}
            </PrimaryButton>
          </div>
        </div>
      </Panel>
    </div>
  );
}
