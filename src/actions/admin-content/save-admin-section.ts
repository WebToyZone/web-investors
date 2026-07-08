'use server';

import { revalidatePath } from 'next/cache';
import { saveAdminContentSection } from '@/services/admin-content/local-store';
import type { AdminContent, AdminSectionId } from '@/components/admin/types';

export type SaveAdminSectionResponse = {
  success?: string;
  error?: string;
  content?: AdminContent;
};

export async function saveAdminSection<K extends AdminSectionId>(
  section: K,
  value: AdminContent[K],
): Promise<SaveAdminSectionResponse> {
  try {
    const content = await saveAdminContentSection(section, value);
    revalidatePath('/admin');

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
