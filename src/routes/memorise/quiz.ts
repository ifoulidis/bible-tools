import type { Person } from '$lib/data'

export const quizKingdoms = ['israel', 'judah'] as const
export type QuizKingdom = (typeof quizKingdoms)[number]

/** The kingdom in a `?kingdom=` param, falling back to Israel for anything else */
export function parseKingdom(param: string | null): QuizKingdom {
  return quizKingdoms.find(kingdom => kingdom === param) ?? 'israel'
}

/** "Zechariah (king)" is just "Zechariah" once you already know you're naming kings */
export const withoutQualifier = (name: string) => name.replace(/\s*\(.*\)$/, '')

const ordinals = ['first', 'second', 'third']

/** "Jeroboam II" → { base: "Jeroboam", number: 2 }; a name without a numeral has no number */
export function splitRegnalNumber(name: string): { base: string; number?: number } {
  const match = /^(.*\S)\s+(I{1,3})$/.exec(name)
  if (!match) return { base: name }
  return { base: match[1], number: match[2].length }
}

/**
 * Every way of writing a name that should count as right. The numeral only tells two kings of the
 * same name apart, so "Jeroboam" is enough, and "Jeroboam 2" or "Jeroboam the second" also work.
 */
export function nameVariants(name: string): string[] {
  const { base, number } = splitRegnalNumber(name)
  if (number === undefined) return [name]
  return [name, base, `${base} ${number}`, `${base} the ${ordinals[number - 1]}`]
}

export function toQuizKing(person: Pick<Person, 'id' | 'name' | 'altNames'>) {
  const answer = withoutQualifier(person.name)
  return {
    id: person.id,
    answer,
    accepted: [...new Set([answer, ...person.altNames].flatMap(nameVariants))],
  }
}
