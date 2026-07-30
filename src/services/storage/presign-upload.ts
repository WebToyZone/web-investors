import { randomBytes } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from './s3-client';
import {
  ALLOWED_CONTENT_TYPES,
  ASSET_CACHE_CONTROL,
  type CreateUploadUrlInput,
} from '@/schemas/storage.schema';

const UPLOAD_URL_EXPIRES_IN_SECONDS = 300;

function sanitizeFileName(fileName: string): { base: string; ext: string } {
  const lastDot = fileName.lastIndexOf('.');
  const rawBase = lastDot > 0 ? fileName.slice(0, lastDot) : fileName;
  const rawExt = lastDot > 0 ? fileName.slice(lastDot + 1) : '';

  const base =
    rawBase
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .slice(0, 100) || 'file';
  const ext = rawExt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  return { base, ext };
}

function buildKey(kind: string, fileName: string): string {
  const { base, ext } = sanitizeFileName(fileName);
  const uniqueSuffix = randomBytes(4).toString('hex');
  const nameWithSuffix = `${base}-${uniqueSuffix}`;

  return ext ? `${kind}/${nameWithSuffix}.${ext}` : `${kind}/${nameWithSuffix}`;
}

export class InvalidContentTypeError extends Error {}

export async function createPresignedUploadUrl({
  kind,
  fileName,
  contentType,
}: CreateUploadUrlInput): Promise<{ url: string; key: string }> {
  if (!ALLOWED_CONTENT_TYPES[kind].includes(contentType)) {
    throw new InvalidContentTypeError(
      `Content type "${contentType}" is not allowed for kind "${kind}".`,
    );
  }

  const key = buildKey(kind, fileName);

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
