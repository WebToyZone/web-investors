import type { ComponentType } from 'react';

export type Locale = 'en' | 'es';

export type AdminSectionId =
  | 'documents'
  | 'glance'
  | 'board'
  | 'growth'
  | 'contact'
  | 'videos'
  | 'users';

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

export type DocumentCategoryTranslation = {
  name: string;
};

export type DocumentCategory = {
  id: number;
  order: number;
  translations: Record<Locale, DocumentCategoryTranslation>;
};

export type AdminDocument = {
  id: number;
  order?: number;
  categoryId: number;
  year: string;
  date: string;
  downloads: number;
  files: Record<Locale, DocumentLocaleFile | null>;
};

export type KpiTranslation = {
  label: string;
  /**
   * The figure itself. Per language because it can carry a unit — "~50 years"
   * against "~50 años" — even though plain numbers read the same in both.
   */
  value: string;
};

export type KpiStat = {
  id: string;
  order: number;
  icon: string;
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

export type BoardMemberTranslation = {
  role: string;
  description: string;
};

export type BoardMember = {
  id: number;
  name: string;
  image: string;
  translations: Record<Locale, BoardMemberTranslation>;
};

export type PendingSeatTranslation = {
  role: string;
};

export type PendingBoardSeat = {
  id: number;
  name: string;
  image: string;
  translations: Record<Locale, PendingSeatTranslation>;
};

export type GrowthRevenue = {
  year: string;
  currency: string;
  value: string;
};

export type GrowthMilestoneTranslation = {
  title: string;
  description: string;
};

export type GrowthMilestone = {
  id: number;
  translations: Record<Locale, GrowthMilestoneTranslation>;
};

/**
 * The address per language: the country name differs ("SPAIN." against
 * "ESPAÑA.") and the street wording may too. Email and phone are the same
 * everywhere, so they stay outside.
 */
export type ContactAddressTranslation = {
  addressLine1: string;
  addressLine2: string;
};

export type ContactInfo = {
  email: string;
  phone: string;
  translations: Record<Locale, ContactAddressTranslation>;
};

export type AdminVideo = {
  fileName: string;
  size: string;
};

export type AdminContent = {
  documents: {
    categories: DocumentCategory[];
    items: AdminDocument[];
  };
  glance: {
    kpis: KpiStat[];
    locations: PlatformLocation[];
  };
  board: {
    members: BoardMember[];
    pendingSeats: PendingBoardSeat[];
  };
  growth: {
    revenue: GrowthRevenue[];
    milestones: GrowthMilestone[];
  };
  contact: {
    info: ContactInfo;
    recipientEmail: string;
  };
  videos: {
    hero: AdminVideo;
    powerOfASmile: AdminVideo;
  };
};
