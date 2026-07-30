'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaCheck,
  FaImage,
  FaPen,
  FaPlus,
  FaTrashCan,
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
import { AssetUploadField } from '@/components/admin/upload/AssetUploadField';
import { uploadAsset } from '@/components/admin/upload/upload-asset';
import { getAssetUrl } from '@/services/storage/asset-url';

type KpiDraft = {
  icon: string;
  pendingIconFile?: File;
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
  pendingIconFile?: File;
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
  const [isUploading, setIsUploading] = useState(false);
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
  const [isLocationUploading, setIsLocationUploading] = useState(false);
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

  function handleIconSelected(file: File) {
    setValidationError('');
    setDraft((current) => ({ ...current, pendingIconFile: file }));
  }

  function clearIcon() {
    setDraft((current) => ({
      ...current,
      icon: '',
      pendingIconFile: undefined,
    }));
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

  function handleLocationIconSelected(file: File) {
    setLocationValidationError('');
    setLocationDraft((current) => ({ ...current, pendingIconFile: file }));
  }

  function clearLocationIcon() {
    setLocationDraft((current) => ({
      ...current,
      icon: '',
      pendingIconFile: undefined,
    }));
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
    const kpi = kpis.find((current) => current.id === id);
    if (
      !window.confirm(
        `Eliminar el KPI ${kpi?.translations.en.label ?? ''}? Esta accion no se puede deshacer.`,
      )
    ) {
      return;
    }

    const nextKpis = kpis.filter((current) => current.id !== id);
    pendingSaveRef.current = true;
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

    pendingSaveRef.current = true;
    onChange({ ...data, kpis: nextKpis });
    setValidationError('');
  }

  async function handleSave() {
    if (
      (!draft.icon.trim() && !draft.pendingIconFile) ||
      !draft.value.trim() ||
      !draft.translations.en.label.trim() ||
      !draft.translations.es.label.trim()
    ) {
      setValidationError(
        'Sube un icono y completa valor y etiqueta en ambos idiomas antes de guardar.',
      );
      return;
    }

    let icon = draft.icon;
    if (draft.pendingIconFile) {
      setIsUploading(true);
      const result = await uploadAsset('icons', draft.pendingIconFile);
      setIsUploading(false);

      if ('error' in result) {
        setValidationError(result.error);
        return;
      }
      icon = result.key;
    }

    const savedKpi = { icon, value: draft.value, translations: draft.translations };

    const nextKpis =
      formMode === 'edit' && editingId !== null
        ? kpis.map((kpi) =>
            kpi.id === editingId ? { ...kpi, ...savedKpi } : kpi,
          )
        : [
            ...kpis,
            {
              id: String(
                Math.max(0, ...kpis.map((kpi) => Number(kpi.id) || 0)) + 1,
              ),
              order: kpis.length + 1,
              ...savedKpi,
            },
          ];

    pendingSaveRef.current = true;
    onChange({ ...data, kpis: nextKpis });
    startNewKpi();
  }

  function deleteLocation(id: string) {
    const location = locations.find((current) => current.id === id);
    if (
      !window.confirm(
        `Eliminar la ubicacion ${location?.translations.en.name ?? ''}? Esta accion no se puede deshacer.`,
      )
    ) {
      return;
    }

    const nextLocations = locations.filter((current) => current.id !== id);
    pendingLocationSaveRef.current = true;
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

    pendingLocationSaveRef.current = true;
    onChange({ ...data, locations: nextLocations });
    setLocationValidationError('');
  }

  async function handleSaveLocation() {
    if (
      (!locationDraft.icon.trim() && !locationDraft.pendingIconFile) ||
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

    let icon = locationDraft.icon;
    if (locationDraft.pendingIconFile) {
      setIsLocationUploading(true);
      const result = await uploadAsset('icons', locationDraft.pendingIconFile);
      setIsLocationUploading(false);

      if ('error' in result) {
        setLocationValidationError(result.error);
        return;
      }
      icon = result.key;
    }

    const savedLocation = { icon, translations: locationDraft.translations };

    const nextLocations =
      locationFormMode === 'edit' && editingLocationId !== null
        ? locations.map((location) =>
            location.id === editingLocationId
              ? { ...location, ...savedLocation }
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
              ...savedLocation,
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
                      src={getAssetUrl(kpi.icon)}
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
                      src={getAssetUrl(location.icon)}
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

            <AssetUploadField
              accept='image/*'
              label='Icono'
              value={draft.icon}
              pendingFile={draft.pendingIconFile}
              onFileSelected={handleIconSelected}
              onClear={clearIcon}
              previewVariant='square'
              disabled={isUploading}
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

            <PrimaryButton
              icon={FaCheck}
              onClick={handleSave}
              disabled={isSaving || isUploading}
            >
              {isUploading
                ? 'Subiendo...'
                : isSaving
                  ? 'Guardando...'
                  : 'Guardar'}
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

            <AssetUploadField
              accept='image/*'
              label='Icono'
              value={locationDraft.icon}
              pendingFile={locationDraft.pendingIconFile}
              onFileSelected={handleLocationIconSelected}
              onClear={clearLocationIcon}
              previewVariant='square'
              disabled={isLocationUploading}
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
              disabled={isSaving || isLocationUploading}
            >
              {isLocationUploading
                ? 'Subiendo...'
                : isSaving
                  ? 'Guardando...'
                  : 'Guardar'}
            </PrimaryButton>
          </div>
        </Panel>
      </div>
    </div>
  );
}
