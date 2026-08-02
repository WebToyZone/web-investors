'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { revalidatePublicSite } from '@/services/admin-content/revalidate';
import {
  CategoryHasDocumentsError,
  deleteDocumentCategory,
  listDocumentCategories,
} from '@/services/document-categories/document-categories.service';
import type { DocumentCategory } from '@/components/admin/types';

export type DeleteDocumentCategoryResponse = {
  success?: string;
  error?: string;
  categories?: DocumentCategory[];
};

export async function deleteDocumentCategoryAction(
  id: number,
): Promise<DeleteDocumentCategoryResponse> {
  const session = await auth();
  if (!session?.user) {
    return { error: 'No autorizado.' };
  }

  try {
    await deleteDocumentCategory(id);
    const categories = await listDocumentCategories();
    revalidatePath('/admin');
    revalidatePublicSite();

    return { success: 'Categoria eliminada.', categories };
  } catch (error) {
    if (error instanceof CategoryHasDocumentsError) {
      return { error: error.message };
    }

    console.error('Document category delete error:', error);
    return { error: 'No se pudo eliminar la categoria.' };
  }
}
