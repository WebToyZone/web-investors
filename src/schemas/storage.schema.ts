import { z } from 'zod';

export const ASSET_KINDS = ['board', 'icons', 'documents', 'videos'] as const;
export type AssetKind = (typeof ASSET_KINDS)[number];

export const ALLOWED_CONTENT_TYPES: Record<AssetKind, string[]> = {
  board: ['image/jpeg', 'image/png', 'image/webp'],
  icons: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  documents: [
    'application/pdf',
    // .xlsx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // .xls
    'application/vnd.ms-excel',
    'text/csv',
  ],
  videos: ['video/webm', 'video/mp4'],
};

/**
 * What the document picker offers. Extensions are listed alongside the MIME
 * types because Windows only reports a spreadsheet's type when an application
 * is registered for it, and without them the file would appear greyed out.
 */
export const DOCUMENT_FILE_ACCEPT = 'application/pdf,.pdf,.xlsx,.xls,.csv';

export const ASSET_CACHE_CONTROL = 'public, max-age=31536000, immutable';

export const CreateUploadUrlSchema = z.object({
  kind: z.enum(ASSET_KINDS),
  fileName: z.string().trim().min(1).max(200),
  contentType: z.string().trim().min(1).max(100),
  prefixParts: z.array(z.string().trim().min(1).max(100)).max(4).optional(),
});

export type CreateUploadUrlInput = z.infer<typeof CreateUploadUrlSchema>;
