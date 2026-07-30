import { prisma } from '@/services/db/client';
import type { Prisma } from '@prisma/client';
import type { DocumentCategory } from '@/components/admin/types';

function toDocumentCategory(category: {
  id: number;
  order: number;
  translations: unknown;
}): DocumentCategory {
  return {
    id: category.id,
    order: category.order,
    translations:
      category.translations as unknown as DocumentCategory['translations'],
  };
}

export async function listDocumentCategories(): Promise<DocumentCategory[]> {
  const categories = await prisma.documentCategory.findMany({
    orderBy: { order: 'asc' },
  });

  return categories.map(toDocumentCategory);
}

export async function createDocumentCategory(
  translations: DocumentCategory['translations'],
): Promise<DocumentCategory> {
  const count = await prisma.documentCategory.count();

  const category = await prisma.documentCategory.create({
    data: {
      order: count + 1,
      translations: translations as unknown as Prisma.InputJsonValue,
    },
  });

  return toDocumentCategory(category);
}

export async function updateDocumentCategoryTranslations(
  id: number,
  translations: DocumentCategory['translations'],
): Promise<DocumentCategory> {
  const category = await prisma.documentCategory.update({
    where: { id },
    data: { translations: translations as unknown as Prisma.InputJsonValue },
  });

  return toDocumentCategory(category);
}

export async function reorderDocumentCategory(
  id: number,
  direction: -1 | 1,
): Promise<DocumentCategory[]> {
  const categories = await listDocumentCategories();
  const currentIndex = categories.findIndex((category) => category.id === id);
  const targetIndex = currentIndex + direction;

  if (
    currentIndex < 0 ||
    targetIndex < 0 ||
    targetIndex >= categories.length
  ) {
    return categories;
  }

  const reordered = [...categories];
  [reordered[currentIndex], reordered[targetIndex]] = [
    reordered[targetIndex],
    reordered[currentIndex],
  ];

  await prisma.$transaction(
    reordered.map((category, index) =>
      prisma.documentCategory.update({
        where: { id: category.id },
        data: { order: index + 1 },
      }),
    ),
  );

  return listDocumentCategories();
}

export class CategoryHasDocumentsError extends Error {
  constructor() {
    super('No puedes eliminar una categoria con documentos asignados.');
    this.name = 'CategoryHasDocumentsError';
  }
}

export async function deleteDocumentCategory(id: number): Promise<void> {
  const documentsInCategory = await prisma.adminDocument.count({
    where: { categoryId: id },
  });

  if (documentsInCategory > 0) {
    throw new CategoryHasDocumentsError();
  }

  await prisma.documentCategory.delete({ where: { id } });
}
