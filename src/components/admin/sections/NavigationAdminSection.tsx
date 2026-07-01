import { FaCheck } from 'react-icons/fa6';
import type { AdminContent, FooterLink } from '@/components/admin/types';
import { ActionRow, Panel, PrimaryButton, TextField } from '@/components/admin/ui';

export default function NavigationAdminSection({
  data,
  onChange,
  onSave,
  isSaving,
}: {
  data: AdminContent['navigation'];
  onChange: (value: AdminContent['navigation']) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  const { links: footerLinks } = data;
  const selectedLink = footerLinks[0];

  function updateLink(id: number, patch: Partial<FooterLink>) {
    onChange({
      links: footerLinks.map((link) =>
        link.id === id ? { ...link, ...patch } : link,
      ),
    });
  }

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
          <TextField
            label='Grupo'
            value={selectedLink.group}
            onChange={(group) => updateLink(selectedLink.id, { group })}
          />
          <TextField
            label='Label'
            value={selectedLink.label}
            onChange={(label) => updateLink(selectedLink.id, { label })}
          />
          <TextField
            label='Anchor'
            value={selectedLink.href}
            onChange={(href) => updateLink(selectedLink.id, { href })}
          />
          <PrimaryButton icon={FaCheck} onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar JSON'}
          </PrimaryButton>
        </div>
      </Panel>
    </div>
  );
}
