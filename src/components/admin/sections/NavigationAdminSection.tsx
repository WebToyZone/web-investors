import { FaCheck } from 'react-icons/fa6';
import { footerLinks } from '@/components/admin/mock-data';
import { ActionRow, Panel, PrimaryButton, TextField } from '@/components/admin/ui';

export default function NavigationAdminSection() {
  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <Panel title='Links de footer y navegacion' eyebrow='Enlaces'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[720px] text-left text-sm'>
            <thead className='border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-500'>
              <tr>
                <th className='px-4 py-3'>Grupo</th>
                <th className='px-4 py-3'>Label</th>
                <th className='px-4 py-3'>Href</th>
                <th className='px-4 py-3'>Idioma</th>
                <th className='px-4 py-3 text-right'>Acciones</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-neutral-200'>
              {footerLinks.map((link) => (
                <tr key={link.id}>
                  <td className='px-4 py-4 font-bold text-neutral-950'>
                    {link.group}
                  </td>
                  <td className='px-4 py-4'>{link.label}</td>
                  <td className='px-4 py-4 text-neutral-500'>{link.href}</td>
                  <td className='px-4 py-4'>{link.locale.toUpperCase()}</td>
                  <td className='px-4 py-4'>
                    <ActionRow />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title='Editor enlace' eyebrow='Footer / nav'>
        <div className='space-y-4'>
          <TextField label='Grupo' value='Investor Centre' />
          <TextField label='Label EN' value='Growth Journey' />
          <TextField label='Label ES' value='Trayectoria' />
          <TextField label='Anchor' value='#growth-journey' />
          <PrimaryButton icon={FaCheck}>Guardar enlace</PrimaryButton>
        </div>
      </Panel>
    </div>
  );
}
