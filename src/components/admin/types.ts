import type { ComponentType } from 'react';

export type Locale = 'en' | 'es';
export type PublishStatus = 'published' | 'draft' | 'scheduled';

export type AdminSectionId =
  | 'documents'
  | 'glance'
  | 'board'
  | 'growth'
  | 'contact'
  | 'navigation'
  | 'assets';

export type AdminSection = {
  id: AdminSectionId;
  label: string;
  eyebrow: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

export type AdminDocument = {
  id: number;
  title: string;
  category: string;
  year: string;
  locale: Locale;
  status: PublishStatus;
  date: string;
  fileName: string;
  size: string;
  downloads: number;
};

export type KpiStat = {
  id: number;
  label: string;
  value: string;
  locale: Locale;
  icon: string;
  status: PublishStatus;
};

export type BoardMember = {
  id: number;
  name: string;
  role: string;
  status: 'appointed' | 'pending';
  locale: Locale;
  image: string;
};

export type GrowthRevenue = {
  year: string;
  value: string;
  label: string;
};

export type GrowthMilestone = {
  id: number;
  title: string;
  locale: Locale;
  status: PublishStatus;
};

export type ContactField = {
  label: string;
  value: string;
};

export type FooterLink = {
  id: number;
  group: string;
  label: string;
  href: string;
  locale: Locale;
};

export type MediaAsset = {
  id: number;
  name: string;
  type: 'image' | 'video' | 'document';
  usage: string;
  path: string;
  status: PublishStatus;
};
