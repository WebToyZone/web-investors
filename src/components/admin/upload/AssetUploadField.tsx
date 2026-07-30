'use client';

import { useEffect, useMemo } from 'react';
import { FaArrowUpFromBracket, FaXmark } from 'react-icons/fa6';
import { getAssetUrl } from '@/services/storage/asset-url';
import { IconButton } from '@/components/admin/ui';

type PreviewVariant = 'circle' | 'square' | 'row';

/**
 * Only captures and previews a file locally (via an object URL) —
 * it never uploads. The actual upload happens when the enclosing
 * form is saved, via uploadAsset(), so nothing lands in S3 unless
 * the record is actually persisted.
 */
export function AssetUploadField({
  accept,
  label,
  value,
  pendingFile,
  onFileSelected,
  onClear,
  previewVariant = 'row',
  disabled = false,
}: {
  accept: string;
  label: string;
  value: string;
  pendingFile?: File;
  onFileSelected: (file: File) => void;
  onClear?: () => void;
  previewVariant?: PreviewVariant;
  disabled?: boolean;
}) {
  const objectUrl = useMemo(
    () => (pendingFile ? URL.createObjectURL(pendingFile) : null),
    [pendingFile],
  );

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  function handleFileSelected(file: File | undefined) {
    if (file) {
      onFileSelected(file);
    }
  }

  const displayName = pendingFile ? pendingFile.name : value;
  const previewSrc = pendingFile ? (objectUrl ?? '') : getAssetUrl(value);
  const previewClassName =
    previewVariant === 'circle'
      ? 'h-10 w-10 shrink-0 rounded-full border border-neutral-200 bg-white object-cover'
      : 'h-10 w-10 shrink-0 rounded-md border border-neutral-200 bg-white object-contain';

  return (
    <div className='space-y-3'>
      {label ? (
        <span className='block text-xs font-bold uppercase text-neutral-500'>
          {label}
        </span>
      ) : null}

      {displayName ? (
        <div className='flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2'>
          <div className='flex min-w-0 items-center gap-3'>
            {previewVariant !== 'row' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewSrc} alt='' className={previewClassName} />
            ) : null}
            <span className='truncate text-xs text-neutral-600'>
              {displayName}
              {pendingFile ? (
                <span className='ml-1 font-bold text-amber-600'>
                  (sin guardar)
                </span>
              ) : null}
            </span>
          </div>
          {onClear ? (
            <IconButton label='Quitar' onClick={onClear} disabled={disabled}>
              <FaXmark className='h-4 w-4' />
            </IconButton>
          ) : null}
        </div>
      ) : null}

      <div className='flex h-28 flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 text-center'>
        <FaArrowUpFromBracket className='h-6 w-6 text-brand' />
        <p className='mt-2 text-xs font-bold text-neutral-950'>
          {displayName ? 'Reemplazar archivo' : 'Sube un archivo'}
        </p>
        <input
          type='file'
          accept={accept}
          disabled={disabled}
          onChange={(event) => handleFileSelected(event.target.files?.[0])}
          className='mt-3 max-w-full text-xs text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white disabled:opacity-50'
        />
      </div>
    </div>
  );
}
