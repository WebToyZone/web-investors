'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { revalidatePublicSite } from '@/services/admin-content/revalidate';
import { UpdateDocumentCategorySchema } from '@/schemas/document-category.schema';
import {
  listDocumentCategories,
  updateDocumentCategoryTranslations,
} from '@/services/document-categories/document-categories.service';
import type { DocumentCategory } from '@/components/admin/types';

export type UpdateDocumentCategoryResponse = {
  success?: string;
  error?: string;
  categories?: DocumentCategory[];
};

export async function updateDocumentCategoryAction(
  input: unknown,
): Promise<UpdateDocumentCategoryResponse> {
  const session = await auth();
  if (!session?.user) {
    return { error: 'No autorizado.' };
  }

  const parsed = UpdateDocumentCategorySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos invalidos.' };
  }

  try {
    await updateDocumentCategoryTranslations(
      parsed.data.id,
      parsed.data.translations,
    );
    const categories = await listDocumentCategories();
    revalidatePath('/admin');
    revalidatePublicSite();

    return { success: 'Categoria actualizada.', categories };
  } catch (error) {
    console.error('Document category update error:', error);
    return { error: 'No se pudo actualizar la categoria.' };
  }
}
