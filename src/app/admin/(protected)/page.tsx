import AdminDocumentsPage from '@/components/admin/AdminDocumentsPage';
import { getAdminContent } from '@/services/admin-content/local-store';
import { listAdminUsers } from '@/services/admin-users/admin-users.service';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await auth();
  const content = await getAdminContent();
  const users = await listAdminUsers();

  return (
    <AdminDocumentsPage
      initialContent={content}
      initialUsers={users}
      currentUserId={Number(session?.user?.id)}
      userEmail={session?.user?.email ?? ''}
    />
  );
}
