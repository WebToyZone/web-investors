import { promises as fs } from 'fs';
import path from 'path';
import type { AdminContent, AdminSectionId } from '@/components/admin/types';

const adminContentPath = path.join(
  process.cwd(),
  'data',
  'admin',
  'content.json',
);

export async function getAdminContent(): Promise<AdminContent> {
  const file = await fs.readFile(adminContentPath, 'utf8');
  return JSON.parse(file) as AdminContent;
}

export async function saveAdminContentSection<K extends AdminSectionId>(
  section: K,
  value: AdminContent[K],
): Promise<AdminContent> {
  const content = await getAdminContent();
  const nextContent = {
    ...content,
    [section]: value,
  };

  await fs.writeFile(
    adminContentPath,
    `${JSON.stringify(nextContent, null, 2)}\n`,
    'utf8',
  );

  return nextContent;
}
