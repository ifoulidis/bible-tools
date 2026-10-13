import { describe, expect, it } from 'vitest'

import { gradeAnswer } from '$lib/utility/text'

import { nameVariants, parseKingdom, splitRegnalNumber, toQuizKing } from './quiz'

describe('parseKingdom', () => {
  it('reads either kingdom', () => {
    expect(parseKingdom('israel')).toBe('israel')
    expect(parseKingdom('judah')).toBe('judah')
  })

  it('falls back to Israel for a missing or unknown kingdom', () => {
    expect(parseKingdom(null)).toBe('israel')
    expect(parseKingdom('')).toBe('israel')
    expect(parseKingdom('united')).toBe('israel')
    expect(parseKingdom('Judah')).toBe('israel')
  })
})

describe('splitRegnalNumber', () => {
  it('splits a trailing Roman numeral off', () => {
    expect(splitRegnalNumber('Jeroboam I')).toEqual({ base: 'Jeroboam', number: 1 })
    expect(splitRegnalNumber('Jeroboam II')).toEqual({ base: 'Jeroboam', number: 2 })
    expect(splitRegnalNumber('Jeroboam III')).toEqual({ base: 'Jeroboam', number: 3 })
  })

  it('leaves names without a numeral alone', () => {
    expect(splitRegnalNumber('Ahab')).toEqual({ base: 'Ahab' })
    expect(splitRegnalNumber('Ish-bosheth')).toEqual({ base: 'Ish-bosheth' })
  })

  it("doesn't mistake a name ending in I for a numeral", () => {
    expect(splitRegnalNumber('Tiglath-pileser III')).toEqual({ base: 'Tiglath-pileser', number: 3 })
    expect(splitRegnalNumber('Levi')).toEqual({ base: 'Levi' })
    expect(splitRegnalNumber('I')).toEqual({ base: 'I' })
    expect(splitRegnalNumber('Jeroboam IIII')).toEqual({ base: 'Jeroboam IIII' })
  })
})

describe('nameVariants', () => {
  it('accepts a numbered name with or without its numeral, however it is written', () => {
    expect(nameVariants('Jeroboam II')).toEqual([
      'Jeroboam II',
      'Jeroboam',
      'Jeroboam 2',
      'Jeroboam the second',
    ])
  })

  it('has just the name itself otherwise', () => {
    expect(nameVariants('Asa')).toEqual(['Asa'])
  })
})

describe('toQuizKing', () => {
  it('drops the "(king)" qualifier from the answer', () => {
    const king = toQuizKing({ id: 'zechariah-king', name: 'Zechariah (king)', altNames: [] })
    expect(king.answer).toBe('Zechariah')
    expect(king.accepted).toEqual(['Zechariah'])
  })

  it('keeps alternative names, without duplicates', () => {
    const king = toQuizKing({ id: 'azariah', name: 'Azariah', altNames: ['Uzziah', 'Azariah'] })
    expect(king.accepted).toEqual(['Azariah', 'Uzziah'])
  })

  it('marks an alternative name right', () => {
    const { accepted } = toQuizKing({
      id: 'jehoiachin',
      name: 'Jehoiachin',
      altNames: ['Jeconiah', 'Jechoniah', 'Coniah'],
    })
    for (const given of ['Jehoiachin', 'Jeconiah', 'jechoniah', 'Coniah']) {
      expect(gradeAnswer(given, accepted).verdict).toBe('correct')
    }
  })

  it("doesn't make you know the numeral", () => {
    const { accepted } = toQuizKing({ id: 'jeroboam-i', name: 'Jeroboam I', altNames: [] })
    for (const given of ['Jeroboam', 'jeroboam i', 'Jeroboam 1', 'Jeroboam the First']) {
      expect(gradeAnswer(given, accepted).verdict).toBe('correct')
    }
  })

  it('treats the wrong numeral as a typo rather than right', () => {
    const { accepted } = toQuizKing({ id: 'jeroboam-i', name: 'Jeroboam I', altNames: [] })
    expect(gradeAnswer('Jeroboam II', accepted).verdict).toBe('typo')
  })
})
