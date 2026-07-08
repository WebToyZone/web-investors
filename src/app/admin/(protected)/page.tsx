import AdminDocumentsPage from '@/components/admin/AdminDocumentsPage';
import { getAdminContent } from '@/services/admin-content/local-store';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await auth();
  const content = await getAdminContent();

  return (
    <AdminDocumentsPage
      initialContent={content}
      userEmail={session?.user?.email ?? ''}
    />
  );
}
