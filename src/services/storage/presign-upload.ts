import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './s3-client';
import { generateUniqueFileName, slugifySegment } from './file-name';
import {
  ALLOWED_CONTENT_TYPES,
  ASSET_CACHE_CONTROL,
  type CreateUploadUrlInput,
} from '@/schemas/storage.schema';

const UPLOAD_URL_EXPIRES_IN_SECONDS = 300;

/**
 * Builds the S3 key. The folder structure is unchanged (`kind/prefix.../`);
 * only the file name is swapped for the generated unique one. Every segment
 * is normalised server-side, so a client can never inject a path.
 */
function buildKey(
  kind: string,
  fileName: string,
  prefixParts: string[] = [],
): string {
  const segments = [
    kind,
    ...prefixParts.map((part) => slugifySegment(part, 'sin-categoria')),
    generateUniqueFileName(fileName),
  ];

  return segments.join('/');
}

export class InvalidContentTypeError extends Error {}

export async function createPresignedUploadUrl({
  kind,
  fileName,
  contentType,
  prefixParts,
}: CreateUploadUrlInput): Promise<{ url: string; key: string }> {
  if (!ALLOWED_CONTENT_TYPES[kind].includes(contentType)) {
    throw new InvalidContentTypeError(
      `Content type "${contentType}" is not allowed for kind "${kind}".`,
    );
  }

  const key = buildKey(kind, fileName, prefixParts);

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    CacheControl: ASSET_CACHE_CONTROL,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: UPLOAD_URL_EXPIRES_IN_SECONDS,
  });

  return { url, key };
}
