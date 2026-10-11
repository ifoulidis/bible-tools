import { describe, expect, it } from 'vitest'

import {
  alignCharacters,
  gradeAnswer,
  normalizeAnswer,
  plural,
  similarity,
  tallyVerdicts,
} from './text'

describe('normalizeAnswer', () => {
  it('ignores case, punctuation and spacing', () => {
    expect(normalizeAnswer('  Jeroboam   I. ')).toBe('jeroboam i')
    expect(normalizeAnswer('Ish-bosheth')).toBe('ishbosheth')
  })
})

describe('similarity', () => {
  it('is 1 for identical strings and 0 for nothing shared', () => {
    expect(similarity('asa', 'asa')).toBe(1)
    expect(similarity('abc', 'xyz')).toBe(0)
  })

  it('scales one edit by the longer length', () => {
    expect(similarity('nadab', 'nadabb')).toBeCloseTo(5 / 6)
  })
})

describe('alignCharacters', () => {
  it('pairs matching characters and leaves gaps for insertions', () => {
    expect(alignCharacters('Ahb', 'ahab')).toEqual([
      { a: 'A', b: 'a', same: true },
      { a: 'h', b: 'h', same: true },
      { a: null, b: 'a', same: false },
      { a: 'b', b: 'b', same: true },
    ])
  })
})

describe('gradeAnswer', () => {
  it('accepts any listed spelling exactly', () => {
    expect(gradeAnswer('uzziah', ['Azariah', 'Uzziah'])).toEqual({
      verdict: 'correct',
      closest: 'Uzziah',
    })
  })

  it('calls a near miss a typo and names the spelling it was closest to', () => {
    expect(gradeAnswer('Hezekia', ['Hezekiah'])).toEqual({
      verdict: 'typo',
      closest: 'Hezekiah',
    })
  })

  it('calls anything 70% similar or less incorrect', () => {
    expect(gradeAnswer('Ahab', ['Omri']).verdict).toBe('incorrect')
  })
})

describe('tallyVerdicts', () => {
  it('counts each verdict', () => {
    expect(tallyVerdicts(['correct', 'typo', 'correct', 'incorrect'])).toEqual({
      correct: 2,
      typo: 1,
      incorrect: 1,
    })
  })

  it('is all zeroes before any answers', () => {
    expect(tallyVerdicts([])).toEqual({ correct: 0, typo: 0, incorrect: 0 })
  })
})

describe('plural', () => {
  it('uses the singular for exactly one', () => {
    expect(plural(1, 'typo')).toBe('1 typo')
  })

  it('uses the plural for none or many', () => {
    expect(plural(0, 'typo')).toBe('0 typos')
    expect(plural(2, 'person', 'people')).toBe('2 people')
  })
})
