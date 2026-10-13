import { describe, expect, it } from 'vitest'

import type { EventKind, TimelineEvent } from '$lib/data/events'
import { buildContemporaries } from '$lib/data/relations'
import type { Dating, Person } from '$lib/data/schema'

import {
  BAR_GAP_PX,
  MIN_BAR_PX,
  type TimelinePerson,
  eventLabelWidth,
  formatSpan,
  formatYear,
  layoutEvents,
  layoutTimeline,
  packRows,
  scaleFor,
  ticks,
  toTimelinePerson,
  yearToX,
} from './layout'

function dating(from: number, to: number, coregencyFrom?: number): Dating {
  return {
    span: { from, to, approx: false },
    ...(coregencyFrom ? { coregencyFrom } : {}),
    confidence: 'firm',
    evidence: [{ kind: 'inference', note: '' }],
    citations: [{ sourceId: 's' }],
  }
}

/** Both a full person, for buildContemporaries, and the slice the timeline draws */
function person(id: string, facets: Pick<Person, 'reign' | 'ministry'>): Person & TimelinePerson {
  return {
    id,
    name: id,
    altNames: [],
    summary: '',
    family: [],
    attestations: [],
    attestedBy: [],
    passages: [{ book: '1Kgs', from: { chapter: 1 }, kind: 'narrative' }],
    ...facets,
  }
}

const king = (id: string, kingdom: 'israel' | 'judah', d: Dating) =>
  person(id, { reign: { kingdom, dating: d, alternatives: [] } })
const prophet = (id: string, d: Dating, contemporaries: string[] = []) =>
  person(id, {
    ministry: {
      audience: ['israel'],
      hasBook: false,
      alternatives: [],
      dating: {
        ...d,
        evidence: contemporaries.length
          ? [
              {
                kind: 'narrative-contact',
                passage: { book: '1Kgs', from: { chapter: 18 }, kind: 'narrative' },
                contemporaries,
              },
            ]
          : d.evidence,
      },
    },
  })

const scale = { start: 900, end: 800, pxPerYear: 4 }

describe('yearToX', () => {
  it('maps the start of the scale to 0 and later years rightwards', () => {
    expect(yearToX(scale, 900)).toBe(0)
    expect(yearToX(scale, 853)).toBe(188)
    expect(yearToX(scale, 800)).toBe(400)
  })
})

describe('scaleFor', () => {
  it('pads to whole steps and includes coregencies', () => {
    expect(scaleFor([dating(874, 853), dating(767, 740, 792)], 4)).toEqual({
      start: 900,
      end: 700,
      pxPerYear: 4,
    })
  })

  it('keeps bounds already on a step', () => {
    expect(scaleFor([dating(850, 800)], 4)).toMatchObject({ start: 850, end: 800 })
  })

  it('throws on no data', () => {
    expect(() => scaleFor([], 4)).toThrow()
  })
})

describe('ticks', () => {
  it('lists each multiple of the step within the scale', () => {
    expect(ticks(scale, 25)).toEqual([900, 875, 850, 825, 800])
  })

  it('skips a start that is not on a step', () => {
    expect(ticks({ start: 910, end: 860, pxPerYear: 1 }, 25)).toEqual([900, 875])
  })
})

describe('packRows', () => {
  it('puts non-overlapping and touching items in one row', () => {
    expect(
      packRows([
        { x: 0, width: 10 },
        { x: 10, width: 5 },
        { x: 20, width: 5 },
      ]),
    ).toEqual([0, 0, 0])
  })

  it('moves overlapping items to the first free row', () => {
    expect(
      packRows([
        { x: 0, width: 50 },
        { x: 10, width: 10 },
        { x: 15, width: 10 },
        { x: 21, width: 10 },
        { x: 60, width: 10 },
      ]),
    ).toEqual([0, 1, 2, 1, 0])
  })

  it('returns rows in input order regardless of x order', () => {
    expect(
      packRows([
        { x: 30, width: 5 },
        { x: 0, width: 40 },
      ]),
    ).toEqual([1, 0])
  })

  it('handles no items', () => {
    expect(packRows([])).toEqual([])
  })
})

describe('layoutTimeline', () => {
  const people = [
    king('ahab', 'israel', dating(874, 853)),
    king('ahaziah', 'israel', dating(853, 852)),
    king('zimri', 'israel', dating(885, 885)),
    king('jehoshaphat', 'judah', dating(870, 848, 872)),
    king('asa', 'judah', dating(911, 870)),
    prophet('elijah', dating(860, 850)),
    prophet('micaiah', dating(853, 853)),
  ]

  it('groups bars by lane, in lane order, skipping empty lanes', () => {
    const laid = layoutTimeline(people, scale, ['united', 'israel', 'judah', 'prophets'])
    expect(laid.map(lane => lane.id)).toEqual(['israel', 'judah', 'prophets'])
  })

  it('keeps successive reigns on one row and trims the visual gap', () => {
    const [israel] = layoutTimeline(people, scale, ['israel'])
    const ahab = israel.bars.find(bar => bar.person.id === 'ahab')
    expect(israel.rowCount).toBe(1)
    expect(ahab).toMatchObject({ x: 104, width: 21 * 4 - BAR_GAP_PX, row: 0, coregencyWidth: 0 })
  })

  it('gives single-year reigns a minimum width', () => {
    const [israel] = layoutTimeline(people, scale, ['israel'])
    expect(israel.bars.find(bar => bar.person.id === 'zimri')).toMatchObject({
      width: MIN_BAR_PX - BAR_GAP_PX,
      widened: true,
    })
  })

  it('keeps widened one-year reigns on the same row as their neighbours', () => {
    // Omri listed before Zimri, as file order isn't guaranteed
    const chain = [
      king('elah', 'israel', dating(886, 885)),
      king('omri', 'israel', dating(885, 874)),
      king('zimri', 'israel', dating(885, 885)),
    ]
    const [israel] = layoutTimeline(chain, scale, ['israel'])
    expect(israel.rowCount).toBe(1)
  })

  it('separates prophets dated to the same single year', () => {
    const [prophets] = layoutTimeline(
      [prophet('micaiah', dating(853, 853)), prophet('eliezer', dating(853, 852))],
      scale,
      ['prophets'],
    )
    expect(prophets.rowCount).toBe(2)
  })

  it('starts coregent reigns at the coregency and overlaps the predecessor', () => {
    const [judah] = layoutTimeline(people, scale, ['judah'])
    const jehoshaphat = judah.bars.find(bar => bar.person.id === 'jehoshaphat')
    expect(jehoshaphat).toMatchObject({ x: 112, coregencyWidth: 8, row: 1 })
    expect(judah.rowCount).toBe(2)
  })

  it('packs overlapping prophets into separate rows', () => {
    const [prophets] = layoutTimeline(people, scale, ['prophets'])
    expect(prophets.rowCount).toBe(2)
  })

  it('only includes visible lanes', () => {
    expect(layoutTimeline(people, scale, ['prophets']).map(lane => lane.id)).toEqual(['prophets'])
  })

  it('gives a person who is both king and prophet a bar in each lane', () => {
    const both = person('both', {
      reign: { kingdom: 'judah', dating: dating(880, 870), alternatives: [] },
      ministry: { audience: ['judah'], hasBook: false, dating: dating(885, 860), alternatives: [] },
    })
    const laid = layoutTimeline([both], scale, ['judah', 'prophets'])
    expect(laid.map(lane => [lane.id, lane.bars[0].role])).toEqual([
      ['judah', 'king'],
      ['prophets', 'prophet'],
    ])
  })
})

describe('toTimelinePerson', () => {
  it('keeps just the names of the finds that attest someone', () => {
    const attested = {
      ...person('omri', {
        reign: { kingdom: 'israel', dating: dating(885, 874), alternatives: [] },
      }),
      attestations: [{ artifact: 'Mesha Stele', note: 'Names Omri' }],
    }
    expect(toTimelinePerson(attested).attestedBy).toEqual(['Mesha Stele'])
  })

  it('has an empty list for someone no find names', () => {
    const unattested = person('asa', {
      reign: { kingdom: 'judah', dating: dating(911, 870), alternatives: [] },
    })
    expect(toTimelinePerson(unattested).attestedBy).toEqual([])
  })
})

describe('formatSpan', () => {
  it('formats exact, single-year and approximate spans', () => {
    expect(formatSpan(dating(874, 853))).toBe('874–853 BC')
    expect(formatSpan(dating(885, 885))).toBe('885 BC')
    expect(formatSpan({ span: { from: 760, to: 750, approx: true } })).toBe('c. 760–750 BC')
  })
})

describe('buildContemporaries', () => {
  it('links both directions and ignores self references', () => {
    const links = buildContemporaries([
      king('ahab', 'israel', dating(874, 853)),
      king('ahaziah', 'israel', dating(853, 852)),
      prophet('elijah', dating(860, 850), ['ahab', 'ahaziah', 'elijah']),
      prophet('elisha', dating(850, 800)),
    ])
    expect([...(links.get('elijah') ?? [])]).toEqual(['ahab', 'ahaziah'])
    expect([...(links.get('ahab') ?? [])]).toEqual(['elijah'])
    expect(links.get('elisha')?.size).toBe(0)
  })
})

describe('layoutEvents', () => {
  const scale = { start: 1000, end: 500, pxPerYear: 1 }
  const event = (id: string, year: number, kind: EventKind = 'world'): TimelineEvent => ({
    id,
    kind,
    name: id,
    year,
    approx: false,
    detail: '',
  })

  it('places each event at its year, grouped by kind in the order asked for', () => {
    const laidOut = layoutEvents([event('a', 900), event('b', 700, 'bible')], scale, [
      'bible',
      'world',
    ])
    expect(laidOut.map(group => group.kind)).toEqual(['bible', 'world'])
    expect(laidOut[0].markers[0]).toMatchObject({ x: 300, row: 0, side: 'right' })
    expect(laidOut[1].markers[0]).toMatchObject({ x: 100, row: 0 })
  })

  it('leaves out kinds not asked for, kinds with no events, and events off the scale', () => {
    const laidOut = layoutEvents([event('a', 1100), event('b', 400), event('c', 700)], scale, [
      'world',
    ])
    expect(laidOut).toHaveLength(1)
    expect(laidOut[0].markers.map(marker => marker.event.id)).toEqual(['c'])
    expect(layoutEvents([event('a', 700)], scale, ['bible'])).toEqual([])
  })

  it('moves an event down a row rather than let its name run into the next', () => {
    const name = 'a long event name'
    const near = 1000 - Math.ceil(eventLabelWidth(name) / 2)
    const laidOut = layoutEvents(
      [{ ...event('first', 1000), name }, event('second', near), event('far', 600)],
      scale,
      ['world'],
    )
    expect(laidOut[0].markers.map(marker => marker.row)).toEqual([0, 1, 0])
    expect(laidOut[0].rowCount).toBe(2)
  })

  it('puts the name on the left near the end of the chart', () => {
    const [group] = layoutEvents([event('late', 505)], scale, ['world'], 20)
    expect(group.markers[0].side).toBe('left')
  })
})

describe('formatYear', () => {
  it('marks approximate years', () => {
    expect(formatYear({ year: 966, approx: true })).toBe('c. 966 BC')
    expect(formatYear({ year: 931, approx: false })).toBe('931 BC')
  })
})
