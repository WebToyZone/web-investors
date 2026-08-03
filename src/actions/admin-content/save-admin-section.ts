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

    // Only the sections the public page reads from the database; the rest
    // still render from the static content file.
    if (section === 'documents' || section === 'glance') {
      revalidatePublicSite();
    }

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
