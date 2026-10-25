import { describe, expect, it } from 'vitest'

import { books } from '$lib/data/books'

import { type Chapter, type Inline, chapterCount, osisRefHref } from '.'

const files = import.meta.glob<Chapter[]>('./bsb/*.json', { import: 'default', eager: true })
const bible = books.map(book => ({ book, chapters: files[`./bsb/${book.id}.json`] }))

function* refs(content: Inline[]): Generator<string> {
  for (const inline of content) {
    if (typeof inline === 'string') continue
    if ('ref' in inline) yield inline.ref
    if ('italic' in inline) yield* refs(inline.italic)
  }
}

describe('the imported BSB', () => {
  it('has every chapter of every book', () => {
    for (const { book, chapters } of bible)
      expect(chapters, book.id).toHaveLength(chapterCount(book.id))
  })

  it('only refers to chapters it has, besides books outside the canon', () => {
    const broken = new Set<string>()
    for (const { chapters } of bible) {
      for (const { blocks, notes } of chapters) {
        for (const { content } of [...blocks, ...notes]) {
          for (const ref of refs(content)) if (!osisRefHref(ref)) broken.add(ref.split('.')[0])
        }
      }
    }
    // 1 Enoch is quoted in Jude, and 1 Esdras is compared with Ezra
    expect([...broken].sort()).toEqual(['1En', '1Esd'])
  })
})
