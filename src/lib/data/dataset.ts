import { z } from 'zod'

import { type Dating, type Person, type Source, personSchema, sourceSchema } from './schema'

export interface Dataset {
  people: Person[]
  peopleById: Map<string, Person>
  sources: Source[]
  sourcesById: Map<string, Source>
}

function datingsOf(person: Person): Dating[] {
  return [person.reign, person.ministry].flatMap(facet =>
    facet ? [facet.dating, ...facet.alternatives.map(alt => alt.dating)] : [],
  )
}

/** Every person id referenced by a person, with a description of where it was referenced */
function personReferences(person: Person): { id: string; where: string }[] {
  const refs = [
    ...person.family.flatMap(member =>
      member.personId ? [{ id: member.personId, where: `family (${member.relation})` }] : [],
    ),
    ...datingsOf(person).flatMap(dating =>
      dating.evidence.flatMap(evidence =>
        'contemporaries' in evidence
          ? evidence.contemporaries.map(id => ({ id, where: `${evidence.kind} evidence` }))
          : [],
      ),
    ),
  ]
  if (person.reign?.predecessor) refs.push({ id: person.reign.predecessor, where: 'predecessor' })
  if (person.reign?.successor) refs.push({ id: person.reign.successor, where: 'successor' })
  return refs
}

/**
 * Parses raw JSON into a dataset, and checks the cross-references that a per-record schema can't:
 * unique ids, referenced people and sources exist, and predecessor/successor links agree.
 * Throws with every problem listed, so bad data fails the build rather than rendering wrongly.
 */
export function parseDataset(rawPeople: unknown[], rawSources: unknown): Dataset {
  const problems: string[] = []

  const sources = z.array(sourceSchema).parse(rawSources)
  const people = rawPeople.flatMap(raw => {
    const result = personSchema.safeParse(raw)
    if (result.success) return [result.data]
    const id = typeof raw === 'object' && raw && 'id' in raw ? String(raw.id) : '(unknown id)'
    problems.push(
      ...result.error.issues.map(issue => `${id}: ${issue.path.join('.')}: ${issue.message}`),
    )
    return []
  })

  const peopleById = new Map<string, Person>()
  for (const person of people) {
    if (peopleById.has(person.id)) problems.push(`${person.id}: duplicate person id`)
    peopleById.set(person.id, person)
  }
  const sourcesById = new Map<string, Source>()
  for (const source of sources) {
    if (sourcesById.has(source.id)) problems.push(`${source.id}: duplicate source id`)
    sourcesById.set(source.id, source)
  }

  for (const person of people) {
    for (const ref of personReferences(person)) {
      if (!peopleById.has(ref.id))
        problems.push(`${person.id}: unknown person "${ref.id}" in ${ref.where}`)
    }
    for (const dating of datingsOf(person)) {
      for (const citation of dating.citations) {
        if (!sourcesById.has(citation.sourceId)) {
          problems.push(`${person.id}: unknown source "${citation.sourceId}"`)
        }
      }
    }

    const reign = person.reign
    if (!reign) continue
    const successor = reign.successor && peopleById.get(reign.successor)
    if (successor && successor.reign?.predecessor !== person.id) {
      problems.push(`${person.id}: successor ${successor.id} doesn't list it as predecessor`)
    }
    const predecessor = reign.predecessor && peopleById.get(reign.predecessor)
    if (predecessor && predecessor.reign?.successor !== person.id) {
      problems.push(`${person.id}: predecessor ${predecessor.id} doesn't list it as successor`)
    }
  }

  if (problems.length > 0) {
    throw new Error(`Invalid people data:\n  ${problems.join('\n  ')}`)
  }

  return { people, peopleById, sources, sourcesById }
}
