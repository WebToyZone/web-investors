'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FaArrowDown,
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
  DocumentCategory,
  DocumentLocaleFile,
  Locale,
} from '@/components/admin/types';
import {
  FormNotice,
  IconButton,
  MetricCard,
  Panel,
  PrimaryButton,
  SelectField,
  TextField,
} from '@/components/admin/ui';
import { AssetUploadField } from '@/components/admin/upload/AssetUploadField';
import { getAssetUrl } from '@/services/storage/asset-url';
import { createDocumentCategoryAction } from '@/actions/document-categories/create-document-category';
import { updateDocumentCategoryAction } from '@/actions/document-categories/update-document-category';
import { deleteDocumentCategoryAction } from '@/actions/document-categories/delete-document-category';
import { reorderDocumentCategoryAction } from '@/actions/document-categories/reorder-document-category';

type DocumentDraft = {
  categoryId: string;
  year: string;
  date: string;
  en: DocumentLocaleFile;
  es: DocumentLocaleFile;
};

const emptyFile: DocumentLocaleFile = { title: '', fileName: '', size: '' };

function createDefaultDraft(categories: DocumentCategory[]): DocumentDraft {
  return {
    categoryId: categories[0] ? String(categories[0].id) : '',
    year: String(new Date().getFullYear()),
    date: new Date().toISOString().slice(0, 10),
    en: { ...emptyFile },
    es: { ...emptyFile },
  };
}

function draftFromDocument(document: AdminDocument): DocumentDraft {
  return {
    categoryId: String(document.categoryId),
    year: document.year,
    date: document.date,
    en: document.files.en ? { ...document.files.en } : { ...emptyFile },
    es: document.files.es ? { ...document.files.es } : { ...emptyFile },
  };
}

function normalizeFile(file: DocumentLocaleFile): DocumentLocaleFile | null {
  return file.fileName.trim() ? file : null;
}

function bucketKey(document: Pick<AdminDocument, 'categoryId' | 'year'>) {
  return `${document.categoryId}__${document.year}`;
}

function categoryLabel(categories: DocumentCategory[], categoryId: number) {
  return (
    categories.find((category) => category.id === categoryId)?.translations
      .es.name ?? 'Sin categoria'
  );
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
  const { items: documents } = data;

  const [categories, setCategories] = useState<DocumentCategory[]>(
    data.categories,
  );
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [formMode, setFormMode] = useState<'new' | 'edit'>('new');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DocumentDraft>(() =>
    createDefaultDraft(categories),
  );
  const [validationError, setValidationError] = useState('');
  const pendingSaveRef = useRef(false);

  const [newCategoryEn, setNewCategoryEn] = useState('');
  const [newCategoryEs, setNewCategoryEs] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categorySaving, setCategorySaving] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [editCategoryEn, setEditCategoryEn] = useState('');
  const [editCategoryEs, setEditCategoryEs] = useState('');

  const categoryCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const document of documents) {
      counts.set(
        document.categoryId,
        (counts.get(document.categoryId) ?? 0) + 1,
      );
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
        if (firstDocument.categoryId !== secondDocument.categoryId) {
          const firstIndex = categories.findIndex(
            (category) => category.id === firstDocument.categoryId,
          );
          const secondIndex = categories.findIndex(
            (category) => category.id === secondDocument.categoryId,
          );
          return firstIndex - secondIndex;
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
      if (
        categoryFilter !== 'all' &&
        String(document.categoryId) !== categoryFilter
      )
        return false;
      return true;
    });
  }, [categoryFilter, orderedDocuments]);

  const groupedDocuments = useMemo(() => {
    type YearGroup = { year: string; items: typeof filteredDocuments };
    const groups: { categoryId: number; years: YearGroup[] }[] = [];

    for (const document of filteredDocuments) {
      let categoryGroup = groups[groups.length - 1];
      if (!categoryGroup || categoryGroup.categoryId !== document.categoryId) {
        categoryGroup = { categoryId: document.categoryId, years: [] };
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
    const document = documents.find((current) => current.id === id);
    const label = document
      ? `${categoryLabel(categories, document.categoryId)} (${document.year})`
      : '';
    if (
      !window.confirm(
        `Eliminar el documento de ${label}? Esta accion no se puede deshacer.`,
      )
    ) {
      return;
    }

    const nextDocuments = documents.filter((current) => current.id !== id);
    pendingSaveRef.current = true;
    onChange({ ...data, categories, items: nextDocuments });

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

    pendingSaveRef.current = true;
    onChange({ ...data, categories, items: nextDocuments });
    setValidationError('');
  }

  function handleFileChange(locale: Locale, key: string, file: File) {
    updateDraftFile(locale, {
      title: draft[locale].title || file.name.replace(/\.pdf$/i, ''),
      fileName: key,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    });
  }

  function clearDraftFile(locale: Locale) {
    updateDraftFile(locale, { title: '', fileName: '', size: '' });
  }

  function downloadDocumentFile(file: DocumentLocaleFile) {
    window.open(getAssetUrl(file.fileName), '_blank');
  }

  function handleSave() {
    if (!draft.categoryId || !draft.year.trim() || !draft.date.trim()) {
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
    const categoryId = Number(draft.categoryId);

    const nextItems =
      formMode === 'edit' && editingId !== null
        ? documents.map((document) =>
            document.id === editingId
              ? {
                  ...document,
                  categoryId,
                  year: draft.year,
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
              categoryId,
              year: draft.year,
              date: draft.date,
              files,
            },
          ];

    pendingSaveRef.current = true;
    onChange({ ...data, categories, items: nextItems });
    startNewDocument();
  }

  async function addCategory() {
    const en = newCategoryEn.trim();
    const es = newCategoryEs.trim();

    if (!en || !es) {
      setCategoryError('Completa el nombre en ingles y espanol.');
      return;
    }

    setCategorySaving(true);
    setCategoryError('');
    const result = await createDocumentCategoryAction({
      translations: { en: { name: en }, es: { name: es } },
    });
    setCategorySaving(false);

    if (result.error) {
      setCategoryError(result.error);
      return;
    }

    if (result.categories) {
      setCategories(result.categories);
    }
    setNewCategoryEn('');
    setNewCategoryEs('');
  }

  function startEditCategory(category: DocumentCategory) {
    setEditingCategoryId(category.id);
    setEditCategoryEn(category.translations.en.name);
    setEditCategoryEs(category.translations.es.name);
    setCategoryError('');
  }

  async function confirmEditCategory() {
    if (editingCategoryId === null) return;

    const en = editCategoryEn.trim();
    const es = editCategoryEs.trim();

    if (!en || !es) {
      setCategoryError('Completa el nombre en ingles y espanol.');
      return;
    }

    setCategorySaving(true);
    setCategoryError('');
    const result = await updateDocumentCategoryAction({
      id: editingCategoryId,
      translations: { en: { name: en }, es: { name: es } },
    });
    setCategorySaving(false);

    if (result.error) {
      setCategoryError(result.error);
      return;
    }

    if (result.categories) {
      setCategories(result.categories);
    }
    setEditingCategoryId(null);
  }

  async function removeCategory(category: DocumentCategory) {
    if ((categoryCounts.get(category.id) ?? 0) > 0) {
      setCategoryError(
        'No puedes eliminar una categoria con documentos asignados.',
      );
      return;
    }

    if (
      !window.confirm(
        `Eliminar la categoria ${category.translations.es.name}? Esta accion no se puede deshacer.`,
      )
    ) {
      return;
    }

    setCategorySaving(true);
    setCategoryError('');
    const result = await deleteDocumentCategoryAction(category.id);
    setCategorySaving(false);

    if (result.error) {
      setCategoryError(result.error);
      return;
    }

    if (result.categories) {
      setCategories(result.categories);
    }
  }

  async function moveCategory(id: number, direction: -1 | 1) {
    setCategorySaving(true);
    setCategoryError('');
    const result = await reorderDocumentCategoryAction(id, direction);
    setCategorySaving(false);

    if (result.error) {
      setCategoryError(result.error);
      return;
    }

    if (result.categories) {
      setCategories(result.categories);
    }
  }

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <div className='min-w-0 space-y-5'>
        <section className='grid gap-3 sm:grid-cols-2'>
          <MetricCard label='Documentos totales' value={documents.length} />
          <MetricCard label='Categorias' value={categories.length} />
        </section>

        <Panel title='Categorias' eyebrow='Financial Information, Meetings & Notices...'>
          <div className='space-y-3'>
            {categoryError ? (
              <FormNotice tone='danger'>{categoryError}</FormNotice>
            ) : null}

            <ul className='divide-y divide-neutral-200'>
              {categories.map((category, index) => (
                <li key={category.id} className='py-3'>
                  {editingCategoryId === category.id ? (
                    <div className='space-y-2'>
                      <div className='grid grid-cols-2 gap-2'>
                        <input
                          value={editCategoryEn}
                          onChange={(event) =>
                            setEditCategoryEn(event.target.value)
                          }
                          placeholder='Nombre (ingles)'
                          className='min-w-0 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
                          autoFocus
                        />
                        <input
                          value={editCategoryEs}
                          onChange={(event) =>
                            setEditCategoryEs(event.target.value)
                          }
                          placeholder='Nombre (espanol)'
                          className='min-w-0 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
                        />
                      </div>
                      <div className='flex justify-end gap-2'>
                        <IconButton
                          label='Guardar'
                          onClick={confirmEditCategory}
                          disabled={categorySaving}
                        >
                          <FaCheck className='h-4 w-4' />
                        </IconButton>
                        <IconButton
                          label='Cancelar'
                          onClick={() => {
                            setEditingCategoryId(null);
                            setCategoryError('');
                          }}
                          disabled={categorySaving}
                        >
                          <FaXmark className='h-4 w-4' />
                        </IconButton>
                      </div>
                    </div>
                  ) : (
                    <div className='flex items-center gap-3'>
                      <span className='min-w-0 flex-1'>
                        <span className='block truncate font-bold text-neutral-950'>
                          {category.translations.es.name}
                        </span>
                        <span className='block truncate text-xs text-neutral-500'>
                          EN: {category.translations.en.name}
                        </span>
                      </span>
                      <span className='text-xs font-bold text-neutral-500'>
                        {categoryCounts.get(category.id) ?? 0} doc.
                      </span>
                      <IconButton
                        label='Subir'
                        onClick={() => moveCategory(category.id, -1)}
                        disabled={categorySaving || index <= 0}
                      >
                        <FaArrowUp className='h-4 w-4' />
                      </IconButton>
                      <IconButton
                        label='Bajar'
                        onClick={() => moveCategory(category.id, 1)}
                        disabled={
                          categorySaving || index === categories.length - 1
                        }
                      >
                        <FaArrowDown className='h-4 w-4' />
                      </IconButton>
                      <IconButton
                        label='Renombrar'
                        onClick={() => startEditCategory(category)}
                        disabled={categorySaving}
                      >
                        <FaPen className='h-4 w-4' />
                      </IconButton>
                      <IconButton
                        label='Eliminar'
                        onClick={() => removeCategory(category)}
                        disabled={
                          categorySaving ||
                          (categoryCounts.get(category.id) ?? 0) > 0
                        }
                      >
                        <FaTrashCan className='h-4 w-4' />
                      </IconButton>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className='space-y-2 border-t border-neutral-200 pt-3'>
              <div className='grid grid-cols-2 gap-2'>
                <input
                  value={newCategoryEn}
                  onChange={(event) => setNewCategoryEn(event.target.value)}
                  placeholder='Nueva categoria (ingles)'
                  className='min-w-0 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
                />
                <input
                  value={newCategoryEs}
                  onChange={(event) => setNewCategoryEs(event.target.value)}
                  placeholder='Nueva categoria (espanol)'
                  className='min-w-0 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
                />
              </div>
              <div className='flex justify-end'>
                <IconButton
                  label='Anadir categoria'
                  onClick={addCategory}
                  disabled={categorySaving}
                >
                  <FaPlus className='h-4 w-4' />
                </IconButton>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title='Biblioteca de documentos' eyebrow='Categoria > Ano > Documentos'>
          <div className='grid gap-3 border-b border-neutral-200 pb-4'>
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
                {categories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.translations.es.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className='mt-3 text-xs font-bold text-neutral-500'>
            Las flechas ordenan los documentos dentro de su categoria y ano.
          </p>

          <div className='mt-4 space-y-8'>
            {groupedDocuments.map((categoryGroup) => (
              <div key={categoryGroup.categoryId}>
                <h3 className='text-sm font-black uppercase text-brand'>
                  {categoryLabel(categories, categoryGroup.categoryId)}
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
            <h3 className='text-xl font-black text-neutral-950'>
              {formMode === 'edit' ? 'Editar documento' : 'Nuevo documento'}
            </h3>

            <SelectField
              label='Categoria'
              value={draft.categoryId}
              options={categories.map((category) => ({
                label: category.translations.es.name,
                value: String(category.id),
              }))}
              onChange={(nextCategoryId) =>
                updateDraft({ categoryId: nextCategoryId })
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
                  <AssetUploadField
                    kind='documents'
                    accept='application/pdf'
                    label=''
                    value=''
                    onChange={(key, file) => handleFileChange(locale, key, file)}
                    previewVariant='row'
                  />
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
