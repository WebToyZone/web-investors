import AdminDocumentsPage from '@/components/admin/AdminDocumentsPage';
import { getAdminContent } from '@/services/admin-content/local-store';

export default async function AdminPage() {
  const content = await getAdminContent();

  return <AdminDocumentsPage initialContent={content} />;
}
