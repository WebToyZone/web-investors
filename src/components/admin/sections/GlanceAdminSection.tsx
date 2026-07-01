'use client';

import { useMemo, useState } from 'react';
import {
  FaArrowUp,
  FaCheck,
  FaCopy,
  FaEye,
  FaPlus,
  FaTrashCan,
} from 'react-icons/fa6';
import type { AdminContent, KpiStat } from '@/components/admin/types';
import {
  FormNotice,
  IconButton,
  MetricCard,
  Panel,
  PrimaryButton,
  SecondaryButton,
  SelectField,
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
  const [selectedKpiId, setSelectedKpiId] = useState(kpis[0]?.id ?? 0);
  const [validationError, setValidationError] = useState('');
  const selectedKpi = useMemo(
    () => kpis.find((kpi) => kpi.id === selectedKpiId) ?? kpis[0],
    [kpis, selectedKpiId],
  );

  const emptyFields = selectedKpi
    ? [
        selectedKpi.value.trim() ? '' : 'Valor visible',
        selectedKpi.label.trim() ? '' : 'Etiqueta',
        selectedKpi.icon.trim() ? '' : 'Icono',
      ].filter(Boolean)
    : [];

  function updateKpi(id: number, patch: Partial<KpiStat>) {
    setValidationError('');
    onChange({
      kpis: kpis.map((kpi) => (kpi.id === id ? { ...kpi, ...patch } : kpi)),
    });
  }

  function addKpi() {
    const nextId = Math.max(0, ...kpis.map((kpi) => kpi.id)) + 1;
    const nextKpi: KpiStat = {
      id: nextId,
      label: 'Nuevo KPI',
      value: '0',
      locale: 'en',
      icon: '/icons/revenue.webp',
      status: 'draft',
    };

    setSelectedKpiId(nextId);
    onChange({ kpis: [...kpis, nextKpi] });
    setValidationError('');
  }

  function duplicateKpi() {
    if (!selectedKpi) {
      return;
    }

    const nextId = Math.max(0, ...kpis.map((kpi) => kpi.id)) + 1;
    const nextKpi = {
      ...selectedKpi,
      id: nextId,
      label: `${selectedKpi.label} copia`,
      status: 'draft' as const,
    };

    setSelectedKpiId(nextId);
    onChange({ kpis: [...kpis, nextKpi] });
    setValidationError('');
  }

  function deleteKpi(id: number) {
    const nextKpis = kpis.filter((kpi) => kpi.id !== id);
    setSelectedKpiId(nextKpis[0]?.id ?? 0);
    onChange({ kpis: nextKpis });
    setValidationError('');
  }

  function moveKpi(id: number, direction: -1 | 1) {
    const currentIndex = kpis.findIndex((kpi) => kpi.id === id);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= kpis.length) {
      return;
    }

    const nextKpis = [...kpis];
    const currentKpi = nextKpis[currentIndex];
    nextKpis[currentIndex] = nextKpis[nextIndex];
    nextKpis[nextIndex] = currentKpi;
    onChange({ kpis: nextKpis });
  }

  function handleSave() {
    if (!kpis.length) {
      setValidationError('Debe existir al menos un KPI.');
      return;
    }

    const invalidKpi = kpis.find(
      (kpi) => !kpi.value.trim() || !kpi.label.trim() || !kpi.icon.trim(),
    );

    if (invalidKpi) {
      setSelectedKpiId(invalidKpi.id);
      setValidationError('Completa valor, etiqueta e icono antes de guardar.');
      return;
    }

    setValidationError('');
    onSave();
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
                className={`flex items-center justify-between gap-4 rounded-md border p-4 ${
                  selectedKpi?.id === kpi.id
                    ? 'border-brand bg-red-50/40'
                    : 'border-neutral-200'
                }`}
              >
                <button
                  type='button'
                  onClick={() => setSelectedKpiId(kpi.id)}
                  className='min-w-0 text-left'
                >
                  <p className='text-2xl font-black text-brand'>{kpi.value}</p>
                  <p className='truncate text-sm font-bold text-neutral-950'>
                    {kpi.label}
                  </p>
                  <p className='mt-1 text-xs text-neutral-500'>
                    {kpi.locale.toUpperCase()} - {kpi.icon}
                  </p>
                </button>
                <div className='flex shrink-0 flex-col items-end gap-3'>
                  <StatusBadge status={kpi.status} />
                  <div className='flex justify-end gap-2'>
                    <IconButton
                      label='Subir'
                      onClick={() => moveKpi(kpi.id, -1)}
                    >
                      <FaArrowUp className='h-4 w-4' />
                    </IconButton>
                    <IconButton
                      label='Eliminar'
                      onClick={() => deleteKpi(kpi.id)}
                      disabled={kpis.length === 1}
                    >
                      <FaTrashCan className='h-4 w-4' />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title='Editor KPI' eyebrow='Campos DB'>
        {selectedKpi ? (
          <div className='space-y-4'>
            {validationError ? (
              <FormNotice tone='danger'>{validationError}</FormNotice>
            ) : null}
            {emptyFields.length ? (
              <FormNotice>Campos pendientes: {emptyFields.join(', ')}</FormNotice>
            ) : null}
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
            <SelectField
              label='Idioma'
              value={selectedKpi.locale}
              options={[
                { label: 'Ingles', value: 'en' },
                { label: 'Espanol', value: 'es' },
              ]}
              onChange={(locale) =>
                updateKpi(selectedKpi.id, { locale: locale as KpiStat['locale'] })
              }
            />
            <SelectField
              label='Estado'
              value={selectedKpi.status}
              options={[
                { label: 'Publicado', value: 'published' },
                { label: 'Borrador', value: 'draft' },
                { label: 'Programado', value: 'scheduled' },
              ]}
              onChange={(status) =>
                updateKpi(selectedKpi.id, {
                  status: status as KpiStat['status'],
                })
              }
            />
            <div className='grid grid-cols-2 gap-3'>
              <SecondaryButton icon={FaPlus} onClick={addKpi}>
                Nuevo
              </SecondaryButton>
              <SecondaryButton icon={FaCopy} onClick={duplicateKpi}>
                Duplicar
              </SecondaryButton>
              <SecondaryButton icon={FaEye}>Preview</SecondaryButton>
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
            <FormNotice tone='danger'>No hay KPIs configurados.</FormNotice>
            <PrimaryButton icon={FaPlus} onClick={addKpi}>
              Crear primer KPI
            </PrimaryButton>
          </div>
        )}
      </Panel>
    </div>
  );
}
