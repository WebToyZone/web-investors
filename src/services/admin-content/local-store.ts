import { prisma } from '@/services/db/client';
import { deleteAssets } from '@/services/storage/delete-assets';
import type { Prisma } from '@prisma/client';
import type {
  AdminContent,
  AdminDocument,
  BoardMember,
  DocumentCategory,
  GrowthMilestone,
  KpiStat,
  KpiTranslation,
  Locale,
  PendingBoardSeat,
  PlatformLocation,
} from '@/components/admin/types';

export async function getAdminContent(): Promise<AdminContent> {
  const [
    categories,
    documents,
    kpis,
    locations,
    members,
    pendingSeats,
    revenue,
    milestones,
    contactSettings,
    videos,
  ] = await Promise.all([
    prisma.documentCategory.findMany({ orderBy: { order: 'asc' } }),
    prisma.adminDocument.findMany({ orderBy: { order: 'asc' } }),
    prisma.kpiStat.findMany({ orderBy: { order: 'asc' } }),
    prisma.platformLocation.findMany({ orderBy: { order: 'asc' } }),
    prisma.boardMember.findMany({ orderBy: { order: 'asc' } }),
    prisma.pendingBoardSeat.findMany({ orderBy: { order: 'asc' } }),
    prisma.growthRevenue.findMany({ orderBy: { order: 'asc' } }),
    prisma.growthMilestone.findMany({ orderBy: { order: 'asc' } }),
    prisma.contactSettings.findUniqueOrThrow({ where: { id: 1 } }),
    prisma.adminVideo.findMany(),
  ]);

  const videosBySlot = Object.fromEntries(
    videos.map((video) => [video.slot, video]),
  );

  return {
    documents: {
      categories: categories.map(
        (category): DocumentCategory => ({
          id: category.id,
          order: category.order,
          translations:
            category.translations as unknown as DocumentCategory['translations'],
        }),
      ),
      items: documents.map(
        (doc): AdminDocument => ({
          id: doc.id,
          order: doc.order,
          categoryId: doc.categoryId,
          year: doc.year,
          date: doc.date,
          downloads: doc.downloads,
          files: doc.files as unknown as AdminDocument['files'],
        }),
      ),
    },
    glance: {
      kpis: kpis.map((kpi): KpiStat => {
        const translations = kpi.translations as unknown as Record<
          Locale,
          Partial<KpiTranslation> | undefined
        >;

        return {
          id: String(kpi.id),
          order: kpi.order,
          icon: kpi.icon,
          // The figure used to be a single column shared by both languages.
          // Rows saved before it became translatable still have it there, so
          // fall back to it rather than render an empty KPI mid-rollout.
          translations: {
            en: {
              label: translations.en?.label ?? '',
              value: translations.en?.value ?? kpi.value,
            },
            es: {
              label: translations.es?.label ?? '',
              value: translations.es?.value ?? kpi.value,
            },
          },
        };
      }),
      locations: locations.map(
        (location): PlatformLocation => ({
          id: String(location.id),
          order: location.order,
          icon: location.icon,
          translations:
            location.translations as unknown as PlatformLocation['translations'],
        }),
      ),
    },
    board: {
      members: members.map(
        (member): BoardMember => ({
          id: member.id,
          name: member.name,
          image: member.image,
          translations:
            member.translations as unknown as BoardMember['translations'],
        }),
      ),
      pendingSeats: pendingSeats.map(
        (seat): PendingBoardSeat => ({
          id: seat.id,
          name: seat.name,
          image: seat.image,
          translations:
            seat.translations as unknown as PendingBoardSeat['translations'],
        }),
      ),
    },
    growth: {
      revenue: revenue.map((item) => ({
        year: item.year,
        currency: item.currency,
        value: item.value,
      })),
      milestones: milestones.map(
        (milestone): GrowthMilestone => ({
          id: milestone.id,
          translations:
            milestone.translations as unknown as GrowthMilestone['translations'],
        }),
      ),
    },
    contact: {
      info: {
        email: contactSettings.email,
        phone: contactSettings.phone,
        addressLine1: contactSettings.addressLine1,
        addressLine2: contactSettings.addressLine2,
      },
      recipientEmail: contactSettings.recipientEmail,
    },
    videos: {
      hero: {
        fileName: videosBySlot.hero?.fileName ?? '',
        size: videosBySlot.hero?.size ?? '',
      },
      powerOfASmile: {
        fileName: videosBySlot.powerOfASmile?.fileName ?? '',
        size: videosBySlot.powerOfASmile?.size ?? '',
      },
    },
  };
}

async function persistSection<K extends keyof AdminContent>(
  section: K,
  value: AdminContent[K],
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    switch (section) {
      case 'documents': {
        const data = value as AdminContent['documents'];
        await tx.adminDocument.deleteMany();
        await tx.adminDocument.createMany({
          data: data.items.map((item, index) => ({
            order: item.order ?? index + 1,
            categoryId: item.categoryId,
            year: item.year,
            date: item.date,
            downloads: item.downloads,
            files: item.files as unknown as Prisma.InputJsonValue,
          })),
        });
        break;
      }
      case 'glance': {
        const data = value as AdminContent['glance'];
        await tx.kpiStat.deleteMany();
        await tx.kpiStat.createMany({
          data: data.kpis.map((kpi, index) => ({
            order: kpi.order ?? index + 1,
            icon: kpi.icon,
            // Legacy column, kept in sync so the currently deployed admin —
            // which still selects it — keeps working until this ships. The
            // translations are the source of truth.
            value: kpi.translations.en.value,
            translations: kpi.translations as unknown as Prisma.InputJsonValue,
          })),
        });
        await tx.platformLocation.deleteMany();
        await tx.platformLocation.createMany({
          data: data.locations.map((location, index) => ({
            order: location.order ?? index + 1,
            icon: location.icon,
            translations:
              location.translations as unknown as Prisma.InputJsonValue,
          })),
        });
        break;
      }
      case 'board': {
        const data = value as AdminContent['board'];
        await tx.boardMember.deleteMany();
        await tx.boardMember.createMany({
          data: data.members.map((member, index) => ({
            order: index + 1,
            name: member.name,
            image: member.image,
            translations:
              member.translations as unknown as Prisma.InputJsonValue,
          })),
        });
        await tx.pendingBoardSeat.deleteMany();
        await tx.pendingBoardSeat.createMany({
          data: data.pendingSeats.map((seat, index) => ({
            order: index + 1,
            name: seat.name,
            image: seat.image,
            translations: seat.translations as unknown as Prisma.InputJsonValue,
          })),
        });
        break;
      }
      case 'growth': {
        const data = value as AdminContent['growth'];
        await tx.growthRevenue.deleteMany();
        await tx.growthRevenue.createMany({
          data: data.revenue.map((item, index) => ({
            order: index + 1,
            year: item.year,
            currency: item.currency,
            value: item.value,
          })),
        });
        await tx.growthMilestone.deleteMany();
        await tx.growthMilestone.createMany({
          data: data.milestones.map((milestone, index) => ({
            order: index + 1,
            translations:
              milestone.translations as unknown as Prisma.InputJsonValue,
          })),
        });
        break;
      }
      case 'contact': {
        const data = value as AdminContent['contact'];
        await tx.contactSettings.upsert({
          where: { id: 1 },
          create: {
            id: 1,
            email: data.info.email,
            phone: data.info.phone,
            addressLine1: data.info.addressLine1,
            addressLine2: data.info.addressLine2,
            recipientEmail: data.recipientEmail,
          },
          update: {
            email: data.info.email,
            phone: data.info.phone,
            addressLine1: data.info.addressLine1,
            addressLine2: data.info.addressLine2,
            recipientEmail: data.recipientEmail,
          },
        });
        break;
      }
      case 'videos': {
        const data = value as AdminContent['videos'];
        for (const slot of ['hero', 'powerOfASmile'] as const) {
          await tx.adminVideo.upsert({
            where: { slot },
            create: { slot, ...data[slot] },
            update: { ...data[slot] },
          });
        }
        break;
      }
    }
  });
}

/**
 * Every S3 key referenced by a section. Uploads are immutable and always get a
 * fresh key, so any key present before a save but absent after it is no longer
 * reachable and can be removed from the bucket.
 */
function collectAssetKeys<K extends keyof AdminContent>(
  section: K,
  value: AdminContent[K],
): string[] {
  switch (section) {
    case 'documents': {
      const data = value as AdminContent['documents'];
      return data.items.flatMap((item) =>
        (['en', 'es'] as const).map(
          (locale) => item.files[locale]?.fileName ?? '',
        ),
      );
    }
    case 'glance': {
      const data = value as AdminContent['glance'];
      return [
        ...data.kpis.map((kpi) => kpi.icon),
        ...data.locations.map((location) => location.icon),
      ];
    }
    case 'board': {
      const data = value as AdminContent['board'];
      return [
        ...data.members.map((member) => member.image),
        ...data.pendingSeats.map((seat) => seat.image),
      ];
    }
    case 'videos': {
      const data = value as AdminContent['videos'];
      return [data.hero.fileName, data.powerOfASmile.fileName];
    }
    default:
      // growth and contact hold no assets.
      return [];
  }
}

/** The sections that reference uploaded files at all. */
const ASSET_SECTIONS = ['documents', 'glance', 'board', 'videos'] as const;

/**
 * Every key referenced anywhere in the admin content. Used to decide whether
 * an object is safe to delete: anything absent from this set is unreachable
 * from the site, whichever section it was uploaded for.
 */
export function collectAllAssetKeys(content: AdminContent): string[] {
  return ASSET_SECTIONS.flatMap((section) =>
    collectAssetKeys(section, content[section]),
  );
}

export async function saveAdminContentSection<K extends keyof AdminContent>(
  section: K,
  value: AdminContent[K],
): Promise<AdminContent> {
  const previousKeys = collectAssetKeys(
    section,
    (await getAdminContent())[section],
  );
  const nextKeys = new Set(collectAssetKeys(section, value));

  try {
    await persistSection(section, value);
  } catch (error) {
    // The upload runs before the save, so a failed write leaves objects in the
    // bucket that no record will ever point at. Anything this save introduced
    // — a key that was not already in use — is unreachable now and has to go.
    // Keys that survive from the previous state are left alone: they are still
    // referenced by the rows the failed transaction rolled back to.
    const stillReferenced = new Set(previousKeys);
    await deleteAssets(
      [...nextKeys].filter((key) => key && !stillReferenced.has(key)),
    );

    throw error;
  }

  // Only after the write commits: dropping the old object earlier would leave
  // the record pointing at a deleted file if the save failed.
  await deleteAssets(previousKeys.filter((key) => key && !nextKeys.has(key)));

  return getAdminContent();
}
