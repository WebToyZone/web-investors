'use client';

import { useState } from 'react';
import { saveAdminSection } from '@/actions/admin-content/save-admin-section';
import AdminShell from './AdminShell';
import { adminSections } from './mock-data';
import AssetsAdminSection from './sections/AssetsAdminSection';
import BoardAdminSection from './sections/BoardAdminSection';
import ContactAdminSection from './sections/ContactAdminSection';
import DocumentsAdminSection from './sections/DocumentsAdminSection';
import GlanceAdminSection from './sections/GlanceAdminSection';
import GrowthAdminSection from './sections/GrowthAdminSection';
import NavigationAdminSection from './sections/NavigationAdminSection';
import type { AdminContent, AdminSectionId } from './types';

function renderAdminSection(
  section: AdminSectionId,
  content: AdminContent,
  updateSection: <K extends AdminSectionId>(
    section: K,
    value: AdminContent[K],
  ) => void,
  saveSection: <K extends AdminSectionId>(section: K) => void,
  savingSection: AdminSectionId | null,
) {
  switch (section) {
    case 'documents':
      return (
        <DocumentsAdminSection
          data={content.documents}
          onChange={(value) => updateSection('documents', value)}
          onSave={() => saveSection('documents')}
          isSaving={savingSection === 'documents'}
        />
      );
    case 'glance':
      return (
        <GlanceAdminSection
          data={content.glance}
          onChange={(value) => updateSection('glance', value)}
          onSave={() => saveSection('glance')}
          isSaving={savingSection === 'glance'}
        />
      );
    case 'board':
      return (
        <BoardAdminSection
          data={content.board}
          onChange={(value) => updateSection('board', value)}
          onSave={() => saveSection('board')}
          isSaving={savingSection === 'board'}
        />
      );
    case 'growth':
      return (
        <GrowthAdminSection
          data={content.growth}
          onChange={(value) => updateSection('growth', value)}
          onSave={() => saveSection('growth')}
          isSaving={savingSection === 'growth'}
        />
      );
    case 'contact':
      return (
        <ContactAdminSection
          data={content.contact}
          onChange={(value) => updateSection('contact', value)}
          onSave={() => saveSection('contact')}
          isSaving={savingSection === 'contact'}
        />
      );
    case 'navigation':
      return (
        <NavigationAdminSection
          data={content.navigation}
          onChange={(value) => updateSection('navigation', value)}
          onSave={() => saveSection('navigation')}
          isSaving={savingSection === 'navigation'}
        />
      );
    case 'assets':
      return (
        <AssetsAdminSection
          data={content.assets}
          onChange={(value) => updateSection('assets', value)}
          onSave={() => saveSection('assets')}
          isSaving={savingSection === 'assets'}
        />
      );
    default:
      return null;
  }
}

export default function AdminDocumentsPage({
  initialContent,
}: {
  initialContent: AdminContent;
}) {
  const [activeSection, setActiveSection] =
    useState<AdminSectionId>('documents');
  const [content, setContent] = useState(initialContent);
  const [savingSection, setSavingSection] = useState<AdminSectionId | null>(
    null,
  );
  const [feedback, setFeedback] = useState('');

  function updateSection<K extends AdminSectionId>(
    section: K,
    value: AdminContent[K],
  ) {
    setContent((current) => ({
      ...current,
      [section]: value,
    }));
    setFeedback('');
  }

  async function handleSaveSection<K extends AdminSectionId>(section: K) {
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
      onSectionChange={setActiveSection}
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
      )}
    </AdminShell>
  );
}
