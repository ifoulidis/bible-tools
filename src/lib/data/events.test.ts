import { describe, expect, it } from 'vitest'

import { events } from './events'
import { people } from './index'

describe('events', () => {
  it('have unique ids', () => {
    const ids = events.map(event => event.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('fall within the years the people cover, so the timeline shows every one', () => {
    const years = people.flatMap(person =>
      [person.reign, person.ministry].flatMap(facet =>
        facet ? [facet.dating.coregencyFrom ?? facet.dating.span.from, facet.dating.span.to] : [],
      ),
    )
    for (const event of events) {
      expect(event.year, event.id).toBeLessThanOrEqual(Math.max(...years))
      expect(event.year, event.id).toBeGreaterThanOrEqual(Math.min(...years))
    }
  })

  it('give a passage for every event in the Bible', () => {
    for (const event of events.filter(event => event.kind === 'bible')) {
      expect(event.ref, event.id).toBeTruthy()
    }
  })
})
