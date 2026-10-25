import { getContext, setContext } from 'svelte'

import type { Note } from '$lib/bible'

/** What the text needs from the chapter around it, however deep it's nested */
export interface PassageContext {
  readonly chapter: number
  readonly notes: Note[]
  isSelected(verse: number): boolean
  toggleVerse(verse: number): void
}

const key = Symbol('passage')

export const setPassage = (context: PassageContext) => setContext(key, context)
export const getPassage = () => getContext<PassageContext>(key)

/**
 * Keyboard handling for a span acting as a button. Verse numbers and footnote calls are spans
 * because a real button is an inline block, which lets a line break fall right after it and leave
 * a verse number at the end of a line, apart from its verse
 */
export const pressed = (action: () => void) => (event: KeyboardEvent) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  action()
}

/** Footnotes are called a, b, c… through z, then aa, ab… as printed Bibles do */
export function noteLabel(index: number): string {
  const letter = String.fromCharCode(97 + (index % 26))
  return index < 26 ? letter : noteLabel(Math.floor(index / 26) - 1) + letter
}
