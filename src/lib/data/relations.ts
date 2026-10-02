import type { Dating, Person } from './schema'

function primaryDatings(person: Person): Dating[] {
  return [person.reign?.dating, person.ministry?.dating].filter(dating => dating !== undefined)
}

/** Ids named as contemporaries in a person's own superscription or narrative-contact evidence */
function namedContemporaries(person: Person) {
  return primaryDatings(person).flatMap(dating =>
    dating.evidence.flatMap(evidence =>
      'contemporaries' in evidence ? evidence.contemporaries : [],
    ),
  )
}

/**
 * Contemporaries in both directions: Hosea names Uzziah in Hos 1:1, so Uzziah's contemporaries
 * include Hosea too. Built from the text's explicit links rather than overlapping dates, which
 * would pair a prophet with every king alive in a given decade.
 */
export function buildContemporaries(people: Person[]) {
  const links = new Map<string, Set<string>>(people.map(person => [person.id, new Set()]))
  for (const person of people) {
    for (const otherId of namedContemporaries(person)) {
      if (otherId === person.id) continue
      links.get(person.id)?.add(otherId)
      links.get(otherId)?.add(person.id)
    }
  }
  return links
}
