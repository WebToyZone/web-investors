'use client';

import { FaArrowUpFromBracket, FaXmark } from 'react-icons/fa6';
import type { AssetKind } from '@/schemas/storage.schema';
import { getAssetUrl } from '@/services/storage/asset-url';
import { FormNotice, IconButton } from '@/components/admin/ui';
import { useAssetUpload } from './useAssetUpload';

type PreviewVariant = 'circle' | 'square' | 'row';

export function AssetUploadField({
  kind,
  accept,
  label,
  value,
  onChange,
  onClear,
  previewVariant = 'row',
}: {
  kind: AssetKind;
  accept: string;
  label: string;
  value: string;
  onChange: (key: string, file: File) => void;
  onClear?: () => void;
  previewVariant?: PreviewVariant;
}) {
  const { status, error, upload } = useAssetUpload(kind);

  async function handleFileSelected(file: File | undefined) {
    if (!file) {
      return;
    }

    const key = await upload(file);
    if (key) {
      onChange(key, file);
    }
  }

  const isUploading = status === 'uploading';
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

      {error ? <FormNotice tone='danger'>{error}</FormNotice> : null}

      {value && previewVariant !== 'row' ? (
        <div className='flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2'>
          <div className='flex min-w-0 items-center gap-3'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getAssetUrl(value)} alt='' className={previewClassName} />
            <span className='truncate text-xs text-neutral-600'>{value}</span>
          </div>
          {onClear ? (
            <IconButton label='Quitar' onClick={onClear} disabled={isUploading}>
              <FaXmark className='h-4 w-4' />
            </IconButton>
          ) : null}
        </div>
      ) : value && previewVariant === 'row' ? (
        <div className='flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2'>
          <span className='truncate text-sm text-neutral-700'>{value}</span>
          {onClear ? (
            <IconButton label='Quitar' onClick={onClear} disabled={isUploading}>
              <FaXmark className='h-4 w-4' />
            </IconButton>
          ) : null}
        </div>
      ) : null}

      <div className='flex h-28 flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 text-center'>
        <FaArrowUpFromBracket className='h-6 w-6 text-brand' />
        <p className='mt-2 text-xs font-bold text-neutral-950'>
          {isUploading ? 'Subiendo...' : value ? 'Reemplazar archivo' : 'Sube un archivo'}
        </p>
        <input
          type='file'
          accept={accept}
          disabled={isUploading}
          onChange={(event) => handleFileSelected(event.target.files?.[0])}
          className='mt-3 max-w-full text-xs text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white disabled:opacity-50'
        />
      </div>
    </div>
  );
}
