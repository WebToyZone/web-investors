import { existsSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

if (existsSync('.env.local')) {
  process.loadEnvFile('.env.local');
}

const [, , email, password, name] = process.argv;

if (!email || !password || !name) {
  console.error('Usage: node prisma/create-admin.mjs <email> <password> <name>');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash, name },
    update: { passwordHash, name },
  });

  console.log(`Admin user ready: ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
