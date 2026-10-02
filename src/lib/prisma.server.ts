import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

import { env } from '$env/dynamic/private'

// Prisma 7 connects through a driver adapter rather than reading DATABASE_URL itself:
// https://www.prisma.io/docs/orm/overview/databases/postgresql#using-the-node-postgres-driver
const prisma = new PrismaClient({ adapter: new PrismaPg(env.DATABASE_URL) })

export default prisma
