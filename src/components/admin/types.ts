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

export type DocumentLocaleFile = {
  title: string;
  fileName: string;
  size: string;
};

export type AdminDocument = {
  id: number;
  order?: number;
  category: string;
  year: string;
  status: PublishStatus;
  date: string;
  downloads: number;
  files: Record<Locale, DocumentLocaleFile | null>;
};

export type KpiTranslation = {
  label: string;
};

export type KpiStat = {
  id: string;
  order: number;
  icon: string;
  value: string;
  translations: Record<Locale, KpiTranslation>;
};

export type PlatformLocationTranslation = {
  name: string;
  description: string;
};

export type PlatformLocation = {
  id: string;
  order: number;
  icon: string;
  translations: Record<Locale, PlatformLocationTranslation>;
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

export type AdminContent = {
  documents: {
    categories: string[];
    items: AdminDocument[];
  };
  glance: {
    kpis: KpiStat[];
    locations: PlatformLocation[];
  };
  board: {
    members: BoardMember[];
  };
  growth: {
    revenue: GrowthRevenue[];
    milestones: GrowthMilestone[];
  };
  contact: {
    fields: ContactField[];
  };
  navigation: {
    links: FooterLink[];
  };
  assets: {
    items: MediaAsset[];
  };
};
