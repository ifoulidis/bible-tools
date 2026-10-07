import type { Audience, Kingdom, Person, Span } from '$lib/data'
import { normalizeAnswer } from '$lib/utility/text'

export interface PersonEntry {
  id: string
  name: string
  altNames: string[]
  summary: string
  role: 'king' | 'prophet'
  /** Where a king reigned, or the kingdoms a prophet spoke to */
  kingdoms: Kingdom[]
  hasBook: boolean
  span: Span
}

export type RoleFilter = 'everyone' | 'king' | 'prophet'
export type KingdomFilter = 'any' | Kingdom
export type SortOrder = 'date' | 'name'

export interface PeopleFilters {
  query: string
  role: RoleFilter
  kingdom: KingdomFilter
  hasBook: boolean
  sort: SortOrder
}

export const defaultFilters: PeopleFilters = {
  query: '',
  role: 'everyone',
  kingdom: 'any',
  hasBook: false,
  sort: 'date',
}

const isKingdom = (audience: Audience): audience is Kingdom =>
  audience === 'united' || audience === 'israel' || audience === 'judah'

export function toPersonEntry(person: Person): PersonEntry {
  const facet = person.reign ?? person.ministry
  if (!facet) throw new Error(`${person.id} has neither a reign nor a ministry`)
  return {
    id: person.id,
    name: person.name,
    altNames: person.altNames,
    summary: person.summary,
    role: person.reign ? 'king' : 'prophet',
    kingdoms: person.reign
      ? [person.reign.kingdom]
      : (person.ministry?.audience.filter(isKingdom) ?? []),
    hasBook: person.ministry?.hasBook ?? false,
    span: facet.dating.span,
  }
}

/**
 * Names count for more than the summary, and an exact name most of all, so "Jehu" finds the king
 * before Jehu son of Hanani, and both before anyone whose summary mentions him
 */
function matchRank(entry: PersonEntry, query: string) {
  // Without the bracketed qualifier, so "Joram (Israel)" is an exact match for "joram"
  const names = [entry.name.replace(/\s*\(.*\)$/, ''), ...entry.altNames].map(normalizeAnswer)
  if (names.includes(query)) return 0
  if (names.some(name => name.startsWith(query))) return 1
  if (names.some(name => name.includes(query))) return 2
  if (normalizeAnswer(entry.summary).includes(query)) return 3
  return undefined
}

export function filterPeople(entries: PersonEntry[], filters: PeopleFilters) {
  const query = normalizeAnswer(filters.query)
  const ranked = entries.flatMap(entry => {
    if (filters.role !== 'everyone' && entry.role !== filters.role) return []
    if (filters.kingdom !== 'any' && !entry.kingdoms.includes(filters.kingdom)) return []
    if (filters.hasBook && !entry.hasBook) return []
    const rank = query ? matchRank(entry, query) : 0
    return rank === undefined ? [] : [{ entry, rank }]
  })

  // BC years count down, so the earliest person has the largest start year
  const order =
    filters.sort === 'name'
      ? (a: PersonEntry, b: PersonEntry) => a.name.localeCompare(b.name)
      : (a: PersonEntry, b: PersonEntry) => b.span.from - a.span.from || b.span.to - a.span.to

  return ranked.sort((a, b) => a.rank - b.rank || order(a.entry, b.entry)).map(({ entry }) => entry)
}
