'use client';

import { useState } from 'react';
import { createUploadUrl } from '@/actions/storage/create-upload-url';
import { ASSET_CACHE_CONTROL, type AssetKind } from '@/schemas/storage.schema';

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

type UploadState = {
  status: 'idle' | 'uploading' | 'error';
  error?: string;
};

export function useAssetUpload(kind: AssetKind) {
  const [state, setState] = useState<UploadState>({ status: 'idle' });

  async function upload(file: File): Promise<string | null> {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setState({ status: 'error', error: 'Archivo demasiado grande (max. 100MB).' });
      return null;
    }

    setState({ status: 'uploading' });

    const result = await createUploadUrl({
      kind,
      fileName: file.name,
      contentType: file.type,
    });

    if (result.error || !result.url || !result.key) {
      setState({ status: 'error', error: result.error ?? 'No se pudo iniciar la subida.' });
      return null;
    }

    try {
      const response = await fetch(result.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'Cache-Control': ASSET_CACHE_CONTROL,
        },
      });

      if (!response.ok) {
        throw new Error(`S3 PUT failed: ${response.status}`);
      }

      setState({ status: 'idle' });
      return result.key;
    } catch {
      setState({ status: 'error', error: 'La subida fallo. Intenta de nuevo.' });
      return null;
    }
  }

  return { ...state, upload };
}
