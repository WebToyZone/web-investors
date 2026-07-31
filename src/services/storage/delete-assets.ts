import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3-client';

/**
 * Keys seeded before the S3 migration are plain `public/` paths ("/board/x.webp")
 * or absolute URLs — the same values `getAssetUrl` passes through untouched.
 * They do not live in the bucket, so they must never be sent to S3 for deletion.
 */
function isManagedKey(key: string): boolean {
  const trimmed = key.trim();
  if (!trimmed) return false;

  return (
    !trimmed.startsWith('/') &&
    !trimmed.startsWith('http://') &&
    !trimmed.startsWith('https://')
  );
}

/**
 * Removes objects that are no longer referenced by any record. Deliberately
 * non-fatal: a failed cleanup must never roll back or surface over a save that
 * already succeeded — the worst case is an orphaned object, which is harmless.
 */
export async function deleteAssets(keys: string[]): Promise<void> {
  const deletable = Array.from(new Set(keys.filter(isManagedKey)));
  if (deletable.length === 0) {
    return;
  }

  try {
    const result = await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Delete: {
          Objects: deletable.map((Key) => ({ Key })),
          Quiet: true,
        },
      }),
    );

    // DeleteObjects reports per-key failures in the body with a 200 status,
    // so permission errors show up here rather than as a thrown exception.
    if (result.Errors?.length) {
      console.error('S3 no pudo eliminar algunos assets:', result.Errors);
    }
  } catch (error) {
    console.error('Fallo al eliminar assets de S3:', deletable, error);
  }
}
