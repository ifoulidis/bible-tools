import { people } from '$lib/data'
import { buildContemporaries } from '$lib/data/relations'
import { toTimelinePerson } from '$lib/timeline/layout'

import type { PageServerLoad } from './$types'

const timelinePeople = people.map(toTimelinePerson)
const contemporaries = Object.fromEntries(
  [...buildContemporaries(people)].map(([id, ids]) => [id, [...ids]]),
)

export const load: PageServerLoad = () => ({ people: timelinePeople, contemporaries })
