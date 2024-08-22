import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './server/db/schema.ts',
  dialect: 'postgresql',
  out: './drizzle',
  verbose: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
