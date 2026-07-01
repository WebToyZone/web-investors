'use client';

import { useState } from 'react';
import AdminShell from './AdminShell';
import { adminSections } from './mock-data';
import AssetsAdminSection from './sections/AssetsAdminSection';
import BoardAdminSection from './sections/BoardAdminSection';
import ContactAdminSection from './sections/ContactAdminSection';
import DocumentsAdminSection from './sections/DocumentsAdminSection';
import GlanceAdminSection from './sections/GlanceAdminSection';
import GrowthAdminSection from './sections/GrowthAdminSection';
import NavigationAdminSection from './sections/NavigationAdminSection';
import type { AdminSectionId } from './types';

function renderAdminSection(section: AdminSectionId) {
  switch (section) {
    case 'documents':
      return <DocumentsAdminSection />;
    case 'glance':
      return <GlanceAdminSection />;
    case 'board':
      return <BoardAdminSection />;
    case 'growth':
      return <GrowthAdminSection />;
    case 'contact':
      return <ContactAdminSection />;
    case 'navigation':
      return <NavigationAdminSection />;
    case 'assets':
      return <AssetsAdminSection />;
    default:
      return <DocumentsAdminSection />;
  }
}

export default function AdminDocumentsPage() {
  const [activeSection, setActiveSection] =
    useState<AdminSectionId>('documents');

  return (
    <AdminShell
      activeSection={activeSection}
      sections={adminSections}
      onSectionChange={setActiveSection}
    >
      {renderAdminSection(activeSection)}
    </AdminShell>
  );
}
