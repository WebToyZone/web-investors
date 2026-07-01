'use client';

import { useState } from 'react';
import { FaArrowUp, FaCheck, FaPlus, FaTrashCan } from 'react-icons/fa6';
import type { AdminContent, FooterLink } from '@/components/admin/types';
import {
  FormNotice,
  IconButton,
  Panel,
  PrimaryButton,
  SecondaryButton,
  SelectField,
  TextField,
} from '@/components/admin/ui';

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
  const [selectedLinkId, setSelectedLinkId] = useState(footerLinks[0]?.id ?? 0);
  const [validationError, setValidationError] = useState('');
  const selectedLink =
    footerLinks.find((link) => link.id === selectedLinkId) ?? footerLinks[0];

  function updateLink(id: number, patch: Partial<FooterLink>) {
    setValidationError('');
    onChange({
      links: footerLinks.map((link) =>
        link.id === id ? { ...link, ...patch } : link,
      ),
    });
  }

  function addLink() {
    const nextId = Math.max(0, ...footerLinks.map((link) => link.id)) + 1;
    const nextLink: FooterLink = {
      id: nextId,
      group: 'Footer',
      label: 'Nuevo enlace',
      href: '#',
      locale: 'en',
    };

    setSelectedLinkId(nextId);
    onChange({ links: [...footerLinks, nextLink] });
    setValidationError('');
  }

  function deleteLink(id: number) {
    const nextLinks = footerLinks.filter((link) => link.id !== id);
    setSelectedLinkId(nextLinks[0]?.id ?? 0);
    onChange({ links: nextLinks });
    setValidationError('');
  }

  function moveLink(id: number, direction: -1 | 1) {
    const currentIndex = footerLinks.findIndex((link) => link.id === id);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= footerLinks.length) {
      return;
    }

    const nextLinks = [...footerLinks];
    const currentLink = nextLinks[currentIndex];
    nextLinks[currentIndex] = nextLinks[nextIndex];
    nextLinks[nextIndex] = currentLink;
    onChange({ links: nextLinks });
  }

  function handleSave() {
    if (!footerLinks.length) {
      setValidationError('Debe existir al menos un enlace.');
      return;
    }

    const invalidLink = footerLinks.find(
      (link) => !link.group.trim() || !link.label.trim() || !link.href.trim(),
    );

    if (invalidLink) {
      setSelectedLinkId(invalidLink.id);
      setValidationError('Completa grupo, label y href antes de guardar.');
      return;
    }

    setValidationError('');
    onSave();
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
                <tr
                  key={link.id}
                  className={
                    selectedLink?.id === link.id ? 'bg-red-50/50' : 'bg-white'
                  }
                >
                  <td className='px-4 py-4 font-bold text-neutral-950'>
                    <button
                      type='button'
                      onClick={() => setSelectedLinkId(link.id)}
                      className='text-left font-bold text-neutral-950'
                    >
                      {link.group}
                    </button>
                  </td>
                  <td className='px-4 py-4'>{link.label}</td>
                  <td className='px-4 py-4 text-neutral-500'>{link.href}</td>
                  <td className='px-4 py-4'>{link.locale.toUpperCase()}</td>
                  <td className='px-4 py-4'>
                    <div className='flex justify-end gap-2'>
                      <IconButton
                        label='Subir'
                        onClick={() => moveLink(link.id, -1)}
                      >
                        <FaArrowUp className='h-4 w-4' />
                      </IconButton>
                      <IconButton
                        label='Eliminar'
                        onClick={() => deleteLink(link.id)}
                        disabled={footerLinks.length === 1}
                      >
                        <FaTrashCan className='h-4 w-4' />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title='Editor enlace' eyebrow='Footer / nav'>
        {selectedLink ? (
          <div className='space-y-4'>
            {validationError ? (
              <FormNotice tone='danger'>{validationError}</FormNotice>
            ) : null}
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
            <SelectField
              label='Idioma'
              value={selectedLink.locale}
              options={[
                { label: 'English', value: 'en' },
                { label: 'Espanol', value: 'es' },
              ]}
              onChange={(locale) =>
                updateLink(selectedLink.id, {
                  locale: locale as FooterLink['locale'],
                })
              }
            />
            <div className='grid grid-cols-2 gap-3'>
              <SecondaryButton icon={FaPlus} onClick={addLink}>
                Nuevo
              </SecondaryButton>
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
            <FormNotice tone='danger'>No hay enlaces configurados.</FormNotice>
            <PrimaryButton icon={FaPlus} onClick={addLink}>
              Crear enlace
            </PrimaryButton>
          </div>
        )}
      </Panel>
    </div>
  );
}
