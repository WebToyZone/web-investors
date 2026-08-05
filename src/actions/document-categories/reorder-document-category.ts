'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { revalidatePublicSite } from '@/services/admin-content/revalidate';
import { reorderDocumentCategory } from '@/services/document-categories/document-categories.service';
import type { DocumentCategory } from '@/components/admin/types';

export type ReorderDocumentCategoryResponse = {
  error?: string;
  categories?: DocumentCategory[];
};

export async function reorderDocumentCategoryAction(
  id: number,
  direction: -1 | 1,
): Promise<ReorderDocumentCategoryResponse> {
  const session = await auth();
  if (!session?.user) {
    return { error: 'No autorizado.' };
  }

  try {
    const categories = await reorderDocumentCategory(id, direction);
    revalidatePath('/admin');
    revalidatePublicSite();

    return { categories };
  } catch (error) {
    console.error('Document category reorder error:', error);
    return { error: 'No se pudo reordenar la categoría.' };
  }
}
