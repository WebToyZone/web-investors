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
      kpis: kpis.map(
        (kpi): KpiStat => ({
          id: String(kpi.id),
          order: kpi.order,
          icon: kpi.icon,
          value: kpi.value,
          translations: kpi.translations as unknown as KpiStat['translations'],
        }),
      ),
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
            value: kpi.value,
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

export async function saveAdminContentSection<K extends keyof AdminContent>(
  section: K,
  value: AdminContent[K],
): Promise<AdminContent> {
  const previousKeys = collectAssetKeys(
    section,
    (await getAdminContent())[section],
  );

  await persistSection(section, value);

  // Only after the write commits: dropping the old object earlier would leave
  // the record pointing at a deleted file if the save failed.
  const nextKeys = new Set(collectAssetKeys(section, value));
  await deleteAssets(previousKeys.filter((key) => key && !nextKeys.has(key)));

  return getAdminContent();
}
