export function getAssetUrl(key: string): string {
  if (!key) {
    return '';
  }

  if (
    key.startsWith('/') ||
    key.startsWith('http://') ||
    key.startsWith('https://')
  ) {
    return key;
  }

  const base = (process.env.NEXT_PUBLIC_CDN_URL ?? '').replace(/\/$/, '');
  return `${base}/${key}`;
}
