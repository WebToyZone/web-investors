'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { revalidatePublicSite } from '@/services/admin-content/revalidate';
import { CreateDocumentCategorySchema } from '@/schemas/document-category.schema';
import {
  createDocumentCategory,
  listDocumentCategories,
} from '@/services/document-categories/document-categories.service';
import type { DocumentCategory } from '@/components/admin/types';

export type CreateDocumentCategoryResponse = {
  success?: string;
  error?: string;
  categories?: DocumentCategory[];
};

export async function createDocumentCategoryAction(
  input: unknown,
): Promise<CreateDocumentCategoryResponse> {
  const session = await auth();
  if (!session?.user) {
    return { error: 'No autorizado.' };
  }

  const parsed = CreateDocumentCategorySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  try {
    await createDocumentCategory(parsed.data.translations);
    const categories = await listDocumentCategories();
    revalidatePath('/admin');
    revalidatePublicSite();

    return { success: 'Categoría creada.', categories };
  } catch (error) {
    console.error('Document category create error:', error);
    return { error: 'No se pudo crear la categoría.' };
  }
}
