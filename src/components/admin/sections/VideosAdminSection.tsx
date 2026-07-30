'use client';

import { useEffect, useRef, useState } from 'react';
import { FaCheck } from 'react-icons/fa6';
import type { AdminContent, AdminVideo } from '@/components/admin/types';
import { FormNotice, IconButton, Panel } from '@/components/admin/ui';
import { AssetUploadField } from '@/components/admin/upload/AssetUploadField';
import { uploadAsset } from '@/components/admin/upload/upload-asset';

function VideoSlot({
  title,
  eyebrow,
  video,
  pendingFile,
  onFileSelected,
  onSave,
  isSaving,
  isUploading,
}: {
  title: string;
  eyebrow: string;
  video: AdminVideo;
  pendingFile?: File;
  onFileSelected: (file: File) => void;
  onSave: () => void;
  isSaving: boolean;
  isUploading: boolean;
}) {
  return (
    <Panel title={title} eyebrow={eyebrow}>
      <div className='space-y-4'>
        <AssetUploadField
          accept='video/*'
          label='Video'
          value={video.fileName}
          pendingFile={pendingFile}
          onFileSelected={onFileSelected}
          previewVariant='row'
          disabled={isUploading}
        />

        <div className='flex justify-end'>
          <IconButton
            label='Guardar'
            onClick={onSave}
            disabled={isSaving || isUploading}
          >
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
  const [pendingFiles, setPendingFiles] = useState<{
    hero?: File;
    powerOfASmile?: File;
  }>({});
  const [uploadingSlot, setUploadingSlot] = useState<
    'hero' | 'powerOfASmile' | null
  >(null);
  const pendingSaveRef = useRef(false);

  useEffect(() => {
    if (!pendingSaveRef.current) {
      return;
    }

    pendingSaveRef.current = false;
    onSave();
  }, [data, onSave]);

  function handleFileSelected(slot: 'hero' | 'powerOfASmile', file: File) {
    setValidationError('');
    setPendingFiles((current) => ({ ...current, [slot]: file }));
  }

  async function saveVideo(slot: 'hero' | 'powerOfASmile') {
    const pendingFile = pendingFiles[slot];

    if (!data[slot].fileName.trim() && !pendingFile) {
      setValidationError('Sube un video antes de guardar.');
      return;
    }

    if (pendingFile) {
      setUploadingSlot(slot);
      const result = await uploadAsset('videos', pendingFile);
      setUploadingSlot(null);

      if ('error' in result) {
        setValidationError(result.error);
        return;
      }

      setValidationError('');
      setPendingFiles((current) => ({ ...current, [slot]: undefined }));
      pendingSaveRef.current = true;
      onChange({
        ...data,
        [slot]: {
          fileName: result.key,
          size: `${(pendingFile.size / 1024 / 1024).toFixed(1)} MB`,
        },
      });
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
        pendingFile={pendingFiles.hero}
        onFileSelected={(file) => handleFileSelected('hero', file)}
        onSave={() => saveVideo('hero')}
        isSaving={isSaving}
        isUploading={uploadingSlot === 'hero'}
      />

      <VideoSlot
        title='Power of a Smile'
        eyebrow='Video de fondo, banner emocional'
        video={data.powerOfASmile}
        pendingFile={pendingFiles.powerOfASmile}
        onFileSelected={(file) => handleFileSelected('powerOfASmile', file)}
        onSave={() => saveVideo('powerOfASmile')}
        isSaving={isSaving}
        isUploading={uploadingSlot === 'powerOfASmile'}
      />
    </div>
  );
}
