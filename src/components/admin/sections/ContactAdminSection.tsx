import { FaCheck } from 'react-icons/fa6';
import type { AdminContent } from '@/components/admin/types';
import { Panel, PrimaryButton, TextField } from '@/components/admin/ui';

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

  function updateField(label: string, value: string) {
    onChange({
      fields: contactFields.map((field) =>
        field.label === label ? { ...field, value } : field,
      ),
    });
  }

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <Panel title='Datos de contacto' eyebrow='Contacto publico'>
        <div className='grid gap-3 md:grid-cols-2'>
          {contactFields.map((field) => (
            <TextField
              key={field.label}
              label={field.label}
              value={field.value}
              onChange={(value) => updateField(field.label, value)}
            />
          ))}
        </div>
      </Panel>

      <Panel title='Textos del formulario' eyebrow='Labels'>
        <div className='space-y-4'>
          <TextField label='Heading EN' value='We are here to help' />
          <TextField label='Heading ES' value='Estamos para ayudarle' />
          <TextField label='Consentimiento' value='He leido y acepto...' />
          <TextField
            label='Mensaje exito'
            value='Your message has been sent successfully.'
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
