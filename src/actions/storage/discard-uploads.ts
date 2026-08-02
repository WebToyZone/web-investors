'use server';

import { auth } from '@/auth';
import {
  collectAllAssetKeys,
  getAdminContent,
} from '@/services/admin-content/local-store';
import { deleteAssets } from '@/services/storage/delete-assets';

/**
 * Removes objects uploaded for a save that never completed.
 *
 * Uploads happen before the record is written, so a form abandoned partway
 * through leaves files in the bucket that nothing points at. The caller passes
 * the keys it created; this checks them against every reference in the admin
 * content first, so a stale or wrong request can never delete a live asset.
 */
export async function discardUploads(keys: string[]): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  if (keys.length === 0) {
    return;
  }

  try {
    const referenced = new Set(collectAllAssetKeys(await getAdminContent()));
    await deleteAssets(keys.filter((key) => key && !referenced.has(key)));
  } catch (error) {
    // Never surfaced to the user: this runs while handling another failure,
    // and an orphaned object is a far smaller problem than masking it.
    console.error('No se pudieron descartar las subidas:', keys, error);
  }
}
