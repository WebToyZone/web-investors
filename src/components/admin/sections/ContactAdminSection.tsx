'use client';

import { useState } from 'react';
import { FaCheck } from 'react-icons/fa6';
import type {
  AdminContent,
  ContactInfo,
  Locale,
} from '@/components/admin/types';
import { FormNotice, IconButton, Panel, TextField } from '@/components/admin/ui';
import {
  joinAddressLine2,
  splitAddressLine2,
} from '@/services/contact/address';

/** Shared by both languages: a phone number and an inbox do not translate. */
const sharedFields: { key: 'email' | 'phone'; label: string }[] = [
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Teléfono' },
];

/**
 * Rebuilds both languages from the address being edited. Street and locality
 * are identical in each; only the country differs.
 */
function buildAddressTranslations(
  street: string,
  locality: string,
  countryEs: string,
  countryEn: string,
): ContactInfo['translations'] {
  return {
    en: {
      addressLine1: street,
      addressLine2: joinAddressLine2(locality, countryEn),
    },
    es: {
      addressLine1: street,
      addressLine2: joinAddressLine2(locality, countryEs),
    },
  };
}

export default function ContactAdminSection({
  data,
  onChange,
  onSave,
  isSaving,
}: {
  data: AdminContent['contact'];
  onChange: (value: AdminContent['contact']) => void;
  onSave: () => void;
  isSaving: boolean;
  createRequestId: number;
}) {
  const { info, recipientEmail } = data;
  const [validationError, setValidationError] = useState('');

  function updateSharedField(key: 'email' | 'phone', value: string) {
    setValidationError('');
    onChange({ ...data, info: { ...info, [key]: value } });
  }

  // Street and locality are shared, so the Spanish side is the one read back;
  // each country comes from its own language.
  const street = info.translations.es.addressLine1;
  const { locality, country: countryEs } = splitAddressLine2(
    info.translations.es.addressLine2,
  );
  const { country: countryEn } = splitAddressLine2(
    info.translations.en.addressLine2,
  );

  function updateAddress(patch: {
    street?: string;
    locality?: string;
    countryEs?: string;
    countryEn?: string;
  }) {
    setValidationError('');
    onChange({
      ...data,
      info: {
        ...info,
        translations: buildAddressTranslations(
          patch.street ?? street,
          patch.locality ?? locality,
          patch.countryEs ?? countryEs,
          patch.countryEn ?? countryEn,
        ),
      },
    });
  }

  function saveField(value: string) {
    if (!value.trim()) {
      setValidationError('Completa el valor antes de guardar.');
      return;
    }

    setValidationError('');
    onSave();
  }

  function updateRecipientEmail(value: string) {
    setValidationError('');
    onChange({ ...data, recipientEmail: value });
  }

  function saveRecipientEmail() {
    if (!recipientEmail.trim()) {
      setValidationError(
        'Completa el email al que se envía el formulario de contacto.',
      );
      return;
    }

    setValidationError('');
    onSave();
  }

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <Panel title='Datos de contacto' eyebrow='Contacto público'>
        <div className='space-y-3'>
          {validationError ? (
            <FormNotice tone='danger'>{validationError}</FormNotice>
          ) : null}
          {sharedFields.map(({ key, label }) => (
            <div
              key={key}
              className='grid gap-3 rounded-md border border-neutral-200 p-3 md:grid-cols-[1fr_auto] md:items-end'
            >
              <TextField
                label={label}
                value={info[key]}
                onChange={(value) => updateSharedField(key, value)}
              />
              <IconButton
                label='Guardar'
                onClick={() => saveField(info[key])}
                disabled={isSaving}
              >
                <FaCheck className='h-4 w-4' />
              </IconButton>
            </div>
          ))}

          <div className='grid gap-3 rounded-md border border-neutral-200 p-3 md:grid-cols-[1fr_auto] md:items-end'>
            <TextField
              label='Dirección - Calle y número'
              value={street}
              onChange={(value) => updateAddress({ street: value })}
            />
            <IconButton
              label='Guardar'
              onClick={() => saveField(street)}
              disabled={isSaving}
            >
              <FaCheck className='h-4 w-4' />
            </IconButton>
          </div>

          <div className='grid gap-3 rounded-md border border-neutral-200 p-3 md:grid-cols-[1fr_auto] md:items-end'>
            <TextField
              label='Dirección - Código postal, ciudad y provincia'
              value={locality}
              onChange={(value) => updateAddress({ locality: value })}
            />
            <IconButton
              label='Guardar'
              onClick={() => saveField(locality)}
              disabled={isSaving}
            >
              <FaCheck className='h-4 w-4' />
            </IconButton>
          </div>

          <div className='grid gap-3 rounded-md border border-neutral-200 p-3 md:grid-cols-[1fr_auto] md:items-end'>
            <TextField
              label='País en español'
              value={countryEs}
              onChange={(value) => updateAddress({ countryEs: value })}
            />
            <IconButton
              label='Guardar'
              onClick={() => saveField(countryEs)}
              disabled={isSaving}
            >
              <FaCheck className='h-4 w-4' />
            </IconButton>
          </div>

          <div className='grid gap-3 rounded-md border border-neutral-200 p-3 md:grid-cols-[1fr_auto] md:items-end'>
            <TextField
              label='País en inglés'
              value={countryEn}
              onChange={(value) => updateAddress({ countryEn: value })}
            />
            <IconButton
              label='Guardar'
              onClick={() => saveField(countryEn)}
              disabled={isSaving}
            >
              <FaCheck className='h-4 w-4' />
            </IconButton>
          </div>

          <p className='text-xs text-neutral-500'>
            La calle y la localidad son comunes a los dos idiomas; solo el país
            cambia. Se publica como &laquo;localidad, país&raquo;.
          </p>
        </div>
      </Panel>

      <Panel title='Formulario de contacto' eyebrow='Notificaciones'>
        <div className='space-y-4'>
          <div className='flex items-end gap-2'>
            <div className='flex-1'>
              <TextField
                label='Email al que se envía el formulario'
                value={recipientEmail}
                onChange={updateRecipientEmail}
              />
            </div>
            <IconButton
              label='Guardar'
              onClick={saveRecipientEmail}
              disabled={isSaving}
            >
              <FaCheck className='h-4 w-4' />
            </IconButton>
          </div>
          <p className='text-xs text-neutral-500'>
            Los mensajes del formulario de contacto se envian a este correo.
          </p>
        </div>
      </Panel>
    </div>
  );
}
