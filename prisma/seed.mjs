import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

if (existsSync('.env.local')) {
  process.loadEnvFile('.env.local');
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const contentPath = path.join(process.cwd(), 'data', 'admin', 'content.json');
  const content = JSON.parse(await readFile(contentPath, 'utf8'));

  await prisma.documentCategorySettings.upsert({
    where: { id: 1 },
    create: { id: 1, names: content.documents.categories },
    update: { names: content.documents.categories },
  });

  await prisma.adminDocument.deleteMany();
  for (const item of content.documents.items) {
    await prisma.adminDocument.create({
      data: {
        order: item.order ?? 0,
        category: item.category,
        year: item.year,
        date: item.date,
        downloads: item.downloads,
        files: item.files,
      },
    });
  }

  await prisma.kpiStat.deleteMany();
  for (const kpi of content.glance.kpis) {
    await prisma.kpiStat.create({
      data: {
        order: kpi.order,
        icon: kpi.icon,
        value: kpi.value,
        translations: kpi.translations,
      },
    });
  }

  await prisma.platformLocation.deleteMany();
  for (const location of content.glance.locations) {
    await prisma.platformLocation.create({
      data: {
        order: location.order,
        icon: location.icon,
        translations: location.translations,
      },
    });
  }

  await prisma.boardMember.deleteMany();
  for (const [index, member] of content.board.members.entries()) {
    await prisma.boardMember.create({
      data: {
        order: index + 1,
        name: member.name,
        image: member.image,
        translations: member.translations,
      },
    });
  }

  await prisma.pendingBoardSeat.deleteMany();
  for (const [index, seat] of content.board.pendingSeats.entries()) {
    await prisma.pendingBoardSeat.create({
      data: {
        order: index + 1,
        name: seat.name,
        image: seat.image,
        translations: seat.translations,
      },
    });
  }

  await prisma.growthRevenue.deleteMany();
  for (const [index, revenue] of content.growth.revenue.entries()) {
    await prisma.growthRevenue.create({
      data: {
        order: index + 1,
        year: revenue.year,
        currency: revenue.currency,
        value: revenue.value,
      },
    });
  }

  await prisma.growthMilestone.deleteMany();
  for (const [index, milestone] of content.growth.milestones.entries()) {
    await prisma.growthMilestone.create({
      data: {
        order: index + 1,
        translations: milestone.translations,
      },
    });
  }

  await prisma.contactSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      email: content.contact.info.email,
      phone: content.contact.info.phone,
      addressLine1: content.contact.info.addressLine1,
      addressLine2: content.contact.info.addressLine2,
      recipientEmail: content.contact.recipientEmail,
    },
    update: {
      email: content.contact.info.email,
      phone: content.contact.info.phone,
      addressLine1: content.contact.info.addressLine1,
      addressLine2: content.contact.info.addressLine2,
      recipientEmail: content.contact.recipientEmail,
    },
  });

  for (const slot of ['hero', 'powerOfASmile']) {
    await prisma.adminVideo.upsert({
      where: { slot },
      create: { slot, ...content.videos[slot] },
      update: { ...content.videos[slot] },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
