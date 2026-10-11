import { people } from '$lib/data'
import { kingsInOrder } from '$lib/data/relations'

import type { PageServerLoad } from './$types'
import { toQuizKing } from './quiz'

const quizzes = {
  israel: kingsInOrder(people, 'israel').map(toQuizKing),
  judah: kingsInOrder(people, 'judah').map(toQuizKing),
}

export const load: PageServerLoad = () => ({ quizzes })
