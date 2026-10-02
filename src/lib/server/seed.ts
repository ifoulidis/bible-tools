// Copies the king and prophet JSON into Postgres. Run with `npx prisma db seed` (see
// migrations.seed in prisma.config.ts). Runs outside Vite, so it loads .env itself, reads the files
// directly and uses relative imports.
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { parseDataset } from '../data/dataset'
import { toSeedRows } from '../data/seed-rows'

const dataDir = join(import.meta.dirname, '../data')
const peopleDir = join(dataDir, 'people')
const readJson = (path: string): unknown => JSON.parse(readFileSync(path, 'utf8'))

const dataset = parseDataset(
  readdirSync(peopleDir)
    .filter(file => file.endsWith('.json'))
    .map(file => readJson(join(peopleDir, file))),
  readJson(join(dataDir, 'sources.json')),
)
const rows = toSeedRows(dataset)

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL ?? '') })

// Clear and refill in one transaction, so re-running is idempotent and a failed seed leaves the
// previous data intact. Deleting people cascades to every child table except sources.
await prisma.$transaction([
  prisma.person.deleteMany(),
  prisma.source.deleteMany(),
  prisma.source.createMany({ data: rows.sources }),
  prisma.person.createMany({ data: rows.people }),
  prisma.reign.createMany({ data: rows.reigns }),
  prisma.ministry.createMany({ data: rows.ministries }),
  prisma.dating.createMany({ data: rows.datings }),
  prisma.evidence.createMany({ data: rows.evidence }),
  prisma.citation.createMany({ data: rows.citations }),
  prisma.passage.createMany({ data: rows.passages }),
  prisma.familyMember.createMany({ data: rows.family }),
])

console.log(
  Object.entries(rows)
    .map(([table, tableRows]) => `${table}: ${tableRows.length}`)
    .join(', '),
)

await prisma.$disconnect()
