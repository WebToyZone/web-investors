'use client';

import { useMemo, useState } from 'react';
import {
  FaArrowUpFromBracket,
  FaCheck,
  FaDownload,
  FaFilePdf,
  FaGlobe,
  FaPen,
  FaPlus,
  FaRegFileLines,
  FaTrashCan,
} from 'react-icons/fa6';
import type {
  AdminContent,
  AdminDocument,
  Locale,
  PublishStatus,
} from '@/components/admin/types';
import {
  FormNotice,
  IconButton,
  MetricCard,
  Panel,
  PrimaryButton,
  SecondaryButton,
  SelectField,
  StatusBadge,
  TextField,
} from '@/components/admin/ui';

export default function DocumentsAdminSection({
  data,
  onChange,
  onSave,
  isSaving,
}: {
  data: AdminContent['documents'];
  onChange: (value: AdminContent['documents']) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  const [locale, setLocale] = useState<'all' | Locale>('all');
  const [status, setStatus] = useState<'all' | PublishStatus>('all');
  const [category, setCategory] = useState('all');
  const [selectedDocumentId, setSelectedDocumentId] = useState(
    data.items[0]?.id ?? 0,
  );
  const [validationError, setValidationError] = useState('');
  const { categories, items: documents } = data;

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

  function updateDocument(id: number, patch: Partial<AdminDocument>) {
    setValidationError('');
    onChange({
      ...data,
      items: documents.map((document) =>
        document.id === id ? { ...document, ...patch } : document,
      ),
    });
  }

  function addDocument(file?: File) {
    const nextId = Math.max(0, ...documents.map((document) => document.id)) + 1;
    const fileName = file?.name ?? 'nuevo-documento.pdf';
    const nextDocument: AdminDocument = {
      id: nextId,
      title: file?.name.replace(/\.pdf$/i, '') ?? 'Nuevo documento',
      category: categories[0] ?? 'Investors Documents',
      year: String(new Date().getFullYear()),
      locale: 'en',
      status: 'draft',
      date: new Date().toISOString().slice(0, 10),
      fileName,
      size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : '0 MB',
      downloads: 0,
    };

    setSelectedDocumentId(nextId);
    onChange({ ...data, items: [...documents, nextDocument] });
    setValidationError('');
  }

  function deleteDocument(id: number) {
    const nextDocuments = documents.filter((document) => document.id !== id);
    setSelectedDocumentId(nextDocuments[0]?.id ?? 0);
    onChange({ ...data, items: nextDocuments });
    setValidationError('');
  }

  function handleFileChange(file: File | undefined) {
    if (!file) {
      return;
    }

    addDocument(file);
  }

  function handleSave() {
    if (!documents.length) {
      setValidationError('Debe existir al menos un documento.');
      return;
    }

    const invalidDocument = documents.find(
      (document) =>
        !document.title.trim() ||
        !document.category.trim() ||
        !document.year.trim() ||
        !document.date.trim() ||
        !document.fileName.trim(),
    );

    if (invalidDocument) {
      setSelectedDocumentId(invalidDocument.id);
      setValidationError('Completa titulo, categoria, ano, fecha y archivo.');
      return;
    }

    const invalidPdf = documents.find(
      (document) => !document.fileName.toLowerCase().endsWith('.pdf'),
    );

    if (invalidPdf) {
      setSelectedDocumentId(invalidPdf.id);
      setValidationError('El archivo del documento debe terminar en .pdf.');
      return;
    }

    setValidationError('');
    onSave();
  }

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
                {categories.map((item) => (
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
                        <IconButton
                          label='Eliminar'
                          onClick={() => deleteDocument(document.id)}
                          disabled={documents.length === 1}
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
      </div>

      <aside className='space-y-5'>
        <Panel title='Edicion rapida' eyebrow='Documento seleccionado'>
          {selectedDocument ? (
            <div className='space-y-4'>
              {validationError ? (
                <FormNotice tone='danger'>{validationError}</FormNotice>
              ) : null}
              <div className='flex items-start justify-between gap-3'>
                <h3 className='text-xl font-black text-neutral-950'>
                  {selectedDocument.title}
                </h3>
                <StatusBadge status={selectedDocument.status} />
              </div>
              <TextField
                label='Titulo'
                value={selectedDocument.title}
                onChange={(title) =>
                  updateDocument(selectedDocument.id, { title })
                }
              />
              <SelectField
                label='Categoria'
                value={selectedDocument.category}
                options={categories.map((item) => ({
                  label: item,
                  value: item,
                }))}
                onChange={(nextCategory) =>
                  updateDocument(selectedDocument.id, {
                    category: nextCategory,
                  })
                }
              />
              <div className='grid grid-cols-2 gap-3'>
                <TextField
                  label='Ano'
                  value={selectedDocument.year}
                  onChange={(year) =>
                    updateDocument(selectedDocument.id, { year })
                  }
                />
                <TextField
                  label='Fecha'
                  value={selectedDocument.date}
                  onChange={(date) =>
                    updateDocument(selectedDocument.id, { date })
                  }
                />
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <SelectField
                  label='Idioma'
                  value={selectedDocument.locale}
                  options={[
                    { label: 'English', value: 'en' },
                    { label: 'Espanol', value: 'es' },
                  ]}
                  onChange={(nextLocale) =>
                    updateDocument(selectedDocument.id, {
                      locale: nextLocale as Locale,
                    })
                  }
                />
                <SelectField
                  label='Estado'
                  value={selectedDocument.status}
                  options={[
                    { label: 'Publicado', value: 'published' },
                    { label: 'Borrador', value: 'draft' },
                    { label: 'Programado', value: 'scheduled' },
                  ]}
                  onChange={(nextStatus) =>
                    updateDocument(selectedDocument.id, {
                      status: nextStatus as PublishStatus,
                    })
                  }
                />
              </div>
              <TextField
                label='Archivo'
                value={selectedDocument.fileName}
                onChange={(fileName) =>
                  updateDocument(selectedDocument.id, { fileName })
                }
              />
              <TextField
                label='Tamano'
                value={selectedDocument.size}
                onChange={(size) => updateDocument(selectedDocument.id, { size })}
              />
              <div className='grid grid-cols-2 gap-3'>
                <SecondaryButton icon={FaRegFileLines} onClick={() => addDocument()}>
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
              <FormNotice tone='danger'>No hay documentos configurados.</FormNotice>
              <PrimaryButton icon={FaPlus} onClick={() => addDocument()}>
                Crear documento
              </PrimaryButton>
            </div>
          )}
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
              onChange={(event) => handleFileChange(event.target.files?.[0])}
              className='mt-3 max-w-full text-xs text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white'
            />
          </div>
        </section>
      </aside>
    </div>
  );
}
