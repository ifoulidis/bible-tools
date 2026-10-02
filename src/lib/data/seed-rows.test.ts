import { describe, expect, it } from 'vitest'

import { people, peopleById, sources, sourcesById } from './index'
import { toSeedRows } from './seed-rows'

const rows = toSeedRows({ people, peopleById, sources, sourcesById })

describe('toSeedRows', () => {
  it('has one person row per person and one reign or ministry per facet', () => {
    expect(rows.people).toHaveLength(people.length)
    expect(rows.reigns).toHaveLength(people.filter(p => p.reign).length)
    expect(rows.ministries).toHaveLength(people.filter(p => p.ministry).length)
  })

  it('gives every table unique ids', () => {
    for (const table of [rows.datings, rows.evidence, rows.citations, rows.passages, rows.family]) {
      const ids = table.map(row => row.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('puts the primary dating at position 0 and alternatives after it, labelled', () => {
    const hezekiah = rows.datings.filter(row => row.personId === 'hezekiah')
    expect(hezekiah.map(row => [row.position, row.label])).toEqual([
      [0, null],
      [1, 'McFall (coregency from 729)'],
      [2, 'Albright'],
    ])
    expect(hezekiah[1]).toMatchObject({ spanFrom: 716, spanTo: 687, coregencyFrom: 729 })
  })

  it('only references datings and sources that exist', () => {
    const datingIds = new Set(rows.datings.map(row => row.id))
    const sourceIds = new Set(rows.sources.map(row => row.id))
    for (const row of [...rows.evidence, ...rows.citations])
      expect(datingIds).toContain(row.datingId)
    for (const row of rows.citations) expect(sourceIds).toContain(row.sourceId)
  })

  it('flattens each kind of evidence into its columns', () => {
    const ahab = rows.evidence.filter(row => row.datingId === 'ahab/king/0')
    expect(ahab[0]).toMatchObject({
      kind: 'synchronism',
      book: '1Kgs',
      fromChapter: 16,
      fromVerse: 29,
    })
    expect(ahab[1]).toMatchObject({
      kind: 'extrabiblical',
      book: null,
      artifact: expect.stringContaining('Kurkh'),
    })
    const hosea = rows.evidence.find(
      row => row.datingId === 'hosea/prophet/0' && row.kind === 'superscription',
    )
    expect(hosea?.contemporaryIds).toContain('jeroboam-ii')
  })
})
