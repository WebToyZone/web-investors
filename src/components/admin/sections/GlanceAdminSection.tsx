'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaArrowUpFromBracket,
  FaCheck,
  FaImage,
  FaPen,
  FaPlus,
  FaTrashCan,
  FaXmark,
} from 'react-icons/fa6';
import type {
  AdminContent,
  KpiStat,
  PlatformLocation,
} from '@/components/admin/types';
import {
  FormNotice,
  IconButton,
  MetricCard,
  Panel,
  PrimaryButton,
  SecondaryButton,
  TextField,
} from '@/components/admin/ui';

type KpiDraft = {
  icon: string;
  value: string;
  translations: KpiStat['translations'];
};

function createDefaultKpiDraft(): KpiDraft {
  return {
    icon: '',
    value: '',
    translations: {
      en: { label: '' },
      es: { label: '' },
    },
  };
}

type LocationDraft = {
  icon: string;
  translations: PlatformLocation['translations'];
};

function createDefaultLocationDraft(): LocationDraft {
  return {
    icon: '',
    translations: {
      en: { name: '', description: '' },
      es: { name: '', description: '' },
    },
  };
}

function IconUploadField({
  icon,
  onUpload,
  onClear,
}: {
  icon: string;
  onUpload: (file: File | undefined) => void;
  onClear: () => void;
}) {
  return (
    <div className='space-y-3'>
      <span className='block text-xs font-bold uppercase text-neutral-500'>
        Icono
      </span>
      {icon ? (
        <div className='flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2'>
          <div className='flex min-w-0 items-center gap-3'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={icon}
              alt=''
              className='h-10 w-10 shrink-0 rounded-md border border-neutral-200 bg-white object-contain'
            />
            <span className='truncate text-xs text-neutral-600'>{icon}</span>
          </div>
          <IconButton label='Quitar icono' onClick={onClear}>
            <FaXmark className='h-4 w-4' />
          </IconButton>
        </div>
      ) : (
        <div className='flex h-28 flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 text-center'>
          <FaArrowUpFromBracket className='h-6 w-6 text-brand' />
          <p className='mt-2 text-xs font-bold text-neutral-950'>
            Sube una imagen
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

export default function GlanceAdminSection({
  data,
  onChange,
  onSave,
  isSaving,
  createRequestId,
}: {
  data: AdminContent['glance'];
  onChange: (value: AdminContent['glance']) => void;
  onSave: () => void;
  isSaving: boolean;
  createRequestId: number;
}) {
  const { kpis, locations } = data;

  const [formMode, setFormMode] = useState<'new' | 'edit'>('new');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<KpiDraft>(() => createDefaultKpiDraft());
  const [validationError, setValidationError] = useState('');
  const pendingSaveRef = useRef(false);

  const [locationFormMode, setLocationFormMode] = useState<'new' | 'edit'>(
    'new',
  );
  const [editingLocationId, setEditingLocationId] = useState<string | null>(
    null,
  );
  const [locationDraft, setLocationDraft] = useState<LocationDraft>(() =>
    createDefaultLocationDraft(),
  );
  const [locationValidationError, setLocationValidationError] = useState('');
  const pendingLocationSaveRef = useRef(false);

  const orderedKpis = useMemo(() => {
    return [...kpis].sort((first, second) => first.order - second.order);
  }, [kpis]);

  const orderedLocations = useMemo(() => {
    return [...locations].sort((first, second) => first.order - second.order);
  }, [locations]);

  function startNewKpi() {
    setFormMode('new');
    setEditingId(null);
    setDraft(createDefaultKpiDraft());
    setValidationError('');
  }

  function startEditKpi(kpi: KpiStat) {
    setFormMode('edit');
    setEditingId(kpi.id);
    setDraft({
      icon: kpi.icon,
      value: kpi.value,
      translations: {
        en: { ...kpi.translations.en },
        es: { ...kpi.translations.es },
      },
    });
    setValidationError('');
  }

  function updateDraft(patch: Partial<Pick<KpiDraft, 'icon' | 'value'>>) {
    setValidationError('');
    setDraft((current) => ({ ...current, ...patch }));
  }

  function updateLabel(locale: 'en' | 'es', label: string) {
    setValidationError('');
    setDraft((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: { label },
      },
    }));
  }

  function handleIconChange(file: File | undefined) {
    if (!file) {
      return;
    }

    // Local-only for now: stores the file name as the public path. The
    // actual upload to AWS storage will replace this once wired up.
    setValidationError('');
    setDraft((current) => ({ ...current, icon: `/icons/${file.name}` }));
  }

  function clearIcon() {
    setDraft((current) => ({ ...current, icon: '' }));
  }

  function startNewLocation() {
    setLocationFormMode('new');
    setEditingLocationId(null);
    setLocationDraft(createDefaultLocationDraft());
    setLocationValidationError('');
  }

  function startEditLocation(location: PlatformLocation) {
    setLocationFormMode('edit');
    setEditingLocationId(location.id);
    setLocationDraft({
      icon: location.icon,
      translations: {
        en: { ...location.translations.en },
        es: { ...location.translations.es },
      },
    });
    setLocationValidationError('');
  }

  function updateLocationTranslation(
    locale: 'en' | 'es',
    patch: Partial<PlatformLocation['translations']['en']>,
  ) {
    setLocationValidationError('');
    setLocationDraft((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [locale]: { ...current.translations[locale], ...patch },
      },
    }));
  }

  function handleLocationIconChange(file: File | undefined) {
    if (!file) {
      return;
    }

    // Local-only for now: stores the file name as the public path. The
    // actual upload to AWS storage will replace this once wired up.
    setLocationValidationError('');
    setLocationDraft((current) => ({
      ...current,
      icon: `/icons/${file.name}`,
    }));
  }

  function clearLocationIcon() {
    setLocationDraft((current) => ({ ...current, icon: '' }));
  }

  const lastCreateRequestId = useRef(createRequestId);

  useEffect(() => {
    if (createRequestId === lastCreateRequestId.current) {
      return;
    }

    lastCreateRequestId.current = createRequestId;
    startNewKpi();
  }, [createRequestId]);

  useEffect(() => {
    if (!pendingSaveRef.current) {
      return;
    }

    pendingSaveRef.current = false;
    onSave();
  }, [kpis, onSave]);

  useEffect(() => {
    if (!pendingLocationSaveRef.current) {
      return;
    }

    pendingLocationSaveRef.current = false;
    onSave();
  }, [locations, onSave]);

  function deleteKpi(id: string) {
    const nextKpis = kpis.filter((kpi) => kpi.id !== id);
    onChange({ ...data, kpis: nextKpis });

    if (editingId === id) {
      startNewKpi();
    }
  }

  function moveKpi(id: string, direction: -1 | 1) {
    const currentIndex = orderedKpis.findIndex((kpi) => kpi.id === id);
    const nextIndex = currentIndex + direction;

    if (
      currentIndex < 0 ||
      nextIndex < 0 ||
      nextIndex >= orderedKpis.length
    ) {
      return;
    }

    const reordered = [...orderedKpis];
    [reordered[currentIndex], reordered[nextIndex]] = [
      reordered[nextIndex],
      reordered[currentIndex],
    ];

    const nextKpis = reordered.map((kpi, index) => ({
      ...kpi,
      order: index + 1,
    }));

    onChange({ ...data, kpis: nextKpis });
    setValidationError('');
  }

  function handleSave() {
    if (
      !draft.icon.trim() ||
      !draft.value.trim() ||
      !draft.translations.en.label.trim() ||
      !draft.translations.es.label.trim()
    ) {
      setValidationError(
        'Sube un icono y completa valor y etiqueta en ambos idiomas antes de guardar.',
      );
      return;
    }

    const nextKpis =
      formMode === 'edit' && editingId !== null
        ? kpis.map((kpi) =>
            kpi.id === editingId ? { ...kpi, ...draft } : kpi,
          )
        : [
            ...kpis,
            {
              id: String(
                Math.max(0, ...kpis.map((kpi) => Number(kpi.id) || 0)) + 1,
              ),
              order: kpis.length + 1,
              ...draft,
            },
          ];

    pendingSaveRef.current = true;
    onChange({ ...data, kpis: nextKpis });
    startNewKpi();
  }

  function deleteLocation(id: string) {
    const nextLocations = locations.filter((location) => location.id !== id);
    onChange({ ...data, locations: nextLocations });

    if (editingLocationId === id) {
      startNewLocation();
    }
  }

  function moveLocation(id: string, direction: -1 | 1) {
    const currentIndex = orderedLocations.findIndex(
      (location) => location.id === id,
    );
    const nextIndex = currentIndex + direction;

    if (
      currentIndex < 0 ||
      nextIndex < 0 ||
      nextIndex >= orderedLocations.length
    ) {
      return;
    }

    const reordered = [...orderedLocations];
    [reordered[currentIndex], reordered[nextIndex]] = [
      reordered[nextIndex],
      reordered[currentIndex],
    ];

    const nextLocations = reordered.map((location, index) => ({
      ...location,
      order: index + 1,
    }));

    onChange({ ...data, locations: nextLocations });
    setLocationValidationError('');
  }

  function handleSaveLocation() {
    if (
      !locationDraft.icon.trim() ||
      !locationDraft.translations.en.name.trim() ||
      !locationDraft.translations.en.description.trim() ||
      !locationDraft.translations.es.name.trim() ||
      !locationDraft.translations.es.description.trim()
    ) {
      setLocationValidationError(
        'Sube un icono y completa nombre y descripcion en ambos idiomas antes de guardar.',
      );
      return;
    }

    const nextLocations =
      locationFormMode === 'edit' && editingLocationId !== null
        ? locations.map((location) =>
            location.id === editingLocationId
              ? { ...location, ...locationDraft }
              : location,
          )
        : [
            ...locations,
            {
              id: String(
                Math.max(
                  0,
                  ...locations.map((location) => Number(location.id) || 0),
                ) + 1,
              ),
              order: locations.length + 1,
              ...locationDraft,
            },
          ];

    pendingLocationSaveRef.current = true;
    onChange({ ...data, locations: nextLocations });
    startNewLocation();
  }

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <div className='space-y-5'>
        <section className='grid gap-3 sm:grid-cols-2'>
          <MetricCard label='KPIs activos' value={kpis.length} />
          <MetricCard label='Idiomas' value='EN / ES' />
        </section>

        <Panel title='KPIs visibles' eyebrow='At a Glance'>
          <div className='grid gap-3 md:grid-cols-2'>
            {orderedKpis.map((kpi, index) => (
              <div
                key={kpi.id}
                className={`flex items-center justify-between gap-4 rounded-md border p-4 ${
                  formMode === 'edit' && editingId === kpi.id
                    ? 'border-brand bg-red-50/40'
                    : 'border-neutral-200'
                }`}
              >
                <button type='button' className='flex min-w-0 items-center gap-3 text-left'>
                  {kpi.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={kpi.icon}
                      alt=''
                      className='h-10 w-10 shrink-0 rounded-md border border-neutral-200 object-contain'
                    />
                  ) : (
                    <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-dashed border-neutral-300 text-neutral-400'>
                      <FaImage className='h-4 w-4' />
                    </span>
                  )}
                  <span className='min-w-0'>
                    <p className='text-2xl font-black text-brand'>
                      {kpi.value}
                    </p>
                    <p className='truncate text-sm font-bold text-neutral-950'>
                      {kpi.translations.en.label}
                    </p>
                    <p className='mt-1 text-xs text-neutral-500'>
                      ES: {kpi.translations.es.label}
                    </p>
                  </span>
                </button>
                <div className='flex shrink-0 gap-2'>
                  <IconButton
                    label='Editar'
                    onClick={() => startEditKpi(kpi)}
                  >
                    <FaPen className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Subir'
                    onClick={() => moveKpi(kpi.id, -1)}
                    disabled={index <= 0}
                  >
                    <FaArrowUp className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Bajar'
                    onClick={() => moveKpi(kpi.id, 1)}
                    disabled={index === orderedKpis.length - 1}
                  >
                    <FaArrowDown className='h-4 w-4' />
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
            ))}
          </div>
        </Panel>

        <Panel title='Global Operating Platform' eyebrow='Ubicaciones operativas'>
          <div className='flex items-center justify-between gap-3 border-b border-neutral-200 pb-4'>
            <p className='text-sm text-neutral-600'>
              Paises/ubicaciones mostrados debajo de las KPIs.
            </p>
            <SecondaryButton icon={FaPlus} onClick={startNewLocation}>
              Nueva ubicacion
            </SecondaryButton>
          </div>

          <div className='mt-4 grid gap-3 md:grid-cols-3'>
            {orderedLocations.map((location, index) => (
              <div
                key={location.id}
                className={`flex flex-col gap-3 rounded-md border p-4 ${
                  locationFormMode === 'edit' &&
                  editingLocationId === location.id
                    ? 'border-brand bg-red-50/40'
                    : 'border-neutral-200'
                }`}
              >
                <div className='flex items-center gap-3'>
                  {location.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={location.icon}
                      alt=''
                      className='h-10 w-10 shrink-0 rounded-full border border-neutral-200 object-contain'
                    />
                  ) : (
                    <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-neutral-300 text-neutral-400'>
                      <FaImage className='h-4 w-4' />
                    </span>
                  )}
                  <div className='min-w-0'>
                    <p className='truncate font-bold text-brand'>
                      {location.translations.en.name}
                    </p>
                    <p className='truncate text-xs text-neutral-500'>
                      ES: {location.translations.es.name}
                    </p>
                  </div>
                </div>
                <p className='text-xs text-neutral-600'>
                  {location.translations.en.description}
                </p>
                <div className='mt-auto flex justify-end gap-2'>
                  <IconButton
                    label='Editar'
                    onClick={() => startEditLocation(location)}
                  >
                    <FaPen className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Subir'
                    onClick={() => moveLocation(location.id, -1)}
                    disabled={index <= 0}
                  >
                    <FaArrowUp className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Bajar'
                    onClick={() => moveLocation(location.id, 1)}
                    disabled={index === orderedLocations.length - 1}
                  >
                    <FaArrowDown className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Eliminar'
                    onClick={() => deleteLocation(location.id)}
                    disabled={locations.length === 1}
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
        <Panel title='Editor KPI' eyebrow='Campos DB'>
          <div className='space-y-4'>
            {validationError ? (
              <FormNotice tone='danger'>{validationError}</FormNotice>
            ) : null}
            <h3 className='text-xl font-black text-neutral-950'>
              {formMode === 'edit' ? 'Editar KPI' : 'Nuevo KPI'}
            </h3>

            <IconUploadField
              icon={draft.icon}
              onUpload={handleIconChange}
              onClear={clearIcon}
            />

            <TextField
              label='Cifra (comun a ambos idiomas)'
              value={draft.value}
              onChange={(value) => updateDraft({ value })}
            />

            <div className='space-y-3 rounded-md border border-neutral-200 p-3'>
              <span className='text-xs font-bold uppercase text-neutral-500'>
                Ingles
              </span>
              <TextField
                label='Etiqueta'
                value={draft.translations.en.label}
                onChange={(label) => updateLabel('en', label)}
              />
            </div>

            <div className='space-y-3 rounded-md border border-neutral-200 p-3'>
              <span className='text-xs font-bold uppercase text-neutral-500'>
                Espanol
              </span>
              <TextField
                label='Etiqueta'
                value={draft.translations.es.label}
                onChange={(label) => updateLabel('es', label)}
              />
            </div>

            <PrimaryButton icon={FaCheck} onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </PrimaryButton>
          </div>
        </Panel>

        <Panel title='Editor ubicacion' eyebrow='Global Operating Platform'>
          <div className='space-y-4'>
            {locationValidationError ? (
              <FormNotice tone='danger'>{locationValidationError}</FormNotice>
            ) : null}
            <h3 className='text-xl font-black text-neutral-950'>
              {locationFormMode === 'edit'
                ? 'Editar ubicacion'
                : 'Nueva ubicacion'}
            </h3>

            <IconUploadField
              icon={locationDraft.icon}
              onUpload={handleLocationIconChange}
              onClear={clearLocationIcon}
            />

            <div className='space-y-3 rounded-md border border-neutral-200 p-3'>
              <span className='text-xs font-bold uppercase text-neutral-500'>
                Ingles
              </span>
              <TextField
                label='Nombre'
                value={locationDraft.translations.en.name}
                onChange={(name) => updateLocationTranslation('en', { name })}
              />
              <TextField
                label='Descripcion'
                multiline
                value={locationDraft.translations.en.description}
                onChange={(description) =>
                  updateLocationTranslation('en', { description })
                }
              />
            </div>

            <div className='space-y-3 rounded-md border border-neutral-200 p-3'>
              <span className='text-xs font-bold uppercase text-neutral-500'>
                Espanol
              </span>
              <TextField
                label='Nombre'
                value={locationDraft.translations.es.name}
                onChange={(name) => updateLocationTranslation('es', { name })}
              />
              <TextField
                label='Descripcion'
                multiline
                value={locationDraft.translations.es.description}
                onChange={(description) =>
                  updateLocationTranslation('es', { description })
                }
              />
            </div>

            <PrimaryButton
              icon={FaCheck}
              onClick={handleSaveLocation}
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
