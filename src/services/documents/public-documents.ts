import { prisma } from '@/services/db/client';
import { getAssetUrl } from '@/services/storage/asset-url';
import type {
  DocumentColumn,
  DocumentItem,
} from '@/components/sections/DocumentsSection';
import type {
  AdminDocument,
  DocumentCategory,
  Locale,
} from '@/components/admin/types';

/**
 * Renders the stored `YYYY-MM-DD` date in the order each locale expects.
 * Split by hand rather than through `Date`: parsing the bare date string
 * anchors it to UTC midnight, which renders as the previous day on any server
 * running west of UTC.
 */
function formatDate(date: string, locale: Locale): string {
  const [year, month, day] = date.split('-');
  if (!year || !month || !day) {
    return date;
  }

  return locale === 'en' ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
}

/** Badge text for the row, taken from the stored S3 key (`...pdf` -> `PDF`). */
function formatFromKey(fileName: string): string {
  const extension = fileName.split('.').pop();
  return extension && extension !== fileName ? extension.toUpperCase() : 'PDF';
}

/**
 * The Documents section as the public page needs it, read straight from the
 * same tables the admin writes to.
 *
 * One column per category in its configured order, each grouping its files by
 * year (most recent first) and, within a year, by the order set in the admin.
 * A category with nothing to show in this locale is dropped entirely, so the
 * grid never renders a bare heading.
 *
 * Only two queries: the admin's `getAdminContent` also pulls board, KPIs and
 * videos, none of which this section renders.
 */
export async function getPublicDocuments(
  locale: Locale,
): Promise<DocumentColumn[]> {
  const [categories, documents] = await Promise.all([
    prisma.documentCategory.findMany({ orderBy: { order: 'asc' } }),
    prisma.adminDocument.findMany({ orderBy: { order: 'asc' } }),
  ]);

  const columns = categories.map((category): DocumentColumn => {
    const translations =
      category.translations as unknown as DocumentCategory['translations'];

    const perYear: DocumentColumn['per_year'] = [];

    for (const document of documents) {
      if (document.categoryId !== category.id) {
        continue;
      }

      // A document can be saved with only one language filled in; the other
      // stays pending in the admin and simply doesn't exist for this locale.
      const file = (document.files as unknown as AdminDocument['files'])[locale];
      if (!file?.fileName) {
        continue;
      }

      const item: DocumentItem = {
        title: file.title,
        date: formatDate(document.date, locale),
        format: formatFromKey(file.fileName),
        size: file.size,
        href: getAssetUrl(file.fileName),
      };

      const yearGroup = perYear.find((group) => group.year === document.year);
      if (yearGroup) {
        yearGroup.documents.push(item);
      } else {
        perYear.push({ year: document.year, documents: [item] });
      }
    }

    perYear.sort((firstGroup, secondGroup) =>
      secondGroup.year.localeCompare(firstGroup.year),
    );

    return {
      title: translations[locale]?.name ?? '',
      per_year: perYear,
    };
  });

  return columns.filter((column) => column.per_year.length > 0);
}
