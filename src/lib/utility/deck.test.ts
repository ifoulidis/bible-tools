import { describe, expect, it } from 'vitest'

import { deckSummary, reviewCard, startDeck } from './deck'

describe('startDeck', () => {
  it('queues every card once, in order', () => {
    expect(startDeck(['a', 'b', 'a', 'c'])).toEqual({
      queue: ['a', 'b', 'c'],
      known: [],
      misses: {},
    })
  })
})

describe('reviewCard', () => {
  it('moves a known card out of the queue', () => {
    const deck = reviewCard(startDeck(['a', 'b']), true)
    expect(deck.queue).toEqual(['b'])
    expect(deck.known).toEqual(['a'])
  })

  it('sends a missed card back a few places and counts the miss', () => {
    const deck = reviewCard(startDeck(['a', 'b', 'c', 'd', 'e']), false, 3)
    expect(deck.queue).toEqual(['b', 'c', 'd', 'a', 'e'])
    expect(deck.misses).toEqual({ a: 1 })
  })

  it('puts a missed card last when fewer cards are left than the gap', () => {
    expect(reviewCard(startDeck(['a', 'b']), false, 3).queue).toEqual(['b', 'a'])
  })

  it('brings the last card straight back if it is missed', () => {
    const deck = reviewCard(startDeck(['a']), false)
    expect(deck.queue).toEqual(['a'])
    expect(reviewCard(deck, false).misses).toEqual({ a: 2 })
  })

  it('leaves a finished deck alone', () => {
    const finished = reviewCard(startDeck(['a']), true)
    expect(reviewCard(finished, true)).toBe(finished)
    expect(reviewCard(finished, false)).toBe(finished)
  })

  it("doesn't change the deck it was given", () => {
    const deck = startDeck(['a', 'b'])
    reviewCard(deck, false)
    expect(deck).toEqual(startDeck(['a', 'b']))
  })
})

describe('deckSummary', () => {
  it('counts every miss, including repeats of one card', () => {
    let deck = startDeck(['a', 'b'])
    deck = reviewCard(deck, false) // a missed: b, a
    deck = reviewCard(deck, false) // b missed: a, b
    deck = reviewCard(deck, false) // a missed again: b, a
    expect(deckSummary(deck).missed).toBe(3)
  })

  it('splits known cards by whether they were missed first', () => {
    let deck = startDeck(['a', 'b', 'c'])
    deck = reviewCard(deck, true) // a, first time
    deck = reviewCard(deck, false) // b missed, queue c, b
    deck = reviewCard(deck, true) // c, first time
    deck = reviewCard(deck, true) // b, after a miss
    expect(deckSummary(deck)).toEqual({ firstTime: 2, afterMisses: 1, remaining: 0, missed: 1 })
  })

  it('counts what is left part way through', () => {
    expect(deckSummary(startDeck(['a', 'b']))).toEqual({
      firstTime: 0,
      afterMisses: 0,
      remaining: 2,
      missed: 0,
    })
  })
})
