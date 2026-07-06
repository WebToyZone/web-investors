'use client';

import { useState } from 'react';
import { FaCheck } from 'react-icons/fa6';
import type { AdminContent, ContactInfo } from '@/components/admin/types';
import { FormNotice, IconButton, Panel, TextField } from '@/components/admin/ui';

const infoFields: { key: keyof ContactInfo; label: string }[] = [
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Telefono' },
  { key: 'addressLine1', label: 'Direccion - Calle y numero' },
  { key: 'addressLine2', label: 'Direccion - Ciudad y pais' },
];

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

  function updateInfoField(key: keyof ContactInfo, value: string) {
    setValidationError('');
    onChange({ ...data, info: { ...info, [key]: value } });
  }

  function updateRecipientEmail(value: string) {
    setValidationError('');
    onChange({ ...data, recipientEmail: value });
  }

  function saveInfoField(key: keyof ContactInfo) {
    if (!info[key].trim()) {
      setValidationError('Completa el valor antes de guardar.');
      return;
    }

    setValidationError('');
    onSave();
  }

  function saveRecipientEmail() {
    if (!recipientEmail.trim()) {
      setValidationError(
        'Completa el email al que se envia el formulario de contacto.',
      );
      return;
    }

    setValidationError('');
    onSave();
  }

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <Panel title='Datos de contacto' eyebrow='Contacto publico'>
        <div className='space-y-3'>
          {validationError ? (
            <FormNotice tone='danger'>{validationError}</FormNotice>
          ) : null}
          {infoFields.map(({ key, label }) => (
            <div
              key={key}
              className='grid gap-3 rounded-md border border-neutral-200 p-3 md:grid-cols-[1fr_auto] md:items-end'
            >
              <TextField
                label={label}
                value={info[key]}
                onChange={(value) => updateInfoField(key, value)}
              />
              <IconButton
                label='Guardar'
                onClick={() => saveInfoField(key)}
                disabled={isSaving}
              >
                <FaCheck className='h-4 w-4' />
              </IconButton>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title='Formulario de contacto' eyebrow='Notificaciones'>
        <div className='space-y-4'>
          <div className='flex items-end gap-2'>
            <div className='flex-1'>
              <TextField
                label='Email al que se envia el formulario'
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
            Este dato queda guardado en el admin. El envio real de correos
            todavia usa la variable de entorno CONTACT_TO_EMAIL hasta que
            conectemos el admin con la web publica.
          </p>
        </div>
      </Panel>
    </div>
  );
}
