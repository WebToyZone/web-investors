'use client';

import { useState } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaCheck,
  FaPlus,
  FaTrashCan,
} from 'react-icons/fa6';
import type { AdminContent, ContactField } from '@/components/admin/types';
import {
  FormNotice,
  IconButton,
  Panel,
  PrimaryButton,
  SecondaryButton,
  TextField,
} from '@/components/admin/ui';

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
}) {
  const { fields: contactFields } = data;
  const [validationError, setValidationError] = useState('');

  function updateField(index: number, patch: Partial<ContactField>) {
    setValidationError('');
    onChange({
      fields: contactFields.map((field, fieldIndex) =>
        fieldIndex === index ? { ...field, ...patch } : field,
      ),
    });
  }

  function addField() {
    onChange({
      fields: [
        ...contactFields,
        {
          label: 'Nuevo campo',
          value: '',
        },
      ],
    });
    setValidationError('');
  }

  function deleteField(index: number) {
    onChange({
      fields: contactFields.filter((_, fieldIndex) => fieldIndex !== index),
    });
    setValidationError('');
  }

  function moveField(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= contactFields.length) {
      return;
    }

    const nextFields = [...contactFields];
    const currentField = nextFields[index];
    nextFields[index] = nextFields[nextIndex];
    nextFields[nextIndex] = currentField;
    onChange({ fields: nextFields });
  }

  function handleSave() {
    if (!contactFields.length) {
      setValidationError('Debe existir al menos un campo de contacto.');
      return;
    }

    const invalidField = contactFields.find(
      (field) => !field.label.trim() || !field.value.trim(),
    );

    if (invalidField) {
      setValidationError('Completa etiqueta y valor antes de guardar.');
      return;
    }

    setValidationError('');
    onSave();
  }

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <Panel title='Datos de contacto' eyebrow='Contacto publico'>
        <div className='space-y-3'>
          {contactFields.map((field, index) => (
            <div
              key={`${field.label}-${index}`}
              className='grid gap-3 rounded-md border border-neutral-200 p-3 md:grid-cols-[1fr_1.4fr_auto]'
            >
              <TextField
                label='Etiqueta'
                value={field.label}
                onChange={(label) => updateField(index, { label })}
              />
              <TextField
                label='Valor'
                value={field.value}
                onChange={(value) => updateField(index, { value })}
              />
              <div className='flex items-end gap-2'>
                <IconButton
                  label='Subir'
                  onClick={() => moveField(index, -1)}
                  disabled={index === 0}
                >
                  <FaArrowUp className='h-4 w-4' />
                </IconButton>
                <IconButton
                  label='Bajar'
                  onClick={() => moveField(index, 1)}
                  disabled={index === contactFields.length - 1}
                >
                  <FaArrowDown className='h-4 w-4' />
                </IconButton>
                <IconButton
                  label='Eliminar'
                  onClick={() => deleteField(index)}
                  disabled={contactFields.length === 1}
                >
                  <FaTrashCan className='h-4 w-4' />
                </IconButton>
              </div>
            </div>
          ))}
          <SecondaryButton icon={FaPlus} onClick={addField}>
            Anadir campo
          </SecondaryButton>
        </div>
      </Panel>

      <Panel title='Guardar cambios' eyebrow='JSON local'>
        <div className='space-y-4'>
          {validationError ? (
            <FormNotice tone='danger'>{validationError}</FormNotice>
          ) : (
            <FormNotice>
              Los cambios se guardan temporalmente en data/admin/content.json.
            </FormNotice>
          )}
          <PrimaryButton icon={FaCheck} onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar JSON'}
          </PrimaryButton>
        </div>
      </Panel>
    </div>
  );
}
