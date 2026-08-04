'use server';

import { revalidatePath } from 'next/cache';
import { saveAdminContentSection } from '@/services/admin-content/local-store';
import { revalidatePublicSite } from '@/services/admin-content/revalidate';
import type { AdminContent } from '@/components/admin/types';
import { auth } from '@/auth';

export type SaveAdminSectionResponse = {
  success?: string;
  error?: string;
  content?: AdminContent;
};

export async function saveAdminSection<K extends keyof AdminContent>(
  section: K,
  value: AdminContent[K],
): Promise<SaveAdminSectionResponse> {
  const session = await auth();
  if (!session?.user) {
    return { error: 'No autorizado.' };
  }

  try {
    const content = await saveAdminContentSection(section, value);
    revalidatePath('/admin');

    // Every section the public page renders now comes from the database, so
    // any save has to drop the prerender.
    revalidatePublicSite();

    return {
      success: 'Cambios guardados.',
      content,
    };
  } catch (error) {
    console.error('Admin content save error:', error);

    return {
      error: 'No se pudieron guardar los cambios.',
    };
  }
}
