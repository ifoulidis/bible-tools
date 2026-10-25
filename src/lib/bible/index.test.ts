import { describe, expect, it } from 'vitest'

import { books } from '$lib/data/books'

import {
  adjacentChapters,
  bookFromSlug,
  bookSlug,
  chapterCount,
  chapterTitle,
  formatVerses,
  osisRefHref,
  plainText,
  segmentBlocks,
  versesByLine,
} from '.'
import type { Block } from './types'

describe('book slugs', () => {
  it('turns names into URL slugs and back', () => {
    expect(bookSlug('1Kgs')).toBe('1-kings')
    expect(bookSlug('Song')).toBe('song-of-songs')
    expect(bookFromSlug('1-kings')?.id).toBe('1Kgs')
    expect(bookFromSlug('nope')).toBeUndefined()
  })

  it('gives every book its own slug', () => {
    for (const book of books) expect(bookFromSlug(bookSlug(book.id))?.id).toBe(book.id)
  })
})

describe('chapterCount', () => {
  it('counts chapters', () => {
    expect(chapterCount('Gen')).toBe(50)
    expect(chapterCount('Ps')).toBe(150)
    expect(chapterCount('Jude')).toBe(1)
    expect(books.reduce((total, book) => total + chapterCount(book.id), 0)).toBe(1189)
  })
})

describe('osisRefHref', () => {
  it('links to the start of a range', () => {
    expect(osisRefHref('John.1.1-John.1.5')).toBe('/bible/john/1#v1')
    expect(osisRefHref('2Cor.4.6')).toBe('/bible/2-corinthians/4#v6')
  })

  it('links to a whole chapter', () => {
    expect(osisRefHref('Ps.1-Ps.41')).toBe('/bible/psalms/1')
  })

  it("doesn't link to what isn't there", () => {
    expect(osisRefHref('Tob.1.1')).toBeUndefined()
    expect(osisRefHref('Ps.151.1')).toBeUndefined()
  })

  it('links a verse past the end of a chapter to the chapter alone', () => {
    // The KJV versification counts Revelation 12:18 as the start of 13:1
    expect(osisRefHref('Rev.12.18')).toBe('/bible/revelation/12')
  })
})

describe('chapterTitle', () => {
  it('names a chapter, and a psalm by itself', () => {
    expect(chapterTitle({ book: 'John', chapter: 3 })).toBe('John 3')
    expect(chapterTitle({ book: 'Ps', chapter: 23 })).toBe('Psalm 23')
  })
})

describe('adjacentChapters', () => {
  it('steps within a book', () => {
    expect(adjacentChapters({ book: 'John', chapter: 3 })).toEqual({
      previous: { book: 'John', chapter: 2 },
      next: { book: 'John', chapter: 4 },
    })
  })

  it('runs on between books', () => {
    expect(adjacentChapters({ book: 'Mal', chapter: 4 }).next).toEqual({ book: 'Matt', chapter: 1 })
    expect(adjacentChapters({ book: 'Matt', chapter: 1 }).previous).toEqual({
      book: 'Mal',
      chapter: 4,
    })
  })

  it('stops at either end of the Bible', () => {
    expect(adjacentChapters({ book: 'Gen', chapter: 1 }).previous).toBeUndefined()
    expect(adjacentChapters({ book: 'Rev', chapter: 22 }).next).toBeUndefined()
  })
})

const blocks: Block[] = [
  { kind: 'heading', content: ['A Heading'] },
  { kind: 'p', content: [{ verse: 1 }, 'One. ', { verse: 2 }, 'Two begins'] },
  { kind: 'line1', content: ['and two ends.', { note: 0 }] },
  { kind: 'line2', content: [{ verse: 3 }, 'Three.'] },
]

describe('segmentBlocks', () => {
  it('splits text at verse numbers, carrying a verse on into the next block', () => {
    expect(segmentBlocks(blocks).map(block => block.segments)).toEqual([
      [],
      [
        { verse: 1, content: [{ verse: 1 }, 'One. '] },
        { verse: 2, content: [{ verse: 2 }, 'Two begins'] },
      ],
      [{ verse: 2, content: ['and two ends.', { note: 0 }] }],
      [{ verse: 3, content: [{ verse: 3 }, 'Three.'] }],
    ])
  })
})

describe('versesByLine', () => {
  it('gives each verse a row, joining a verse split across blocks', () => {
    expect(versesByLine(blocks)).toEqual([
      { kind: 'heading', content: ['A Heading'] },
      { kind: 'verse', verse: 1, content: ['One. '] },
      { kind: 'verse', verse: 2, content: ['Two begins', ' ', 'and two ends.', { note: 0 }] },
      { kind: 'verse', verse: 3, content: ['Three.'] },
    ])
  })
})

describe('plainText', () => {
  it('keeps only the words', () => {
    expect(
      plainText([
        { verse: 1 },
        'Or ',
        { italic: ['a vault'] },
        { note: 0 },
        '; see ',
        { ref: 'Gen.1.7', text: ['verse 7'] },
      ]),
    ).toBe('Or a vault; see verse 7')
  })
})

describe('formatVerses', () => {
  it('joins runs of verses', () => {
    expect(formatVerses([16])).toBe('16')
    expect(formatVerses([18, 16, 17])).toBe('16–18')
    expect(formatVerses([1, 3, 4])).toBe('1, 3–4')
  })
})
