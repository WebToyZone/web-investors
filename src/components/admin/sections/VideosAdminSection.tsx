'use client';

import { useState } from 'react';
import { FaArrowUpFromBracket, FaCheck } from 'react-icons/fa6';
import type { AdminContent, AdminVideo } from '@/components/admin/types';
import { FormNotice, IconButton, Panel } from '@/components/admin/ui';

function VideoSlot({
  title,
  eyebrow,
  video,
  onUpload,
  onSave,
  isSaving,
}: {
  title: string;
  eyebrow: string;
  video: AdminVideo;
  onUpload: (file: File | undefined) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <Panel title={title} eyebrow={eyebrow}>
      <div className='space-y-4'>
        <div className='flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2'>
          <span className='truncate text-sm text-neutral-700'>
            {video.fileName} - {video.size}
          </span>
        </div>

        <div className='flex h-28 flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 text-center'>
          <FaArrowUpFromBracket className='h-6 w-6 text-brand' />
          <p className='mt-2 text-xs font-bold text-neutral-950'>
            Sube un video para reemplazar el actual
          </p>
          <input
            type='file'
            accept='video/*'
            onChange={(event) => onUpload(event.target.files?.[0])}
            className='mt-3 max-w-full text-xs text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white'
          />
        </div>

        <div className='flex justify-end'>
          <IconButton label='Guardar' onClick={onSave} disabled={isSaving}>
            <FaCheck className='h-4 w-4' />
          </IconButton>
        </div>
      </div>
    </Panel>
  );
}

export default function VideosAdminSection({
  data,
  onChange,
  onSave,
  isSaving,
}: {
  data: AdminContent['videos'];
  onChange: (value: AdminContent['videos']) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  const [validationError, setValidationError] = useState('');

  function handleUpload(key: 'hero' | 'powerOfASmile', file: File | undefined) {
    if (!file) {
      return;
    }

    // Local-only for now: stores the file name as the public path. The
    // actual upload to AWS storage will replace this once wired up.
    setValidationError('');
    onChange({
      ...data,
      [key]: {
        fileName: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      },
    });
  }

  function saveVideo(key: 'hero' | 'powerOfASmile') {
    if (!data[key].fileName.trim()) {
      setValidationError('Sube un video antes de guardar.');
      return;
    }

    setValidationError('');
    onSave();
  }

  return (
    <div className='grid gap-5 md:grid-cols-2'>
      {validationError ? (
        <div className='md:col-span-2'>
          <FormNotice tone='danger'>{validationError}</FormNotice>
        </div>
      ) : null}

      <VideoSlot
        title='Hero'
        eyebrow='Video de fondo, seccion inicial'
        video={data.hero}
        onUpload={(file) => handleUpload('hero', file)}
        onSave={() => saveVideo('hero')}
        isSaving={isSaving}
      />

      <VideoSlot
        title='Power of a Smile'
        eyebrow='Video de fondo, banner emocional'
        video={data.powerOfASmile}
        onUpload={(file) => handleUpload('powerOfASmile', file)}
        onSave={() => saveVideo('powerOfASmile')}
        isSaving={isSaving}
      />
    </div>
  );
}
