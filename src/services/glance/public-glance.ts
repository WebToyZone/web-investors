import { prisma } from '@/services/db/client';
import { getAssetUrl } from '@/services/storage/asset-url';
import type {
  GlanceStat,
  OperatingLocation,
} from '@/components/sections/EoloAtAGlanceSection';
import type {
  KpiStat,
  Locale,
  PlatformLocation,
} from '@/components/admin/types';

export type PublicGlance = {
  stats: GlanceStat[];
  locations: OperatingLocation[];
};

/**
 * The KPI cards and operating locations as the public page needs them, read
 * from the same tables the admin writes to.
 *
 * Only the data is read here: the section heading, title and subtitle stay in
 * the static content, since they are i18n copy rather than anything the admin
 * manages.
 */
export async function getPublicGlance(locale: Locale): Promise<PublicGlance> {
  const [kpis, locations] = await Promise.all([
    prisma.kpiStat.findMany({ orderBy: { order: 'asc' } }),
    prisma.platformLocation.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return {
    stats: kpis.map((kpi): GlanceStat => {
      const translations = kpi.translations as unknown as Record<
        Locale,
        Partial<KpiStat['translations']['en']> | undefined
      >;

      return {
        id: String(kpi.id),
        icon: { src: getAssetUrl(kpi.icon) },
        // Figures saved before they became translatable still live in the
        // legacy column, so fall back to it rather than render a blank card.
        value: translations[locale]?.value ?? kpi.value,
        label: translations[locale]?.label ?? '',
      };
    }),
    locations: locations.map((location): OperatingLocation => {
      const translations = location.translations as unknown as Record<
        Locale,
        Partial<PlatformLocation['translations']['en']> | undefined
      >;

      return {
        id: String(location.id),
        icon: { src: getAssetUrl(location.icon) },
        name: translations[locale]?.name ?? '',
        description: translations[locale]?.description ?? '',
      };
    }),
  };
}
