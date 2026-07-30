'use server';

import { auth } from '@/auth';
import { CreateUploadUrlSchema } from '@/schemas/storage.schema';
import {
  createPresignedUploadUrl,
  InvalidContentTypeError,
} from '@/services/storage/presign-upload';

export type CreateUploadUrlResponse = {
  url?: string;
  key?: string;
  error?: string;
};

export async function createUploadUrl(
  input: unknown,
): Promise<CreateUploadUrlResponse> {
  const session = await auth();
  if (!session?.user) {
    return { error: 'No autorizado.' };
  }

  const parsed = CreateUploadUrlSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos invalidos.' };
  }

  try {
    const { url, key } = await createPresignedUploadUrl(parsed.data);
    return { url, key };
  } catch (error) {
    if (error instanceof InvalidContentTypeError) {
      return { error: 'Tipo de archivo no permitido.' };
    }

    console.error('Presigned URL error:', error);
    return { error: 'No se pudo iniciar la subida.' };
  }
}
