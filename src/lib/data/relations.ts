import type { Dating, Kingdom, Person } from './schema'

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

/**
 * A kingdom's kings in order of succession, following each reign's successor link. Starts from
 * whichever king without a predecessor in that kingdom heads the longest line, so a lone rival
 * like Ish-bosheth doesn't displace Jeroboam I.
 */
export function kingsInOrder(people: Person[], kingdom: Kingdom) {
  const byId = new Map(people.map(person => [person.id, person]))
  const inKingdom = (id: string | undefined) =>
    id === undefined
      ? undefined
      : byId.get(id)?.reign?.kingdom === kingdom
        ? byId.get(id)
        : undefined

  const lineFrom = (first: Person) => {
    const line = [first]
    for (let next = inKingdom(first.reign?.successor); next && !line.includes(next);) {
      line.push(next)
      next = inKingdom(next.reign?.successor)
    }
    return line
  }

  return people
    .filter(person => person.reign?.kingdom === kingdom && !inKingdom(person.reign.predecessor))
    .map(lineFrom)
    .reduce<Person[]>((longest, line) => (line.length > longest.length ? line : longest), [])
}
