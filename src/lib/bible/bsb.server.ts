import type { BookId } from '$lib/data/books'

import type { Chapter } from './types'

/** Each book's chapters, made by scripts/import-bsb.ts. Loaded only when asked for */
const files = import.meta.glob<Chapter[]>('./bsb/*.json', { import: 'default' })

export async function loadChapter(book: BookId, chapter: number) {
  const load = files[`./bsb/${book}.json`] as (typeof files)[string] | undefined
  if (!load) return undefined
  return (await load())[chapter - 1]
}
