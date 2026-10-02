import { error } from '@sveltejs/kit'

import { type Person, comparePassages, people, peopleById, sourcesById } from '$lib/data'
import { buildContemporaries } from '$lib/data/relations'

import type { PageServerLoad } from './$types'

const contemporaries = buildContemporaries(people)

const link = (person: Person) => ({ id: person.id, name: person.name })

export const load: PageServerLoad = ({ params }) => {
  const person = peopleById.get(params.slug)
  if (!person) error(404, `No king or prophet found for "${params.slug}"`)

  const linked = (id: string | undefined) => {
    const other = id === undefined ? undefined : peopleById.get(id)
    return other ? link(other) : null
  }

  const datings = [person.reign, person.ministry].flatMap(facet =>
    facet ? [facet.dating, ...facet.alternatives.map(alt => alt.dating)] : [],
  )
  const citedSourceIds = new Set(datings.flatMap(d => d.citations.map(c => c.sourceId)))

  return {
    person,
    passages: [...person.passages].sort(comparePassages),
    predecessor: linked(person.reign?.predecessor),
    successor: linked(person.reign?.successor),
    contemporaries: [...(contemporaries.get(person.id) ?? [])]
      .flatMap(id => {
        const other = peopleById.get(id)
        return other ? [{ ...link(other), role: other.reign ? 'King' : 'Prophet' }] : []
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
    /** Names for every person id the page might link to */
    names: Object.fromEntries(people.map(p => [p.id, p.name])),
    sources: Object.fromEntries(
      [...citedSourceIds].flatMap(id => {
        const source = sourcesById.get(id)
        return source ? [[id, source]] : []
      }),
    ),
  }
}
