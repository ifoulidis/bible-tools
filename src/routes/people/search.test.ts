import { describe, expect, it } from 'vitest'

import { people } from '$lib/data'

import { defaultFilters, filterPeople, toPersonEntry } from './search'

const entries = people.map(toPersonEntry)
const ids = (filters: Partial<typeof defaultFilters>) =>
  filterPeople(entries, { ...defaultFilters, ...filters }).map(entry => entry.id)

describe('filterPeople', () => {
  it('lists everyone, earliest first, with no filters', () => {
    const all = ids({})
    expect(all).toHaveLength(people.length)
    expect(all[0]).toBe('samuel')
  })

  it('matches alternative names, ignoring case', () => {
    expect(ids({ query: 'UZZIAH' })[0]).toBe('azariah')
  })

  it('puts an exact name before names that only start with it', () => {
    expect(ids({ query: 'jehu' }).slice(0, 2)).toEqual(['jehu', 'jehu-son-of-hanani'])
  })

  it('ranks name matches above summary matches', () => {
    const found = ids({ query: 'isaiah' })
    expect(found[0]).toBe('isaiah')
    expect(found).toContain('hezekiah')
  })

  it('combines role, kingdom and book filters', () => {
    const found = filterPeople(entries, {
      ...defaultFilters,
      role: 'prophet',
      kingdom: 'judah',
      hasBook: true,
    })
    expect(found.length).toBeGreaterThan(0)
    for (const entry of found) {
      expect(entry.role).toBe('prophet')
      expect(entry.kingdoms).toContain('judah')
      expect(entry.hasBook).toBe(true)
    }
  })

  it('sorts by name when asked', () => {
    const names = filterPeople(entries, { ...defaultFilters, sort: 'name' }).map(e => e.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })
})
