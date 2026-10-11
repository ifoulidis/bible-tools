import { describe, expect, it } from 'vitest'

import {
  alignCharacters,
  formatYear,
  gradeAnswer,
  gradeYear,
  normalizeAnswer,
  parseYear,
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

describe('parseYear', () => {
  it('reads a bare number in the given era', () => {
    expect(parseYear('1868')).toBe(1868)
    expect(parseYear('586', 'BC')).toBe(-586)
  })

  it('lets an era written in the answer override the default', () => {
    expect(parseYear('586 BC')).toBe(-586)
    expect(parseYear('586 bce')).toBe(-586)
    expect(parseYear('AD 70', 'BC')).toBe(70)
    expect(parseYear('70 CE', 'BC')).toBe(70)
  })

  it('allows "c." and spacing', () => {
    expect(parseYear('  c. 1000 BC ')).toBe(-1000)
    expect(parseYear('circa 1947')).toBe(1947)
    expect(parseYear('c1947')).toBe(1947)
  })

  it('is null for anything that is not a year', () => {
    expect(parseYear('')).toBeNull()
    expect(parseYear('the 1800s')).toBeNull()
    expect(parseYear('18688')).toBeNull()
    expect(parseYear('0')).toBeNull()
    expect(parseYear('AD 70 BC')).toBeNull()
    expect(parseYear('-586')).toBeNull()
  })
})

describe('formatYear', () => {
  it('writes BC years with the era after', () => {
    expect(formatYear(-586)).toBe('586 BC')
  })

  it('marks short AD years so they are not taken for BC', () => {
    expect(formatYear(70)).toBe('AD 70')
    expect(formatYear(1868)).toBe('1868')
  })
})

describe('gradeYear', () => {
  it('is correct for the exact year, however it is written', () => {
    expect(gradeYear('1868', 1868)).toEqual({ verdict: 'correct', closest: '1868' })
    expect(gradeYear('586 BC', -586)).toEqual({ verdict: 'correct', closest: '586 BC' })
    expect(gradeYear('586', -586, { era: 'BC' }).verdict).toBe('correct')
  })

  it('is incorrect for the right number in the wrong era', () => {
    expect(gradeYear('586', -586).verdict).toBe('incorrect')
  })

  it('accepts anything within the tolerance, either side', () => {
    expect(gradeYear('1865', 1868, { tolerance: 5 }).verdict).toBe('correct')
    expect(gradeYear('1873', 1868, { tolerance: 5 }).verdict).toBe('correct')
    expect(gradeYear('1874', 1868, { tolerance: 5 }).verdict).toBe('incorrect')
  })

  it('is incorrect for something that is not a year', () => {
    expect(gradeYear('no idea', 1868).verdict).toBe('incorrect')
  })
})
