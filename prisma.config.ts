import { existsSync } from 'fs';
import { defineConfig, env } from 'prisma/config';

if (existsSync('.env.local')) {
  process.loadEnvFile('.env.local');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // Only needed for `migrate`/`introspect`; `generate` (run as a
  // postinstall hook) must not fail when DATABASE_URL isn't set yet,
  // e.g. during Vercel's install step.
  ...(process.env.DATABASE_URL
    ? { datasource: { url: env('DATABASE_URL') } }
    : {}),
});
