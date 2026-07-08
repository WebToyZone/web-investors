'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FaArrowDown,
  FaArrowUpFromBracket,
  FaArrowUp,
  FaCheck,
  FaDownload,
  FaFilePdf,
  FaPen,
  FaPlus,
  FaTrashCan,
  FaXmark,
} from 'react-icons/fa6';
import type {
  AdminContent,
  AdminDocument,
  DocumentLocaleFile,
  Locale,
  PublishStatus,
} from '@/components/admin/types';
import {
  FormNotice,
  IconButton,
  MetricCard,
  Panel,
  PrimaryButton,
  SelectField,
  StatusBadge,
  TextField,
} from '@/components/admin/ui';

type DocumentDraft = {
  category: string;
  year: string;
  status: PublishStatus;
  date: string;
  en: DocumentLocaleFile;
  es: DocumentLocaleFile;
};

const emptyFile: DocumentLocaleFile = { title: '', fileName: '', size: '' };

function createDefaultDraft(categories: string[]): DocumentDraft {
  return {
    category: categories[0] ?? '',
    year: String(new Date().getFullYear()),
    status: 'draft',
    date: new Date().toISOString().slice(0, 10),
    en: { ...emptyFile },
    es: { ...emptyFile },
  };
}

function draftFromDocument(document: AdminDocument): DocumentDraft {
  return {
    category: document.category,
    year: document.year,
    status: document.status,
    date: document.date,
    en: document.files.en ? { ...document.files.en } : { ...emptyFile },
    es: document.files.es ? { ...document.files.es } : { ...emptyFile },
  };
}

function normalizeFile(file: DocumentLocaleFile): DocumentLocaleFile | null {
  return file.fileName.trim() ? file : null;
}

function bucketKey(document: Pick<AdminDocument, 'category' | 'year'>) {
  return `${document.category}__${document.year}`;
}

export default function DocumentsAdminSection({
  data,
  onChange,
  onSave,
  isSaving,
  createRequestId,
}: {
  data: AdminContent['documents'];
  onChange: (value: AdminContent['documents']) => void;
  onSave: () => void;
  isSaving: boolean;
  createRequestId: number;
}) {
  const { categories, items: documents } = data;

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [status, setStatus] = useState<'all' | PublishStatus>('all');

  const [formMode, setFormMode] = useState<'new' | 'edit'>('new');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DocumentDraft>(() =>
    createDefaultDraft(categories),
  );
  const [validationError, setValidationError] = useState('');
  const pendingSaveRef = useRef(false);

  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [renamingCategory, setRenamingCategory] = useState<string | null>(
    null,
  );
  const [renameValue, setRenameValue] = useState('');

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const document of documents) {
      counts.set(document.category, (counts.get(document.category) ?? 0) + 1);
    }
    return counts;
  }, [documents]);

  const orderedDocuments = useMemo(() => {
    return documents
      .map((document, index) => ({
        ...document,
        order: document.order ?? index + 1,
      }))
      .sort((firstDocument, secondDocument) => {
        if (firstDocument.category !== secondDocument.category) {
          return (
            categories.indexOf(firstDocument.category) -
            categories.indexOf(secondDocument.category)
          );
        }

        if (firstDocument.year !== secondDocument.year) {
          return secondDocument.year.localeCompare(firstDocument.year);
        }

        if (firstDocument.order !== secondDocument.order) {
          return firstDocument.order - secondDocument.order;
        }

        return firstDocument.id - secondDocument.id;
      });
  }, [categories, documents]);

  const filteredDocuments = useMemo(() => {
    return orderedDocuments.filter((document) => {
      if (categoryFilter !== 'all' && document.category !== categoryFilter)
        return false;
      if (status !== 'all' && document.status !== status) return false;
      return true;
    });
  }, [categoryFilter, orderedDocuments, status]);

  const groupedDocuments = useMemo(() => {
    type YearGroup = { year: string; items: typeof filteredDocuments };
    const groups: { category: string; years: YearGroup[] }[] = [];

    for (const document of filteredDocuments) {
      let categoryGroup = groups[groups.length - 1];
      if (!categoryGroup || categoryGroup.category !== document.category) {
        categoryGroup = { category: document.category, years: [] };
        groups.push(categoryGroup);
      }

      let yearGroup = categoryGroup.years[categoryGroup.years.length - 1];
      if (!yearGroup || yearGroup.year !== document.year) {
        yearGroup = { year: document.year, items: [] };
        categoryGroup.years.push(yearGroup);
      }

      yearGroup.items.push(document);
    }

    return groups;
  }, [filteredDocuments]);

  const startNewDocument = useCallback(() => {
    setFormMode('new');
    setEditingId(null);
    setDraft(createDefaultDraft(categories));
    setValidationError('');
  }, [categories]);

  function startEditDocument(document: AdminDocument) {
    setFormMode('edit');
    setEditingId(document.id);
    setDraft(draftFromDocument(document));
    setValidationError('');
  }

  function updateDraft(patch: Partial<DocumentDraft>) {
    setValidationError('');
    setDraft((current) => ({ ...current, ...patch }));
  }

  function updateDraftFile(locale: Locale, patch: Partial<DocumentLocaleFile>) {
    setValidationError('');
    setDraft((current) => ({
      ...current,
      [locale]: { ...current[locale], ...patch },
    }));
  }

  const lastCreateRequestId = useRef(createRequestId);

  useEffect(() => {
    if (createRequestId === lastCreateRequestId.current) {
      return;
    }

    lastCreateRequestId.current = createRequestId;
    startNewDocument();
  }, [createRequestId, startNewDocument]);

  useEffect(() => {
    if (!pendingSaveRef.current) {
      return;
    }

    pendingSaveRef.current = false;
    onSave();
  }, [documents, onSave]);

  function deleteDocument(id: number) {
    const nextDocuments = documents.filter((document) => document.id !== id);
    onChange({ ...data, items: nextDocuments });

    if (editingId === id) {
      startNewDocument();
    }
  }

  function moveDocument(id: number, direction: -1 | 1) {
    const current = documents.find((document) => document.id === id);
    if (!current) return;

    const bucketPeers = orderedDocuments.filter(
      (document) => bucketKey(document) === bucketKey(current),
    );
    const currentIndex = bucketPeers.findIndex(
      (document) => document.id === id,
    );
    const targetIndex = currentIndex + direction;

    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= bucketPeers.length
    ) {
      return;
    }

    const targetDocument = bucketPeers[targetIndex];
    const currentDocument = bucketPeers[currentIndex];

    const normalizedDocuments = documents.map((document, index) => ({
      ...document,
      order: document.order ?? index + 1,
    }));

    const nextDocuments = normalizedDocuments.map((document) => {
      if (document.id === currentDocument.id) {
        return { ...document, order: targetDocument.order };
      }

      if (document.id === targetDocument.id) {
        return { ...document, order: currentDocument.order };
      }

      return document;
    });

    onChange({ ...data, items: nextDocuments });
    setValidationError('');
  }

  function handleFileChange(locale: Locale, file: File | undefined) {
    if (!file) {
      return;
    }

    updateDraftFile(locale, {
      title: draft[locale].title || file.name.replace(/\.pdf$/i, ''),
      fileName: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    });
  }

  function clearDraftFile(locale: Locale) {
    updateDraftFile(locale, { title: '', fileName: '', size: '' });
  }

  function downloadDocumentFile(file: DocumentLocaleFile) {
    const href = file.fileName.startsWith('/')
      ? file.fileName
      : `/documents/${file.fileName}`;
    const link = window.document.createElement('a');
    link.href = href;
    link.download = file.fileName;
    link.click();
  }

  function handleSave() {
    if (!draft.category.trim() || !draft.year.trim() || !draft.date.trim()) {
      setValidationError('Completa categoria, ano y fecha.');
      return;
    }

    const en = normalizeFile(draft.en);
    const es = normalizeFile(draft.es);

    if (!en && !es) {
      setValidationError(
        'Sube al menos un archivo (ingles o espanol) para este documento.',
      );
      return;
    }

    if (en && !en.title.trim()) {
      setValidationError('Falta el titulo del archivo en ingles.');
      return;
    }

    if (es && !es.title.trim()) {
      setValidationError('Falta el titulo del archivo en espanol.');
      return;
    }

    const files = { en, es };

    const nextItems =
      formMode === 'edit' && editingId !== null
        ? documents.map((document) =>
            document.id === editingId
              ? {
                  ...document,
                  category: draft.category,
                  year: draft.year,
                  status: draft.status,
                  date: draft.date,
                  files,
                }
              : document,
          )
        : [
            ...documents,
            {
              id:
                Math.max(0, ...documents.map((document) => document.id)) + 1,
              order:
                Math.max(
                  0,
                  ...documents.map(
                    (document, index) => document.order ?? index + 1,
                  ),
                ) + 1,
              downloads: 0,
              category: draft.category,
              year: draft.year,
              status: draft.status,
              date: draft.date,
              files,
            },
          ];

    pendingSaveRef.current = true;
    onChange({ ...data, items: nextItems });
    startNewDocument();
  }

  function addCategory() {
    const trimmed = newCategory.trim();
    if (!trimmed) {
      setCategoryError('Escribe un nombre de categoria.');
      return;
    }

    if (categories.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      setCategoryError('Esa categoria ya existe.');
      return;
    }

    onChange({ ...data, categories: [...categories, trimmed] });
    setNewCategory('');
    setCategoryError('');
  }

  function startRenameCategory(category: string) {
    setRenamingCategory(category);
    setRenameValue(category);
    setCategoryError('');
  }

  function confirmRenameCategory() {
    if (!renamingCategory) return;

    const trimmed = renameValue.trim();
    if (!trimmed) {
      setCategoryError('Escribe un nombre de categoria.');
      return;
    }

    if (
      trimmed.toLowerCase() !== renamingCategory.toLowerCase() &&
      categories.some((item) => item.toLowerCase() === trimmed.toLowerCase())
    ) {
      setCategoryError('Esa categoria ya existe.');
      return;
    }

    const nextCategories = categories.map((item) =>
      item === renamingCategory ? trimmed : item,
    );
    const nextItems = documents.map((document) =>
      document.category === renamingCategory
        ? { ...document, category: trimmed }
        : document,
    );

    onChange({ ...data, categories: nextCategories, items: nextItems });
    setRenamingCategory(null);
    setRenameValue('');
    setCategoryError('');
  }

  function deleteCategory(category: string) {
    if ((categoryCounts.get(category) ?? 0) > 0) {
      setCategoryError(
        'No puedes eliminar una categoria con documentos asignados.',
      );
      return;
    }

    onChange({
      ...data,
      categories: categories.filter((item) => item !== category),
    });
    setCategoryError('');
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

        <Panel title='Categorias' eyebrow='Financial Information, Meetings & Notices...'>
          <div className='space-y-3'>
            {categoryError ? (
              <FormNotice tone='danger'>{categoryError}</FormNotice>
            ) : null}

            <ul className='divide-y divide-neutral-200'>
              {categories.map((category) => (
                <li
                  key={category}
                  className='flex items-center gap-3 py-3'
                >
                  {renamingCategory === category ? (
                    <>
                      <input
                        value={renameValue}
                        onChange={(event) => setRenameValue(event.target.value)}
                        className='min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
                        autoFocus
                      />
                      <IconButton label='Guardar' onClick={confirmRenameCategory}>
                        <FaCheck className='h-4 w-4' />
                      </IconButton>
                      <IconButton
                        label='Cancelar'
                        onClick={() => {
                          setRenamingCategory(null);
                          setCategoryError('');
                        }}
                      >
                        <FaXmark className='h-4 w-4' />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <span className='min-w-0 flex-1 truncate font-bold text-neutral-950'>
                        {category}
                      </span>
                      <span className='text-xs font-bold text-neutral-500'>
                        {categoryCounts.get(category) ?? 0} doc.
                      </span>
                      <IconButton
                        label='Renombrar'
                        onClick={() => startRenameCategory(category)}
                      >
                        <FaPen className='h-4 w-4' />
                      </IconButton>
                      <IconButton
                        label='Eliminar'
                        onClick={() => deleteCategory(category)}
                        disabled={(categoryCounts.get(category) ?? 0) > 0}
                      >
                        <FaTrashCan className='h-4 w-4' />
                      </IconButton>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <div className='flex items-center gap-3 border-t border-neutral-200 pt-3'>
              <input
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder='Nueva categoria'
                className='min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
              />
              <IconButton label='Anadir categoria' onClick={addCategory}>
                <FaPlus className='h-4 w-4' />
              </IconButton>
            </div>
          </div>
        </Panel>

        <Panel title='Biblioteca de documentos' eyebrow='Categoria > Ano > Documentos'>
          <div className='grid gap-3 border-b border-neutral-200 pb-4 md:grid-cols-2'>
            <label className='block'>
              <span className='text-xs font-bold uppercase text-neutral-500'>
                Categoria
              </span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
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

          <p className='mt-3 text-xs font-bold text-neutral-500'>
            Las flechas ordenan los documentos dentro de su categoria y ano.
          </p>

          <div className='mt-4 space-y-8'>
            {groupedDocuments.map((categoryGroup) => (
              <div key={categoryGroup.category}>
                <h3 className='text-sm font-black uppercase text-brand'>
                  {categoryGroup.category}
                </h3>

                <div className='mt-3 space-y-5'>
                  {categoryGroup.years.map((yearGroup) => (
                    <div key={yearGroup.year}>
                      <span className='inline-block rounded bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600'>
                        {yearGroup.year}
                      </span>

                      <div className='mt-2 overflow-x-auto'>
                        <table className='w-full min-w-[760px] text-left text-sm'>
                          <thead className='border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-500'>
                            <tr>
                              <th scope='col' className='px-4 py-3'>
                                Documento
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
                            {yearGroup.items.map((document, indexInGroup) => (
                              <tr
                                key={document.id}
                                className={
                                  formMode === 'edit' &&
                                  editingId === document.id
                                    ? 'bg-red-50/50'
                                    : 'bg-white'
                                }
                              >
                                <td className='px-4 py-4'>
                                  <div className='flex min-w-0 items-center gap-3'>
                                    <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-brand'>
                                      <FaFilePdf className='h-5 w-5' />
                                    </span>
                                    <span className='min-w-0'>
                                      {(['en', 'es'] as const).map(
                                        (locale) => {
                                          const file = document.files[locale];
                                          return (
                                            <span
                                              key={locale}
                                              className='block truncate text-neutral-950'
                                            >
                                              <span className='mr-1 text-xs font-bold uppercase text-neutral-400'>
                                                {locale}
                                              </span>
                                              {file ? (
                                                <span className='font-bold'>
                                                  {file.title}{' '}
                                                  <span className='font-normal text-neutral-500'>
                                                    ({file.size})
                                                  </span>
                                                </span>
                                              ) : (
                                                <span className='italic text-neutral-400'>
                                                  pendiente
                                                </span>
                                              )}
                                            </span>
                                          );
                                        },
                                      )}
                                    </span>
                                  </div>
                                </td>
                                <td className='px-4 py-4 text-neutral-700'>
                                  {document.date}
                                </td>
                                <td className='px-4 py-4'>
                                  <StatusBadge status={document.status} />
                                </td>
                                <td className='px-4 py-4'>
                                  <div className='flex justify-end gap-2'>
                                    <IconButton
                                      label='Editar'
                                      onClick={() =>
                                        startEditDocument(document)
                                      }
                                    >
                                      <FaPen className='h-4 w-4' />
                                    </IconButton>
                                    <IconButton
                                      label='Subir'
                                      onClick={() =>
                                        moveDocument(document.id, -1)
                                      }
                                      disabled={indexInGroup <= 0}
                                    >
                                      <FaArrowUp className='h-4 w-4' />
                                    </IconButton>
                                    <IconButton
                                      label='Bajar'
                                      onClick={() =>
                                        moveDocument(document.id, 1)
                                      }
                                      disabled={
                                        indexInGroup ===
                                        yearGroup.items.length - 1
                                      }
                                    >
                                      <FaArrowDown className='h-4 w-4' />
                                    </IconButton>
                                    <IconButton
                                      label='Eliminar'
                                      onClick={() =>
                                        deleteDocument(document.id)
                                      }
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
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {groupedDocuments.length === 0 ? (
              <p className='py-6 text-center text-sm text-neutral-500'>
                No hay documentos que coincidan con los filtros.
              </p>
            ) : null}
          </div>
        </Panel>
      </div>

      <aside className='space-y-5'>
        <Panel title='Edicion rapida' eyebrow='Documento seleccionado'>
          <div className='space-y-4'>
            {validationError ? (
              <FormNotice tone='danger'>{validationError}</FormNotice>
            ) : null}
            <div className='flex items-start justify-between gap-3'>
              <h3 className='text-xl font-black text-neutral-950'>
                {formMode === 'edit' ? 'Editar documento' : 'Nuevo documento'}
              </h3>
              <StatusBadge status={draft.status} />
            </div>

            <SelectField
              label='Categoria'
              value={draft.category}
              options={categories.map((item) => ({
                label: item,
                value: item,
              }))}
              onChange={(nextCategory) =>
                updateDraft({ category: nextCategory })
              }
            />
            <div className='grid grid-cols-2 gap-3'>
              <TextField
                label='Ano'
                value={draft.year}
                onChange={(year) => updateDraft({ year })}
              />
              <TextField
                label='Fecha'
                type='date'
                value={draft.date}
                onChange={(date) => updateDraft({ date })}
              />
            </div>
            <SelectField
              label='Estado'
              value={draft.status}
              options={[
                { label: 'Publicado', value: 'published' },
                { label: 'Borrador', value: 'draft' },
                { label: 'Programado', value: 'scheduled' },
              ]}
              onChange={(nextStatus) =>
                updateDraft({ status: nextStatus as PublishStatus })
              }
            />

            {(['en', 'es'] as const).map((locale) => (
              <div
                key={locale}
                className='space-y-3 rounded-md border border-neutral-200 p-3'
              >
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold uppercase text-neutral-500'>
                    Archivo {locale === 'en' ? 'ingles' : 'espanol'}
                  </span>
                  {draft[locale].fileName ? (
                    <IconButton
                      label='Quitar archivo'
                      onClick={() => clearDraftFile(locale)}
                    >
                      <FaXmark className='h-4 w-4' />
                    </IconButton>
                  ) : null}
                </div>
                <TextField
                  label='Titulo'
                  value={draft[locale].title}
                  onChange={(title) => updateDraftFile(locale, { title })}
                />
                {draft[locale].fileName ? (
                  <div className='flex items-center justify-between gap-2 rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-600'>
                    <span className='truncate'>
                      {draft[locale].fileName} - {draft[locale].size}
                    </span>
                    <IconButton
                      label='Descargar'
                      onClick={() => downloadDocumentFile(draft[locale])}
                    >
                      <FaDownload className='h-4 w-4' />
                    </IconButton>
                  </div>
                ) : (
                  <div className='flex h-24 flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 text-center'>
                    <FaArrowUpFromBracket className='h-5 w-5 text-brand' />
                    <p className='mt-2 text-xs font-bold text-neutral-950'>
                      Sube PDF
                    </p>
                    <input
                      type='file'
                      accept='application/pdf'
                      onChange={(event) =>
                        handleFileChange(locale, event.target.files?.[0])
                      }
                      className='mt-2 max-w-full text-xs text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white'
                    />
                  </div>
                )}
              </div>
            ))}

            <p className='text-xs text-neutral-500'>
              Puedes guardar con un solo idioma cargado; el otro quedara
              marcado como pendiente hasta que lo subas.
            </p>

            <PrimaryButton
              icon={FaCheck}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </PrimaryButton>
          </div>
        </Panel>
      </aside>
    </div>
  );
}
