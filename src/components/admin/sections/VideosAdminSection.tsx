'use client';

import { useState } from 'react';
import { FaCheck } from 'react-icons/fa6';
import type { AdminContent, AdminVideo } from '@/components/admin/types';
import { FormNotice, IconButton, Panel } from '@/components/admin/ui';
import { AssetUploadField } from '@/components/admin/upload/AssetUploadField';

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
  onUpload: (key: string) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <Panel title={title} eyebrow={eyebrow}>
      <div className='space-y-4'>
        <AssetUploadField
          kind='videos'
          accept='video/*'
          label='Video'
          value={video.fileName}
          onChange={onUpload}
          previewVariant='row'
        />

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

  function handleUpload(slot: 'hero' | 'powerOfASmile', key: string) {
    setValidationError('');
    onChange({
      ...data,
      [slot]: { fileName: key, size: '' },
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
        onUpload={(key) => handleUpload('hero', key)}
        onSave={() => saveVideo('hero')}
        isSaving={isSaving}
      />

      <VideoSlot
        title='Power of a Smile'
        eyebrow='Video de fondo, banner emocional'
        video={data.powerOfASmile}
        onUpload={(key) => handleUpload('powerOfASmile', key)}
        onSave={() => saveVideo('powerOfASmile')}
        isSaving={isSaving}
      />
    </div>
  );
}
