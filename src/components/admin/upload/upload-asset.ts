'use client';

import { createUploadUrl } from '@/actions/storage/create-upload-url';
import { ASSET_CACHE_CONTROL, type AssetKind } from '@/schemas/storage.schema';

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

export type UploadAssetResult = { key: string } | { error: string };

export async function uploadAsset(
  kind: AssetKind,
  file: File,
  prefixParts?: string[],
): Promise<UploadAssetResult> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { error: 'Archivo demasiado grande (max. 100MB).' };
  }

  const result = await createUploadUrl({
    kind,
    fileName: file.name,
    contentType: file.type,
    prefixParts,
  });

  if (result.error || !result.url || !result.key) {
    return { error: result.error ?? 'No se pudo iniciar la subida.' };
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

    return { key: result.key };
  } catch {
    return { error: 'La subida fallo. Intenta de nuevo.' };
  }
}
