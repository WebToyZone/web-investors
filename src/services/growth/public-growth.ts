import { prisma } from '@/services/db/client';
import type {
  Milestone,
  RevenueDatum,
} from '@/components/sections/GrowthJourneySection';
import type { GrowthMilestone, Locale } from '@/components/admin/types';

export type PublicGrowth = {
  revenue: RevenueDatum[];
  milestones: Milestone[];
};

/**
 * The revenue chart and the milestone timeline as the public page needs them.
 *
 * The section's copy — heading, period, lead and chart caption — stays in the
 * static content: it is i18n prose, not something the admin manages.
 */
export async function getPublicGrowth(locale: Locale): Promise<PublicGrowth> {
  const [revenue, milestones] = await Promise.all([
    prisma.growthRevenue.findMany({ orderBy: { order: 'asc' } }),
    prisma.growthMilestone.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return {
    revenue: revenue.flatMap((entry): RevenueDatum[] => {
      // The bar height needs a number, but the figure is stored as text so the
      // admin controls how it reads ("15.50", not 15.5). A row that cannot be
      // parsed would size every other bar against NaN, so drop it instead.
      const value = Number(entry.value);
      if (!Number.isFinite(value)) {
        return [];
      }

      return [
        {
          year: entry.year,
          value,
          label: `${entry.currency}${entry.value}`,
        },
      ];
    }),
    milestones: milestones.map((milestone): Milestone => {
      const translations = milestone.translations as unknown as Record<
        Locale,
        Partial<GrowthMilestone['translations']['en']> | undefined
      >;

      return {
        id: String(milestone.id),
        title: translations[locale]?.title ?? '',
        description: translations[locale]?.description ?? '',
      };
    }),
  };
}
