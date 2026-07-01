'use client';

import { useMemo, useState } from 'react';
import {
  FaArrowUpFromBracket,
  FaCheck,
  FaDownload,
  FaFilePdf,
  FaGlobe,
  FaPen,
  FaRegFileLines,
  FaTrashCan,
} from 'react-icons/fa6';
import {
  documentCategories,
  documents,
} from '@/components/admin/mock-data';
import type { Locale, PublishStatus } from '@/components/admin/types';
import {
  IconButton,
  MetricCard,
  Panel,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  TextField,
} from '@/components/admin/ui';

export default function DocumentsAdminSection() {
  const [locale, setLocale] = useState<'all' | Locale>('all');
  const [status, setStatus] = useState<'all' | PublishStatus>('all');
  const [category, setCategory] = useState('all');
  const [selectedDocumentId, setSelectedDocumentId] = useState(1);

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      if (locale !== 'all' && document.locale !== locale) return false;
      if (status !== 'all' && document.status !== status) return false;
      if (category !== 'all' && document.category !== category) return false;
      return true;
    });
  }, [category, locale, status]);

  const selectedDocument =
    documents.find((document) => document.id === selectedDocumentId) ??
    documents[0];

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <div className='min-w-0 space-y-5'>
        <section className='grid gap-3 sm:grid-cols-3'>
          <MetricCard
            label='Publicados'
            value={documents.filter((item) => item.status === 'published').length}
          />
          <MetricCard
            label='Borradores'
            value={documents.filter((item) => item.status === 'draft').length}
          />
          <MetricCard
            label='Programados'
            value={
              documents.filter((item) => item.status === 'scheduled').length
            }
          />
        </section>

        <Panel title='Biblioteca de documentos' eyebrow='PDFs'>
          <div className='grid gap-3 border-b border-neutral-200 pb-4 md:grid-cols-3'>
            <label className='block'>
              <span className='text-xs font-bold uppercase text-neutral-500'>
                Idioma
              </span>
              <select
                value={locale}
                onChange={(event) =>
                  setLocale(event.target.value as 'all' | Locale)
                }
                className='mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
              >
                <option value='all'>Todos</option>
                <option value='en'>English</option>
                <option value='es'>Espanol</option>
              </select>
            </label>

            <label className='block'>
              <span className='text-xs font-bold uppercase text-neutral-500'>
                Categoria
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className='mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
              >
                <option value='all'>Todas</option>
                {documentCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className='block'>
              <span className='text-xs font-bold uppercase text-neutral-500'>
                Estado
              </span>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as 'all' | PublishStatus)
                }
                className='mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
              >
                <option value='all'>Todos</option>
                <option value='published'>Publicado</option>
                <option value='draft'>Borrador</option>
                <option value='scheduled'>Programado</option>
              </select>
            </label>
          </div>

          <div className='mt-4 overflow-x-auto'>
            <table className='w-full min-w-[860px] text-left text-sm'>
              <thead className='border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-500'>
                <tr>
                  <th scope='col' className='px-4 py-3'>
                    Documento
                  </th>
                  <th scope='col' className='px-4 py-3'>
                    Categoria
                  </th>
                  <th scope='col' className='px-4 py-3'>
                    Fecha
                  </th>
                  <th scope='col' className='px-4 py-3'>
                    Estado
                  </th>
                  <th scope='col' className='px-4 py-3 text-right'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-neutral-200'>
                {filteredDocuments.map((document) => (
                  <tr
                    key={document.id}
                    className={
                      selectedDocumentId === document.id
                        ? 'bg-red-50/50'
                        : 'bg-white'
                    }
                  >
                    <td className='px-4 py-4'>
                      <button
                        type='button'
                        onClick={() => setSelectedDocumentId(document.id)}
                        className='flex min-w-0 items-center gap-3 text-left'
                      >
                        <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-brand'>
                          <FaFilePdf className='h-5 w-5' />
                        </span>
                        <span className='min-w-0'>
                          <span className='block truncate font-bold text-neutral-950'>
                            {document.title}
                          </span>
                          <span className='mt-0.5 flex items-center gap-2 text-xs text-neutral-500'>
                            <FaGlobe className='h-3 w-3' />
                            {document.locale.toUpperCase()} -{' '}
                            {document.fileName} - {document.size}
                          </span>
                        </span>
                      </button>
                    </td>
                    <td className='px-4 py-4 text-neutral-700'>
                      {document.category}
                    </td>
                    <td className='px-4 py-4 text-neutral-700'>
                      {document.date}
                    </td>
                    <td className='px-4 py-4'>
                      <StatusBadge status={document.status} />
                    </td>
                    <td className='px-4 py-4'>
                      <div className='flex justify-end gap-2'>
                        <IconButton label='Editar'>
                          <FaPen className='h-4 w-4' />
                        </IconButton>
                        <IconButton label='Descargar'>
                          <FaDownload className='h-4 w-4' />
                        </IconButton>
                        <IconButton label='Eliminar'>
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
      </div>

      <aside className='space-y-5'>
        <Panel title='Edicion rapida' eyebrow='Documento seleccionado'>
          <div className='space-y-4'>
            <div className='flex items-start justify-between gap-3'>
              <h3 className='text-xl font-black text-neutral-950'>
                {selectedDocument.title}
              </h3>
              <StatusBadge status={selectedDocument.status} />
            </div>
            <TextField label='Titulo' value={selectedDocument.title} />
            <div className='grid grid-cols-2 gap-3'>
              <TextField label='Ano' value={selectedDocument.year} />
              <TextField
                label='Idioma'
                value={selectedDocument.locale.toUpperCase()}
              />
            </div>
            <TextField label='Archivo' value={selectedDocument.fileName} />
            <div className='grid grid-cols-2 gap-3'>
              <SecondaryButton icon={FaRegFileLines}>Guardar</SecondaryButton>
              <PrimaryButton icon={FaCheck}>Publicar</PrimaryButton>
            </div>
          </div>
        </Panel>

        <section className='rounded-md border border-dashed border-neutral-300 bg-white p-5'>
          <div className='flex h-36 flex-col items-center justify-center rounded-md bg-neutral-50 px-4 text-center'>
            <FaArrowUpFromBracket className='h-7 w-7 text-brand' />
            <p className='mt-3 text-sm font-bold text-neutral-950'>
              Arrastra un PDF o selecciona archivo
            </p>
            <p className='mt-1 text-xs text-neutral-500'>
              PDF hasta 25 MB. Se guardara como borrador.
            </p>
            <input
              type='file'
              accept='application/pdf'
              className='mt-3 max-w-full text-xs text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white'
            />
          </div>
        </section>
      </aside>
    </div>
  );
}
