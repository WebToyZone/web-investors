'use client';

import { createUploadUrl } from '@/actions/storage/create-upload-url';
import { ASSET_CACHE_CONTROL, type AssetKind } from '@/schemas/storage.schema';

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

/**
 * Spreadsheets are the unreliable case: depending on what is registered on the
 * machine, the browser reports one as the legacy Excel type, as
 * `application/octet-stream`, or as nothing at all — and the server would
 * reject the last two. A `.csv` gets reported as `application/vnd.ms-excel`
 * whenever Excel is installed, which would store a plain text file under a
 * binary type. The extension is what we key the S3 object on anyway, so
 * deriving the type from it keeps the stored Content-Type consistent with the
 * object's name.
 */
const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  csv: 'text/csv',
};

function resolveContentType(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  return CONTENT_TYPE_BY_EXTENSION[extension] ?? file.type;
}

export type UploadAssetResult = { key: string } | { error: string };

export async function uploadAsset(
  kind: AssetKind,
  file: File,
  prefixParts?: string[],
): Promise<UploadAssetResult> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { error: 'Archivo demasiado grande (máx. 100 MB).' };
  }

  const contentType = resolveContentType(file);

  const result = await createUploadUrl({
    kind,
    fileName: file.name,
    contentType,
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
        // S3 stores whatever this header says, so it has to be the same value
        // the server validated before signing.
        'Content-Type': contentType,
        'Cache-Control': ASSET_CACHE_CONTROL,
      },
    });

    if (!response.ok) {
      throw new Error(`S3 PUT failed: ${response.status}`);
    }

    return { key: result.key };
  } catch {
    return { error: 'La subida falló. Inténtalo de nuevo.' };
  }
}
