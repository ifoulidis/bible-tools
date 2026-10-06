/** Lowercased, without punctuation or extra spaces, so "  Jeroboam   I." matches "jeroboam i" */
export function normalizeAnswer(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Edit-distance table between two strings, where `table[i][j]` is the distance for `a[:i]`, `b[:j]` */
function distanceTable(a: string, b: string) {
  const table = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  )
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const substitution = table[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      table[i][j] = Math.min(table[i - 1][j] + 1, table[i][j - 1] + 1, substitution)
    }
  }
  return table
}

/** 1 for identical strings down to 0 for nothing in common, from the Levenshtein distance */
export function similarity(a: string, b: string) {
  const longest = Math.max(a.length, b.length)
  if (longest === 0) return 1
  return 1 - distanceTable(a, b)[a.length][b.length] / longest
}

/** One column of an alignment: a character from each string, or null where one has a gap */
export interface AlignedPair {
  a: string | null
  b: string | null
  same: boolean
}

/** Lines two strings up character by character, ignoring case, along their cheapest edit path */
export function alignCharacters(a: string, b: string): AlignedPair[] {
  const table = distanceTable(a.toLowerCase(), b.toLowerCase())
  const pairs: AlignedPair[] = []
  let i = a.length
  let j = b.length
  while (i > 0 || j > 0) {
    const same = i > 0 && j > 0 && a[i - 1].toLowerCase() === b[j - 1].toLowerCase()
    if (i > 0 && j > 0 && table[i][j] === table[i - 1][j - 1] + (same ? 0 : 1)) {
      pairs.push({ a: a[--i], b: b[--j], same })
    } else if (i > 0 && table[i][j] === table[i - 1][j] + 1) {
      pairs.push({ a: a[--i], b: null, same: false })
    } else {
      pairs.push({ a: null, b: b[--j], same: false })
    }
  }
  return pairs.reverse()
}

export type Verdict = 'correct' | 'typo' | 'incorrect'

/**
 * Marks a typed answer against every accepted spelling. Anything more than `typoThreshold`
 * similar to one of them is a typo rather than a wrong answer.
 */
export function gradeAnswer(given: string, accepted: string[], typoThreshold = 0.7) {
  const normalized = normalizeAnswer(given)
  const scored = accepted.map(answer => ({
    answer,
    score: similarity(normalized, normalizeAnswer(answer)),
  }))
  const closest = scored.reduce((best, next) => (next.score > best.score ? next : best))
  const verdict: Verdict =
    closest.score === 1 ? 'correct' : closest.score > typoThreshold ? 'typo' : 'incorrect'
  return { verdict, closest: closest.answer }
}
