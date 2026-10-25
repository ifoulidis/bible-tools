import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

import { env } from '$env/dynamic/private'

let client: PrismaClient | undefined

/**
 * Made on first use rather than on import. The hooks import this for sessions, and SvelteKit won't
 * let anything read private env while prerendering pages (such as the Bible reader's), even pages
 * that never touch the database.
 */
function getClient() {
  // Prisma 7 connects through a driver adapter rather than reading DATABASE_URL itself:
  // https://www.prisma.io/docs/orm/overview/databases/postgresql#using-the-node-postgres-driver
  client ??= new PrismaClient({ adapter: new PrismaPg(env.DATABASE_URL) })
  return client
}

const prisma = new Proxy({} as PrismaClient, {
  get(_, key): unknown {
    const target = getClient()
    const value: unknown = Reflect.get(target, key)
    // Methods such as $transaction expect `this` to be the client itself
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(target)
      : value
  },
})

export default prisma
