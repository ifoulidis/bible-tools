/**
 * A flashcard deck worked through until every card is known. A card you didn't know goes back a
 * few places in the queue, so it comes round again soon but not straight away.
 */
export interface Deck {
  /** Card ids still to review, the current one first */
  queue: string[]
  /** Cards known, in the order they were got */
  known: string[]
  /** How many times each card was missed before it was known */
  misses: Record<string, number>
}

/** How many other cards come up before a missed card does again */
export const RETRY_GAP = 3

export function startDeck(ids: string[]): Deck {
  return { queue: [...new Set(ids)], known: [], misses: {} }
}

/** Marks the current card, returning the deck as it is after it. A finished deck is unchanged */
export function reviewCard(deck: Deck, knew: boolean, gap = RETRY_GAP): Deck {
  if (deck.queue.length === 0) return deck
  const [current, ...rest] = deck.queue
  if (knew) return { ...deck, queue: rest, known: [...deck.known, current] }
  const at = Math.min(gap, rest.length)
  return {
    ...deck,
    queue: [...rest.slice(0, at), current, ...rest.slice(at)],
    misses: { ...deck.misses, [current]: (deck.misses[current] ?? 0) + 1 },
  }
}

/** Known cards, split by whether they were got first time, and every miss along the way */
export function deckSummary(deck: Deck) {
  const firstTime = deck.known.filter(id => !deck.misses[id]).length
  return {
    firstTime,
    afterMisses: deck.known.length - firstTime,
    remaining: deck.queue.length,
    missed: Object.values(deck.misses).reduce((sum, count) => sum + count, 0),
  }
}
