import { describe, expect, it } from 'vitest'

import { parseDataset } from './dataset'
import { people, peopleById } from './index'

const sources = [{ id: 'src', author: 'A', title: 'T', year: 2000, kind: 'book' }]

function king(
  id: string,
  extra: Record<string, unknown> = {},
  datingExtra: Record<string, unknown> = {},
) {
  return {
    id,
    name: id,
    altNames: [],
    summary: 'A king',
    reign: {
      kingdom: 'judah',
      alternatives: [],
      dating: {
        span: { from: 900, to: 890, approx: false },
        confidence: 'firm',
        evidence: [{ kind: 'inference', note: 'n' }],
        citations: [{ sourceId: 'src' }],
        ...datingExtra,
      },
      ...extra,
    },
    family: [],
    passages: [{ book: '1Kgs', from: { chapter: 1 }, kind: 'narrative' }],
  }
}

describe('parseDataset', () => {
  it('accepts a consistent dataset', () => {
    const data = parseDataset(
      [king('a', { successor: 'b' }), king('b', { predecessor: 'a' })],
      sources,
    )
    expect(data.people.map(p => p.id)).toEqual(['a', 'b'])
    expect(data.peopleById.get('b')?.reign?.predecessor).toBe('a')
  })

  it('rejects a person who is neither king nor prophet', () => {
    const nobody = { ...king('a'), reign: undefined }
    expect(() => parseDataset([nobody], sources)).toThrow(/king, a prophet, or both/)
  })

  it('rejects a span that ends before it starts', () => {
    expect(() =>
      parseDataset([king('a', {}, { span: { from: 890, to: 900, approx: false } })], sources),
    ).toThrow(/span must start before/)
  })

  it('accepts a single-year span', () => {
    expect(() =>
      parseDataset([king('a', {}, { span: { from: 885, to: 885, approx: false } })], sources),
    ).not.toThrow()
  })

  it('rejects a coregency that starts after the sole reign', () => {
    expect(() => parseDataset([king('a', {}, { coregencyFrom: 880 })], sources)).toThrow(
      /coregency must begin before/,
    )
  })

  it('rejects a dating with no citations', () => {
    expect(() => parseDataset([king('a', {}, { citations: [] })], sources)).toThrow(/citations/)
  })

  it('rejects unknown sources and people', () => {
    expect(() =>
      parseDataset(
        [king('a', { successor: 'ghost' }, { citations: [{ sourceId: 'nope' }] })],
        sources,
      ),
    ).toThrow(/unknown person "ghost" in successor[\s\S]*unknown source "nope"/)
  })

  it('rejects contemporaries that do not exist', () => {
    const evidence = [
      {
        kind: 'narrative-contact',
        passage: { book: '1Kgs', from: { chapter: 18 }, kind: 'narrative' },
        contemporaries: ['ghost'],
      },
    ]
    expect(() => parseDataset([king('a', {}, { evidence })], sources)).toThrow(
      /unknown person "ghost" in narrative-contact evidence/,
    )
  })

  it('rejects one-sided succession links', () => {
    expect(() => parseDataset([king('a', { successor: 'b' }), king('b')], sources)).toThrow(
      /successor b doesn't list it as predecessor/,
    )
  })

  it('rejects duplicate ids', () => {
    expect(() => parseDataset([king('a'), king('a')], sources)).toThrow(/duplicate person id/)
  })

  it('rejects a passage that ends before it starts', () => {
    const person = {
      ...king('a'),
      passages: [
        {
          book: '1Kgs',
          from: { chapter: 5, verse: 3 },
          to: { chapter: 5, verse: 1 },
          kind: 'narrative',
        },
      ],
    }
    expect(() => parseDataset([person], sources)).toThrow(/passage must end after it starts/)
  })
})

describe('the real dataset', () => {
  it('loads', () => {
    expect(people.length).toBeGreaterThan(40)
  })

  it('has one unbroken succession chain per kingdom of the divided monarchy', () => {
    for (const [first, last] of [
      ['jeroboam-i', 'hoshea'],
      ['rehoboam', 'zedekiah'],
    ] as const) {
      let current = peopleById.get(first)
      let count = 0
      while (current?.reign?.successor) {
        current = peopleById.get(current.reign.successor)
        count++
      }
      expect(current?.id).toBe(last)
      expect(count).toBeGreaterThan(15)
    }
  })

  it('gives each prophet with a book exactly one book passage, and no one else any', () => {
    for (const person of people) {
      const books = person.passages.filter(passage => passage.kind === 'book').length
      expect(books, person.id).toBe(person.ministry?.hasBook ? 1 : 0)
    }
  })

  // Coregencies and rival reigns (Pekah) may overlap a predecessor, but sole reigns never should
  it("starts each successor's sole reign the year its predecessor's ends", () => {
    for (const person of people) {
      const successorId = person.reign?.successor
      const successor = successorId === undefined ? undefined : peopleById.get(successorId)
      if (!successor?.reign || !person.reign) continue
      expect(successor.reign.dating.span.from, `${person.id} → ${successor.id}`).toBe(
        person.reign.dating.span.to,
      )
    }
  })
})
