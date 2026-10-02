// https://www.prisma.io/docs/orm/reference/prisma-config-reference
// Prisma 7 no longer loads .env itself, so load it here for the CLI (migrate, generate, seed)
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx src/lib/server/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
