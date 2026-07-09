'use client';

import { useState } from 'react';
import { saveAdminSection } from '@/actions/admin-content/save-admin-section';
import AdminShell from './AdminShell';
import { adminSections } from './mock-data';
import BoardAdminSection from './sections/BoardAdminSection';
import ContactAdminSection from './sections/ContactAdminSection';
import DocumentsAdminSection from './sections/DocumentsAdminSection';
import GlanceAdminSection from './sections/GlanceAdminSection';
import GrowthAdminSection from './sections/GrowthAdminSection';
import UsersAdminSection from './sections/UsersAdminSection';
import VideosAdminSection from './sections/VideosAdminSection';
import type { AdminContent, AdminSectionId } from './types';
import type { AdminUserSummary } from '@/services/admin-users/admin-users.service';

function renderAdminSection(
  section: AdminSectionId,
  content: AdminContent,
  updateSection: <K extends keyof AdminContent>(
    section: K,
    value: AdminContent[K],
  ) => void,
  saveSection: <K extends keyof AdminContent>(section: K) => void,
  savingSection: AdminSectionId | null,
  createRequestId: number,
  users: AdminUserSummary[],
  currentUserId: number,
) {
  switch (section) {
    case 'documents':
      return (
        <DocumentsAdminSection
          data={content.documents}
          onChange={(value) => updateSection('documents', value)}
          onSave={() => saveSection('documents')}
          isSaving={savingSection === 'documents'}
          createRequestId={createRequestId}
        />
      );
    case 'glance':
      return (
        <GlanceAdminSection
          data={content.glance}
          onChange={(value) => updateSection('glance', value)}
          onSave={() => saveSection('glance')}
          isSaving={savingSection === 'glance'}
          createRequestId={createRequestId}
        />
      );
    case 'board':
      return (
        <BoardAdminSection
          data={content.board}
          onChange={(value) => updateSection('board', value)}
          onSave={() => saveSection('board')}
          isSaving={savingSection === 'board'}
          createRequestId={createRequestId}
        />
      );
    case 'growth':
      return (
        <GrowthAdminSection
          data={content.growth}
          onChange={(value) => updateSection('growth', value)}
          onSave={() => saveSection('growth')}
          isSaving={savingSection === 'growth'}
          createRequestId={createRequestId}
        />
      );
    case 'contact':
      return (
        <ContactAdminSection
          data={content.contact}
          onChange={(value) => updateSection('contact', value)}
          onSave={() => saveSection('contact')}
          isSaving={savingSection === 'contact'}
          createRequestId={createRequestId}
        />
      );
    case 'videos':
      return (
        <VideosAdminSection
          data={content.videos}
          onChange={(value) => updateSection('videos', value)}
          onSave={() => saveSection('videos')}
          isSaving={savingSection === 'videos'}
        />
      );
    case 'users':
      return (
        <UsersAdminSection initialUsers={users} currentUserId={currentUserId} />
      );
    default:
      return null;
  }
}

export default function AdminDocumentsPage({
  initialContent,
  initialUsers,
  currentUserId,
  userEmail,
}: {
  initialContent: AdminContent;
  initialUsers: AdminUserSummary[];
  currentUserId: number;
  userEmail: string;
}) {
  const [activeSection, setActiveSection] =
    useState<AdminSectionId>('documents');
  const [content, setContent] = useState(initialContent);
  const [savingSection, setSavingSection] = useState<AdminSectionId | null>(
    null,
  );
  const [createRequestId, setCreateRequestId] = useState(0);
  const [feedback, setFeedback] = useState('');

  function updateSection<K extends keyof AdminContent>(
    section: K,
    value: AdminContent[K],
  ) {
    setContent((current) => ({
      ...current,
      [section]: value,
    }));
    setFeedback('');
  }

  async function handleSaveSection<K extends keyof AdminContent>(section: K) {
    setSavingSection(section);
    setFeedback('');

    const result = await saveAdminSection(section, content[section]);

    if (result.content) {
      setContent(result.content);
    }

    setFeedback(result.success ?? result.error ?? '');
    setSavingSection(null);
  }

  return (
    <AdminShell
      activeSection={activeSection}
      sections={adminSections}
      onCreateContent={() => setCreateRequestId((current) => current + 1)}
      onSectionChange={setActiveSection}
      userEmail={userEmail}
    >
      {feedback ? (
        <div className='mb-4 rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm font-bold text-neutral-800'>
          {feedback}
        </div>
      ) : null}
      {renderAdminSection(
        activeSection,
        content,
        updateSection,
        handleSaveSection,
        savingSection,
        createRequestId,
        initialUsers,
        currentUserId,
      )}
    </AdminShell>
  );
}
