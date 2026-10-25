import { type BookId, books } from '$lib/data/books'

import type { Block, Inline } from './types'
import { verseCounts } from './versification'

export type { Block, Chapter, Inline, Note } from './types'

/** e.g. "1-kings", "song-of-songs" */
export function bookSlug(book: BookId) {
  const name = books.find(b => b.id === book)?.name ?? book
  return name.toLowerCase().replace(/\s+/g, '-')
}

const bySlug = new Map(books.map(book => [bookSlug(book.id), book]))

export function bookFromSlug(slug: string) {
  return bySlug.get(slug.toLowerCase())
}

export function bookName(book: BookId) {
  return books.find(b => b.id === book)?.name ?? book
}

export function chapterCount(book: BookId) {
  return verseCounts[book].length
}

export function chapterHref(book: BookId, chapter: number, verse?: number) {
  return `/bible/${bookSlug(book)}/${chapter}${verse ? `#v${verse}` : ''}`
}

const bookIds = new Set<string>(books.map(book => book.id))

/**
 * Where a cross-reference such as "John.1.1-John.1.5" or "Ps.1-Ps.41" leads: the start of its
 * range. Undefined if it names a book or chapter this Bible doesn't have.
 */
export function osisRefHref(ref: string) {
  const [book, chapter, verse] = ref.split('-')[0].split('.')
  if (!bookIds.has(book)) return undefined
  const id = book as BookId
  const chapterNumber = chapter ? Number(chapter) : 1
  if (!(chapterNumber >= 1 && chapterNumber <= chapterCount(id))) return undefined
  // A verse past the end, such as Revelation 12:18, is counted in the next chapter here
  const verseNumber = Number(verse)
  const inChapter = verseNumber >= 1 && verseNumber <= verseCounts[id][chapterNumber - 1]
  return chapterHref(id, chapterNumber, inChapter ? verseNumber : undefined)
}

export interface ChapterRef {
  book: BookId
  chapter: number
}

/** e.g. "John 3", but "Psalm 23", as each psalm is one of its own */
export function chapterTitle({ book, chapter }: ChapterRef) {
  return `${book === 'Ps' ? 'Psalm' : bookName(book)} ${chapter}`
}

/** The chapters either side, running on into the next or previous book */
export function adjacentChapters({ book, chapter }: ChapterRef) {
  const index = books.findIndex(b => b.id === book)
  const before = index > 0 ? books[index - 1].id : undefined
  const after = index < books.length - 1 ? books[index + 1].id : undefined

  let previous: ChapterRef | undefined
  if (chapter > 1) previous = { book, chapter: chapter - 1 }
  else if (before) previous = { book: before, chapter: chapterCount(before) }

  let next: ChapterRef | undefined
  if (chapter < chapterCount(book)) next = { book, chapter: chapter + 1 }
  else if (after) next = { book: after, chapter: 1 }

  return { previous, next }
}

/** Everything that runs with the text, as opposed to headings */
const textKinds = new Set<Block['kind']>(['p', 'line1', 'line2', 'lineRight', 'item1', 'item2'])

export function isText(block: Block) {
  return textKinds.has(block.kind)
}

/** Part of a block that belongs to one verse, starting with its number if the verse starts here */
export interface Segment {
  verse: number
  content: Inline[]
}

export type SegmentedBlock = Block & { segments: Segment[] }

/**
 * Splits each block of text at its verse numbers, so a verse can be picked out even where it runs
 * across paragraphs or lines. A block that starts mid-verse begins with the rest of that verse.
 */
export function segmentBlocks(blocks: Block[]): SegmentedBlock[] {
  let verse = 0
  return blocks.map(block => {
    if (!isText(block)) return { ...block, segments: [] }
    const segments: Segment[] = []
    for (const inline of block.content) {
      if (typeof inline === 'object' && 'verse' in inline) verse = inline.verse
      const last = segments.at(-1)
      if (last && last.verse === verse) last.content.push(inline)
      else segments.push({ verse, content: [inline] })
    }
    return { ...block, segments }
  })
}

export type VerseRow = { kind: 'verse'; verse: number; content: Inline[] } | Block

/**
 * The chapter one verse to a line, as a study Bible lays it out, keeping its headings. A verse that
 * spans paragraphs or lines of poetry runs them together.
 */
export function versesByLine(blocks: Block[]): VerseRow[] {
  const rows: VerseRow[] = []
  let current: Extract<VerseRow, { kind: 'verse' }> | undefined
  for (const block of segmentBlocks(blocks)) {
    if (!isText(block)) {
      rows.push({ kind: block.kind, content: block.content })
      current = undefined
      continue
    }
    for (const { verse, content } of block.segments) {
      const [first, ...rest] = content
      const startsVerse = typeof first === 'object' && 'verse' in first
      if (current && current.verse === verse && !startsVerse) {
        current.content.push(' ', ...content)
      } else {
        current = { kind: 'verse', verse, content: startsVerse ? rest : [...content] }
        rows.push(current)
      }
    }
  }
  return rows
}

/** The words alone, without verse numbers or footnote calls */
export function plainText(content: Inline[]): string {
  return content
    .map(inline => {
      if (typeof inline === 'string') return inline
      if ('italic' in inline) return plainText(inline.italic)
      if ('sup' in inline) return plainText(inline.sup)
      if ('ref' in inline) return plainText(inline.text)
      return ''
    })
    .join('')
}

/** e.g. "16", "16–18", "16, 18" */
export function formatVerses(verses: number[]) {
  const sorted = [...verses].sort((a, b) => a - b)
  const runs: [number, number][] = []
  for (const verse of sorted) {
    const run = runs.at(-1)
    if (run && verse === run[1] + 1) run[1] = verse
    else runs.push([verse, verse])
  }
  return runs.map(([from, to]) => (from === to ? `${from}` : `${from}–${to}`)).join(', ')
}

/** The browser storage key for the last chapter read, so the reader can pick up where it left off */
export const lastReadKey = 'bible:last-read'
