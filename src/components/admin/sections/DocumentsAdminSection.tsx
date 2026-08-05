'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaCheck,
  FaDownload,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaPen,
  FaPlus,
  FaTrashCan,
  FaXmark,
} from 'react-icons/fa6';
import type { IconType } from 'react-icons';
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
import { DOCUMENT_FILE_ACCEPT } from '@/schemas/storage.schema';
import { uploadAsset } from '@/components/admin/upload/upload-asset';
import { discardUploads } from '@/actions/storage/discard-uploads';
import { getAssetUrl } from '@/services/storage/asset-url';
import { createDocumentCategoryAction } from '@/actions/document-categories/create-document-category';
import { updateDocumentCategoryAction } from '@/actions/document-categories/update-document-category';
import { deleteDocumentCategoryAction } from '@/actions/document-categories/delete-document-category';
import { reorderDocumentCategoryAction } from '@/actions/document-categories/reorder-document-category';

/**
 * Whether both languages point at the same uploaded file. It is never stored:
 * a document is shared exactly when its two locales carry the same S3 key, so
 * the mode is derived on open and can never drift from the data.
 */
type FileMode = 'shared' | 'perLocale';

/** Upload targets: one box per language, or a single shared one. */
type FileSlot = Locale | 'shared';

type UploadedAsset = Pick<DocumentLocaleFile, 'fileName' | 'size'>;

const LOCALES: Locale[] = ['en', 'es'];

type DocumentDraft = {
  categoryId: string;
  year: string;
  date: string;
  fileMode: FileMode;
  en: DocumentLocaleFile;
  es: DocumentLocaleFile;
};

const emptyFile: DocumentLocaleFile = { title: '', fileName: '', size: '' };

const GLYPH_BY_EXTENSION: Record<string, IconType> = {
  xlsx: FaFileExcel,
  xls: FaFileExcel,
  csv: FaFileCsv,
};

/** Row glyph. Documents are usually PDFs, but spreadsheets are allowed too. */
function FileGlyph({ fileName }: { fileName: string }) {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  const Icon = GLYPH_BY_EXTENSION[extension] ?? FaFilePdf;
  return <Icon className='h-5 w-5' />;
}

function createDefaultDraft(categories: DocumentCategory[]): DocumentDraft {
  return {
    categoryId: categories[0] ? String(categories[0].id) : '',
    year: String(new Date().getFullYear()),
    date: new Date().toISOString().slice(0, 10),
    fileMode: 'perLocale',
    en: { ...emptyFile },
    es: { ...emptyFile },
  };
}

function draftFromDocument(document: AdminDocument): DocumentDraft {
  const enFileName = document.files.en?.fileName ?? '';
  const esFileName = document.files.es?.fileName ?? '';

  return {
    categoryId: String(document.categoryId),
    year: document.year,
    date: document.date,
    fileMode: enFileName && enFileName === esFileName ? 'shared' : 'perLocale',
    en: document.files.en ? { ...document.files.en } : { ...emptyFile },
    es: document.files.es ? { ...document.files.es } : { ...emptyFile },
  };
}

function bucketKey(document: Pick<AdminDocument, 'categoryId' | 'year'>) {
  return `${document.categoryId}__${document.year}`;
}

function categoryLabel(categories: DocumentCategory[], categoryId: number) {
  return (
    categories.find((category) => category.id === categoryId)?.translations
      .es.name ?? 'Sin categoría'
  );
}

/**
 * Single source of truth for the documents grid. Every category/year group
 * renders through here with the same fixed column layout, so the Fecha and
 * Acciones columns land in the same place regardless of how long the titles
 * in any given group happen to be.
 */
function DocumentsTable({
  items,
  editingDocumentId,
  onEdit,
  onMove,
  onDelete,
}: {
  items: AdminDocument[];
  editingDocumentId: number | null;
  onEdit: (document: AdminDocument) => void;
  onMove: (id: number, direction: -1 | 1) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-[680px] table-fixed text-left text-sm'>
        <colgroup>
          <col />
          <col className='w-[140px]' />
          <col className='w-[220px]' />
        </colgroup>
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
          {items.map((document, indexInGroup) => (
            <tr
              key={document.id}
              className={
                editingDocumentId === document.id ? 'bg-red-50/50' : 'bg-white'
              }
            >
              <td className='px-4 py-4 align-middle'>
                <div className='flex min-w-0 items-center gap-3'>
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-brand'>
                    <FileGlyph
                      fileName={
                        (document.files.en ?? document.files.es)?.fileName ?? ''
                      }
                    />
                  </span>
                  <span className='min-w-0'>
                    {(['en', 'es'] as const).map((locale) => {
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
                    })}
                  </span>
                </div>
              </td>
              <td className='px-4 py-4 align-middle text-neutral-700'>
                {document.date}
              </td>
              <td className='px-4 py-4 align-middle'>
                <div className='flex justify-end gap-2'>
                  <IconButton label='Editar' onClick={() => onEdit(document)}>
                    <FaPen className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Subir'
                    onClick={() => onMove(document.id, -1)}
                    disabled={indexInGroup <= 0}
                  >
                    <FaArrowUp className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Bajar'
                    onClick={() => onMove(document.id, 1)}
                    disabled={indexInGroup === items.length - 1}
                  >
                    <FaArrowDown className='h-4 w-4' />
                  </IconButton>
                  <IconButton
                    label='Eliminar'
                    onClick={() => onDelete(document.id)}
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
  const [pendingFiles, setPendingFiles] = useState<{
    en?: File;
    es?: File;
    shared?: File;
  }>({});
  // Which language's existing file becomes the shared one. Only consulted
  // while sharing without a freshly uploaded file to override both.
  const [sharedSource, setSharedSource] = useState<Locale>('en');
  const [isUploading, setIsUploading] = useState(false);
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

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = new Set<string>();
    for (let year = currentYear + 1; year >= currentYear - 15; year--) {
      years.add(String(year));
    }
    if (draft.year) {
      years.add(draft.year);
    }
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [draft.year]);

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
    setPendingFiles({});
    setSharedSource('en');
    setValidationError('');
  }, [categories]);

  function startEditDocument(document: AdminDocument) {
    setFormMode('edit');
    setEditingId(document.id);
    setDraft(draftFromDocument(document));
    setPendingFiles({});
    setSharedSource('en');
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
        `¿Eliminar el documento de ${label}? Esta acción no se puede deshacer.`,
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

  function handleFileSelected(slot: FileSlot, file: File) {
    setValidationError('');
    setPendingFiles((current) => ({ ...current, [slot]: file }));

    // A shared upload seeds both titles, since both languages describe it.
    const derivedTitle = file.name.replace(/\.[^.]+$/, '');
    for (const locale of slot === 'shared' ? LOCALES : [slot]) {
      if (!draft[locale].title) {
        updateDraftFile(locale, { title: derivedTitle });
      }
    }
  }

  function clearDraftFile(slot: FileSlot) {
    for (const locale of slot === 'shared' ? LOCALES : [slot]) {
      updateDraftFile(locale, { title: '', fileName: '', size: '' });
    }
    // Clearing the shared box drops everything staged: any of the three slots
    // could be the file it is currently showing.
    setPendingFiles((current) =>
      slot === 'shared' ? {} : { ...current, [slot]: undefined },
    );
  }

  /**
   * Switching is non-destructive — nothing has reached S3 yet, and the
   * per-language files stay put so the choice is reversible. The one thing
   * dropped is a staged shared file when leaving shared mode, which would
   * otherwise sit in state with no box showing it.
   */
  function changeFileMode(fileMode: FileMode) {
    updateDraft({ fileMode });
    if (fileMode === 'perLocale') {
      setPendingFiles((current) => ({ ...current, shared: undefined }));
    }
  }

  function downloadDocumentFile(file: DocumentLocaleFile) {
    window.open(getAssetUrl(file.fileName), '_blank');
  }

  /**
   * What a language would contribute if the document switched to one shared
   * file: whatever is staged for upload, else whatever is already saved. The
   * id exists to tell two candidates apart without comparing File objects.
   */
  function sharedCandidate(locale: Locale) {
    const pending = pendingFiles[locale];
    if (pending) {
      return {
        id: `pending:${pending.name}:${pending.size}:${pending.lastModified}`,
        label: pending.name,
      };
    }

    const fileName = draft[locale].fileName.trim();
    if (fileName) {
      return {
        id: `saved:${fileName}`,
        label: fileName.split('/').pop() ?? fileName,
      };
    }

    return null;
  }

  const candidates = { en: sharedCandidate('en'), es: sharedCandidate('es') };

  /** Falls back to whichever language actually has a file to offer. */
  const effectiveSharedSource: Locale | null =
    candidates.en && candidates.es
      ? sharedSource
      : candidates.en
        ? 'en'
        : candidates.es
          ? 'es'
          : null;

  // Only worth asking when the two languages would contribute different files
  // and no fresh upload is about to replace both anyway.
  const mustPickSharedSource =
    draft.fileMode === 'shared' &&
    !pendingFiles.shared &&
    Boolean(candidates.en && candidates.es) &&
    candidates.en?.id !== candidates.es?.id;

  /**
   * What the shared box shows. A file staged in one language's box before
   * switching mode still counts, so nothing selected is silently dropped.
   */
  const sharedStagedFile =
    pendingFiles.shared ??
    (effectiveSharedSource ? pendingFiles[effectiveSharedSource] : undefined);

  const sharedPersistedFile =
    !sharedStagedFile &&
    effectiveSharedSource &&
    draft[effectiveSharedSource].fileName
      ? draft[effectiveSharedSource]
      : null;

  async function uploadDraftFile(
    file: File,
  ): Promise<{ asset: UploadedAsset } | { error: string }> {
    const result = await uploadAsset('documents', file, uploadPrefixParts);
    if ('error' in result) {
      return { error: result.error };
    }

    return {
      asset: {
        fileName: result.key,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      },
    };
  }

  async function handleSave() {
    if (!draft.categoryId || !draft.year.trim() || !draft.date.trim()) {
      setValidationError('Completa categoría, año y fecha.');
      return;
    }

    // Both languages are mandatory now, so both titles always are too.
    if (!draft.en.title.trim()) {
      setValidationError('Falta el título en inglés.');
      return;
    }

    if (!draft.es.title.trim()) {
      setValidationError('Falta el título en español.');
      return;
    }

    const isShared = draft.fileMode === 'shared';

    if (isShared && !pendingFiles.shared && !effectiveSharedSource) {
      setValidationError('Sube el archivo que compartirán los dos idiomas.');
      return;
    }

    if (!isShared) {
      if (!draft.en.fileName.trim() && !pendingFiles.en) {
        setValidationError('Falta el archivo en inglés.');
        return;
      }

      if (!draft.es.fileName.trim() && !pendingFiles.es) {
        setValidationError('Falta el archivo en español.');
        return;
      }
    }

    let en: DocumentLocaleFile;
    let es: DocumentLocaleFile;

    setIsUploading(true);

    if (isShared) {
      let asset: UploadedAsset;

      if (sharedStagedFile) {
        const result = await uploadDraftFile(sharedStagedFile);
        if ('error' in result) {
          setIsUploading(false);
          setValidationError(result.error);
          return;
        }
        asset = result.asset;
      } else {
        // Reusing an already uploaded file: no second copy goes to S3, both
        // languages simply point at the same key.
        const source = effectiveSharedSource as Locale;
        asset = {
          fileName: draft[source].fileName,
          size: draft[source].size,
        };
      }

      en = { title: draft.en.title, ...asset };
      es = { title: draft.es.title, ...asset };
    } else {
      en = { ...draft.en };
      es = { ...draft.es };

      // Two uploads, one save. If the second fails there is no record to hold
      // the first, so it has to come back out of the bucket.
      const uploadedKeys: string[] = [];

      for (const locale of LOCALES) {
        const stagedFile = pendingFiles[locale];
        if (!stagedFile) {
          continue;
        }

        const result = await uploadDraftFile(stagedFile);
        if ('error' in result) {
          await discardUploads(uploadedKeys);
          setIsUploading(false);
          setValidationError(result.error);
          return;
        }

        uploadedKeys.push(result.asset.fileName);

        const next = { title: draft[locale].title, ...result.asset };
        if (locale === 'en') {
          en = next;
        } else {
          es = next;
        }
      }
    }

    setIsUploading(false);

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
      setCategoryError('Completa el nombre en inglés y español.');
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
      setCategoryError('Completa el nombre en inglés y español.');
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
        'No puedes eliminar una categoría con documentos asignados.',
      );
      return;
    }

    if (
      !window.confirm(
        `¿Eliminar la categoría ${category.translations.es.name}? Esta acción no se puede deshacer.`,
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

  const selectedCategory = categories.find(
    (category) => String(category.id) === draft.categoryId,
  );
  const uploadPrefixParts = selectedCategory
    ? [selectedCategory.translations.es.name, draft.year]
    : undefined;

  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <div className='min-w-0 space-y-5'>
        <section className='grid gap-3 sm:grid-cols-2'>
          <MetricCard label='Documentos totales' value={documents.length} />
          <MetricCard label='Categorías' value={categories.length} />
        </section>

        <Panel title='Categorías' eyebrow='Financial Information, Meetings & Notices...'>
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
                          placeholder='Nombre (inglés)'
                          className='min-w-0 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
                          autoFocus
                        />
                        <input
                          value={editCategoryEs}
                          onChange={(event) =>
                            setEditCategoryEs(event.target.value)
                          }
                          placeholder='Nombre (español)'
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
                  placeholder='Nueva categoría (inglés)'
                  className='min-w-0 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
                />
                <input
                  value={newCategoryEs}
                  onChange={(event) => setNewCategoryEs(event.target.value)}
                  placeholder='Nueva categoría (español)'
                  className='min-w-0 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-2 focus:outline-offset-2 focus:outline-brand'
                />
              </div>
              <div className='flex justify-end'>
                <IconButton
                  label='Añadir categoría'
                  onClick={addCategory}
                  disabled={categorySaving}
                >
                  <FaPlus className='h-4 w-4' />
                </IconButton>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title='Biblioteca de documentos' eyebrow='Categoría > Año > Documentos'>
          <div className='grid gap-3 border-b border-neutral-200 pb-4'>
            <label className='block'>
              <span className='text-xs font-bold uppercase text-neutral-500'>
                Categoría
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
            Las flechas ordenan los documentos dentro de su categoría y año.
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

                      <div className='mt-2'>
                        <DocumentsTable
                          items={yearGroup.items}
                          editingDocumentId={
                            formMode === 'edit' ? editingId : null
                          }
                          onEdit={startEditDocument}
                          onMove={moveDocument}
                          onDelete={deleteDocument}
                        />
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
        <Panel title='Edición rápida' eyebrow='Documento seleccionado'>
          <div className='space-y-4'>
            {validationError ? (
              <FormNotice tone='danger'>{validationError}</FormNotice>
            ) : null}
            <h3 className='text-xl font-black text-neutral-950'>
              {formMode === 'edit' ? 'Editar documento' : 'Nuevo documento'}
            </h3>

            <SelectField
              label='Categoría'
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
              <SelectField
                label='Año'
                value={draft.year}
                options={yearOptions.map((year) => ({
                  label: year,
                  value: year,
                }))}
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
              label='Archivos'
              value={draft.fileMode}
              options={[
                { label: 'Un archivo por idioma', value: 'perLocale' },
                { label: 'Un archivo para los dos idiomas', value: 'shared' },
              ]}
              onChange={(fileMode) => changeFileMode(fileMode as FileMode)}
            />

            {draft.fileMode === 'shared' ? (
              <div className='space-y-3 rounded-md border border-neutral-200 p-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold uppercase text-neutral-500'>
                    Archivo compartido
                  </span>
                  {sharedPersistedFile ? (
                    <IconButton
                      label='Descargar'
                      onClick={() => downloadDocumentFile(sharedPersistedFile)}
                    >
                      <FaDownload className='h-4 w-4' />
                    </IconButton>
                  ) : null}
                </div>

                {mustPickSharedSource ? (
                  <SelectField
                    label='Cuál conservar'
                    value={sharedSource}
                    options={LOCALES.map((locale) => ({
                      label: `El de ${locale === 'en' ? 'inglés' : 'español'} - ${
                        candidates[locale]?.label ?? ''
                      }`,
                      value: locale,
                    }))}
                    onChange={(locale) => {
                      setValidationError('');
                      setSharedSource(locale as Locale);
                    }}
                  />
                ) : null}

                <AssetUploadField
                  accept={DOCUMENT_FILE_ACCEPT}
                  label=''
                  value={sharedPersistedFile?.fileName ?? ''}
                  pendingFile={sharedStagedFile}
                  onFileSelected={(file) => handleFileSelected('shared', file)}
                  onClear={() => clearDraftFile('shared')}
                  previewVariant='row'
                  disabled={isUploading}
                />

                {LOCALES.map((locale) => (
                  <TextField
                    key={locale}
                    label={`Título ${locale === 'en' ? 'inglés' : 'español'}`}
                    value={draft[locale].title}
                    onChange={(title) => updateDraftFile(locale, { title })}
                  />
                ))}
              </div>
            ) : (
              LOCALES.map((locale) => {
                const persistedFileName = draft[locale].fileName;
                const pendingFile = pendingFiles[locale];
                return (
                  <div
                    key={locale}
                    className='space-y-3 rounded-md border border-neutral-200 p-3'
                  >
                    <div className='flex items-center justify-between'>
                      <span className='text-xs font-bold uppercase text-neutral-500'>
                        Archivo {locale === 'en' ? 'inglés' : 'español'}
                      </span>
                      {persistedFileName && !pendingFile ? (
                        <IconButton
                          label='Descargar'
                          onClick={() => downloadDocumentFile(draft[locale])}
                        >
                          <FaDownload className='h-4 w-4' />
                        </IconButton>
                      ) : null}
                    </div>
                    <TextField
                      label='Título'
                      value={draft[locale].title}
                      onChange={(title) => updateDraftFile(locale, { title })}
                    />
                    <AssetUploadField
                      accept={DOCUMENT_FILE_ACCEPT}
                      label=''
                      value={persistedFileName}
                      pendingFile={pendingFile}
                      onFileSelected={(file) => handleFileSelected(locale, file)}
                      onClear={() => clearDraftFile(locale)}
                      previewVariant='row'
                      disabled={isUploading}
                    />
                  </div>
                );
              })
            )}

            <p className='text-xs text-neutral-500'>
              Los dos idiomas son obligatorios. Con un archivo compartido se
              sube una sola vez y cada idioma le pone su propio título.
            </p>

            <PrimaryButton
              icon={FaCheck}
              onClick={handleSave}
              disabled={isSaving || isUploading}
            >
              {isUploading
                ? 'Subiendo...'
                : isSaving
                  ? 'Guardando...'
                  : 'Guardar'}
            </PrimaryButton>
          </div>
        </Panel>
      </aside>
    </div>
  );
}
