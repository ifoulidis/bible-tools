import { people } from '$lib/data'

import type { PageServerLoad } from './$types'
import { toPersonEntry } from './search'

const entries = people.map(toPersonEntry)

export const load: PageServerLoad = () => ({ entries })
