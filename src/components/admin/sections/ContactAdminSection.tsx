import { FaCheck } from 'react-icons/fa6';
import { contactFields } from '@/components/admin/mock-data';
import { Panel, PrimaryButton, TextField } from '@/components/admin/ui';

export default function ContactAdminSection() {
  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <Panel title='Datos de contacto' eyebrow='Contacto publico'>
        <div className='grid gap-3 md:grid-cols-2'>
          {contactFields.map((field) => (
            <TextField
              key={field.label}
              label={field.label}
              value={field.value}
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
          <PrimaryButton icon={FaCheck}>Guardar contacto</PrimaryButton>
        </div>
      </Panel>
    </div>
  );
}
