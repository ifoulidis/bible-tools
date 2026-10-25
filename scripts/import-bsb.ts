/**
 * Converts the Berean Standard Bible's SWORD module into one JSON file of chapters per book, in
 * src/lib/bible/bsb. Run it with `npm run bible:import` after downloading the module from
 * https://crosswire.org/sword/modules/ModInfo.jsp?modName=BSB and unzipping it into ./BSB.
 *
 * The module is a "zText": each testament has a zlib-compressed block per book (.bzz), an index of
 * where those blocks are (.bzs) and an index of where each entry sits inside its block (.bzv). The
 * entries run in versification order, with an extra one before each book and each chapter for
 * whatever comes before its first verse.
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

import { parseChapter } from '../src/lib/bible/osis.ts'
import { verseCounts } from '../src/lib/bible/versification.ts'
import { books } from '../src/lib/data/books.ts'

const moduleDir = 'BSB/modules/texts/ztext/bsb'
const outDir = 'src/lib/bible/bsb'

function openTestament(name: 'ot' | 'nt') {
  const file = (ext: string) => fs.readFileSync(path.join(moduleDir, `${name}.${ext}`))
  const blockIndex = file('bzs')
  const entryIndex = file('bzv')
  const compressed = file('bzz')
  const blocks = new Map<number, Buffer>()

  return (entry: number) => {
    const at = entry * 10
    const blockNumber = entryIndex.readUInt32LE(at)
    const offset = entryIndex.readUInt32LE(at + 4)
    const size = entryIndex.readUInt16LE(at + 8)
    if (size === 0) return ''

    let block = blocks.get(blockNumber)
    if (!block) {
      const start = blockIndex.readUInt32LE(blockNumber * 12)
      const length = blockIndex.readUInt32LE(blockNumber * 12 + 4)
      block = zlib.inflateSync(compressed.subarray(start, start + length))
      blocks.set(blockNumber, block)
    }
    return block.subarray(offset, offset + size).toString('utf8')
  }
}

if (!fs.existsSync(moduleDir)) {
  console.error(`No module at ${moduleDir}; see the comment at the top of this script`)
  process.exit(1)
}
fs.mkdirSync(outDir, { recursive: true })

const testaments = { ot: openTestament('ot'), nt: openTestament('nt') }
// Each testament starts with an empty entry and then one for the testament as a whole
let entry = 2
let testament: keyof typeof testaments = 'ot'

for (const book of books) {
  if (book.id === 'Matt') {
    testament = 'nt'
    entry = 2
  }
  const read = testaments[testament]
  // Skip the book's own entry: it holds the book's title and, before Genesis, the preface
  entry++

  const chapters = verseCounts[book.id].map(count => {
    const intro = read(entry++)
    const verses = Array.from({ length: count }, () => read(entry++))
    return parseChapter(intro, verses)
  })
  fs.writeFileSync(path.join(outDir, `${book.id}.json`), JSON.stringify(chapters))
}

console.log(`Wrote ${books.length} books to ${outDir}`)
