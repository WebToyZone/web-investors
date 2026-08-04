import { prisma } from '@/services/db/client';
import { getAssetUrl } from '@/services/storage/asset-url';

/** The part of a video the admin controls; the rest stays in static content. */
export type PublicVideo = {
  src: string;
  type: string;
};

export type PublicVideos = {
  hero: PublicVideo | null;
  powerOfASmile: PublicVideo | null;
};

const MIME_BY_EXTENSION: Record<string, string> = {
  webm: 'video/webm',
  mp4: 'video/mp4',
};

/**
 * Both players fall back to "video/mp4" when no type is given, so a `.webm`
 * has to be labelled explicitly or the browser is told the wrong codec.
 */
function mimeFromKey(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  return MIME_BY_EXTENSION[extension] ?? 'video/mp4';
}

/**
 * The hero and banner clips, read from the same rows the admin writes to.
 *
 * Not per-language: a muted background clip carries no words. Poster images
 * and the accessible descriptions are not managed here either, so they stay in
 * the static content and the page merges these over them.
 *
 * A slot with no row, or a row with no file, comes back null so the caller can
 * keep the static clip rather than render a player pointing nowhere.
 */
export async function getPublicVideos(): Promise<PublicVideos> {
  const videos = await prisma.adminVideo.findMany();

  const bySlot = new Map(videos.map((video) => [video.slot, video]));

  const resolve = (slot: string): PublicVideo | null => {
    const fileName = bySlot.get(slot)?.fileName?.trim();
    if (!fileName) {
      return null;
    }

    return { src: getAssetUrl(fileName), type: mimeFromKey(fileName) };
  };

  return {
    hero: resolve('hero'),
    powerOfASmile: resolve('powerOfASmile'),
  };
}
