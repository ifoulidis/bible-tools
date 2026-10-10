import { type Person, people } from '$lib/data'
import { kingsInOrder } from '$lib/data/relations'

import type { PageServerLoad } from './$types'

/** "Zechariah (king)" is just "Zechariah" once you already know you're naming kings */
const withoutQualifier = (name: string) => name.replace(/\s*\(.*\)$/, '')

function toQuizKing(person: Person) {
  const answer = withoutQualifier(person.name)
  // "Jeroboam" is enough for Jeroboam I; the numeral only tells him apart from Jeroboam II
  const withoutNumeral = answer.replace(/\s+I{1,3}$/, '')
  return {
    id: person.id,
    answer,
    accepted: [...new Set([answer, withoutNumeral, ...person.altNames])],
  }
}

const quizzes = {
  israel: kingsInOrder(people, 'israel').map(toQuizKing),
  judah: kingsInOrder(people, 'judah').map(toQuizKing),
}

export const load: PageServerLoad = () => ({ quizzes })
