import { error } from '@sveltejs/kit'

import { adjacentChapters, bookFromSlug, bookSlug, chapterCount } from '$lib/bible'
import { loadChapter } from '$lib/bible/bsb.server'
import { books } from '$lib/data/books'

import type { EntryGenerator, PageServerLoad } from './$types'

// Every chapter is built ahead of time, so reading never waits on a server
export const prerender = true

export const entries: EntryGenerator = () =>
  books.flatMap(book =>
    Array.from({ length: chapterCount(book.id) }, (_, i) => ({
      book: bookSlug(book.id),
      chapter: `${i + 1}`,
    })),
  )

export const load: PageServerLoad = async ({ params }) => {
  const book = bookFromSlug(params.book)
  const chapter = Number(params.chapter)
  if (!book || !Number.isInteger(chapter) || chapter < 1 || chapter > chapterCount(book.id)) {
    error(404, 'No such chapter')
  }

  const content = await loadChapter(book.id, chapter)
  if (!content) error(404, 'No such chapter')

  return {
    book: book.id,
    chapter,
    content,
    ...adjacentChapters({ book: book.id, chapter }),
  }
}
