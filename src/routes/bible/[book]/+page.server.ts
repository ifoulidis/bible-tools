import { error, redirect } from '@sveltejs/kit'

import { bookFromSlug, bookSlug, chapterHref } from '$lib/bible'
import { books } from '$lib/data/books'

import type { EntryGenerator, PageServerLoad } from './$types'

export const prerender = true

export const entries: EntryGenerator = () => books.map(book => ({ book: bookSlug(book.id) }))

/** A book on its own opens at its first chapter */
export const load: PageServerLoad = ({ params }) => {
  const book = bookFromSlug(params.book)
  if (!book) error(404, 'No such book')
  redirect(307, chapterHref(book.id, 1))
}
