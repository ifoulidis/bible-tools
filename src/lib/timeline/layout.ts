import type { Dating, Kingdom, Person } from '$lib/data/schema'

export const lanes = [
  { id: 'united', title: 'United kingdom' },
  { id: 'israel', title: 'Israel (north)' },
  { id: 'judah', title: 'Judah (south)' },
  { id: 'prophets', title: 'Prophets' },
] as const

export type LaneId = (typeof lanes)[number]['id']

/** Just the parts of a dating the timeline draws */
export type TimelineDating = Pick<Dating, 'span' | 'coregencyFrom' | 'confidence'>

/** The slice of a person sent to the timeline page, rather than every passage and citation */
export interface TimelinePerson {
  id: string
  name: string
  reign?: { kingdom: Kingdom; dating: TimelineDating }
  ministry?: { dating: TimelineDating }
}

const toTimelineDating = ({ span, coregencyFrom, confidence }: Dating): TimelineDating => ({
  span,
  ...(coregencyFrom === undefined ? {} : { coregencyFrom }),
  confidence,
})

export function toTimelinePerson({ id, name, reign, ministry }: Person): TimelinePerson {
  return {
    id,
    name,
    ...(reign ? { reign: { kingdom: reign.kingdom, dating: toTimelineDating(reign.dating) } } : {}),
    ...(ministry ? { ministry: { dating: toTimelineDating(ministry.dating) } } : {}),
  }
}

/** `start` is the earliest year shown (largest BC number), `end` the latest */
export interface Scale {
  start: number
  end: number
  pxPerYear: number
}

export interface Bar {
  person: TimelinePerson
  role: 'king' | 'prophet'
  dating: TimelineDating
  row: number
  x: number
  width: number
  /** Width of the leading coregency segment, 0 if there is none */
  coregencyWidth: number
  /** Drawn wider than its true length, so it may overlap a neighbour and should sit on top */
  widened: boolean
}

export interface LaidOutLane {
  id: LaneId
  title: string
  rowCount: number
  bars: Bar[]
}

/** Bars narrower than this are widened so single-year reigns stay visible and hoverable */
export const MIN_BAR_PX = 6
/** Visual gap trimmed off the end of each bar, so touching reigns read as separate */
export const BAR_GAP_PX = 2

export function yearToX(scale: Scale, year: number) {
  return (scale.start - year) * scale.pxPerYear
}

export function scaleWidth(scale: Scale) {
  return yearToX(scale, scale.end)
}

/** First year a dating covers, including any coregency */
export function startYear(dating: TimelineDating) {
  return dating.coregencyFrom ?? dating.span.from
}

/** A scale covering every dating, padded out to whole multiples of `step` years */
export function scaleFor(datings: TimelineDating[], pxPerYear: number, step = 50): Scale {
  if (datings.length === 0) throw new Error('scaleFor needs at least one dating')
  const earliest = Math.max(...datings.map(startYear))
  const latest = Math.min(...datings.map(dating => dating.span.to))
  return {
    start: Math.ceil(earliest / step) * step,
    end: Math.floor(latest / step) * step,
    pxPerYear,
  }
}

/** Years (BC) at every multiple of `step` within the scale, earliest first */
export function ticks(scale: Scale, step: number) {
  const years: number[] = []
  for (let year = Math.floor(scale.start / step) * step; year >= scale.end; year -= step) {
    if (year <= scale.start) years.push(year)
  }
  return years
}

interface Extent {
  x: number
  width: number
}

/**
 * Greedy interval packing: items are placed left to right in the first row whose last bar ends at
 * or before the item starts (so touching bars share a row). Returns each item's row, in input order.
 */
export function packRows(extents: Extent[]) {
  // Ties go shortest first, so a zero-length reign (Zimri) is placed before the reign that starts
  // the same year (Omri) rather than being pushed onto a new row by it
  const order = extents
    .map((_, i) => i)
    .sort((a, b) => extents[a].x - extents[b].x || extents[a].width - extents[b].width)
  const rowEnds: number[] = []
  const rows = new Array<number>(extents.length)
  for (const i of order) {
    const { x, width } = extents[i]
    let row = rowEnds.findIndex(end => end <= x)
    if (row === -1) row = rowEnds.length
    rowEnds[row] = x + width
    rows[i] = row
  }
  return rows
}

function barExtent(scale: Scale, dating: TimelineDating) {
  const x = yearToX(scale, startYear(dating))
  const trueWidth = yearToX(scale, dating.span.to) - x
  const coregencyWidth =
    dating.coregencyFrom === undefined ? 0 : yearToX(scale, dating.span.from) - x
  return { x, trueWidth, width: Math.max(trueWidth, MIN_BAR_PX), coregencyWidth }
}

export function layoutTimeline(
  people: TimelinePerson[],
  scale: Scale,
  visible: readonly LaneId[],
): LaidOutLane[] {
  const entries = people.flatMap(person => {
    const items: { lane: LaneId; role: Bar['role']; dating: TimelineDating }[] = []
    if (person.reign)
      items.push({ lane: person.reign.kingdom, role: 'king', dating: person.reign.dating })
    if (person.ministry) {
      items.push({ lane: 'prophets', role: 'prophet', dating: person.ministry.dating })
    }
    return items.map(item => ({ ...item, person, ...barExtent(scale, item.dating) }))
  })

  return lanes
    .filter(lane => visible.includes(lane.id))
    .map(lane => {
      const laneEntries = entries.filter(entry => entry.lane === lane.id)
      // Kings succeed one another, so pack them by true length: a one-year reign drawn at the
      // minimum width stays in line with its neighbours. Prophets don't, so pack them as drawn,
      // or two single-year prophets in the same year would hide one another.
      const rows = packRows(
        lane.id === 'prophets'
          ? laneEntries
          : laneEntries.map(({ x, trueWidth }) => ({ x, width: trueWidth })),
      )
      const bars = laneEntries.map(
        ({ person, role, dating, x, width, trueWidth, coregencyWidth }, i) => ({
          person,
          role,
          dating,
          x,
          width: width - BAR_GAP_PX,
          coregencyWidth,
          widened: width > trueWidth,
          row: rows[i],
        }),
      )
      return {
        id: lane.id,
        title: lane.title,
        rowCount: Math.max(0, ...rows) + 1,
        bars,
      }
    })
    .filter(lane => lane.bars.length > 0)
}

/** "874–853 BC", "885 BC", "c. 760–750 BC" */
export function formatSpan({ span }: Pick<TimelineDating, 'span'>) {
  const prefix = span.approx ? 'c. ' : ''
  const years = span.from === span.to ? `${span.from}` : `${span.from}–${span.to}`
  return `${prefix}${years} BC`
}
