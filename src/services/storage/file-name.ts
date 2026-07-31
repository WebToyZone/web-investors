import { randomUUID } from 'crypto';

/**
 * Single source of truth for turning user-supplied text into safe S3 path
 * segments. Both the folder prefix and the file name go through here, so the
 * normalisation rules can never drift apart between the two.
 */

const MAX_SEGMENT_LENGTH = 80;
const UNIQUE_ID_LENGTH = 10;

function normalizeSegment(text: string): string {
  return text
    .normalize('NFD')
    // Strip the combining diacritical marks left behind by NFD, so
    // "Informe Anual Café" becomes "informe-anual-cafe" and not "caf".
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SEGMENT_LENGTH)
    .replace(/-+$/g, '');
}

/**
 * Normalises a single path segment (a folder name such as a document
 * category or a year). Returns `fallback` when nothing usable survives.
 */
export function slugifySegment(text: string, fallback = 'sin-nombre'): string {
  return normalizeSegment(text) || fallback;
}

/**
 * Builds the final, always-unique file name from the original upload name:
 * `nombre-original-normalizado-<id unico>.extension`.
 *
 * The unique id is server-generated from randomUUID (never Date.now), so two
 * uploads of the same file in the same millisecond still get distinct keys and
 * an existing object can never be overwritten.
 */
export function generateUniqueFileName(originalName: string): string {
  const lastDotIndex = originalName.lastIndexOf('.');
  // `> 0` rather than `!== -1` so a dotfile like ".env" is treated as a name,
  // not as a bare extension.
  const hasExtension = lastDotIndex > 0;

  const rawName = hasExtension
    ? originalName.slice(0, lastDotIndex)
    : originalName;
  const extension = hasExtension
    ? originalName.slice(lastDotIndex + 1).toLowerCase().replace(/[^a-z0-9]/g, '')
    : '';

  const normalizedName = slugifySegment(rawName, 'archivo');
  const uniqueId = randomUUID().replace(/-/g, '').slice(0, UNIQUE_ID_LENGTH);

  return extension
    ? `${normalizedName}-${uniqueId}.${extension}`
    : `${normalizedName}-${uniqueId}`;
}
