import { describe, expect, it } from 'vitest'

import { bibleGatewayUrl, comparePassages, formatPassage } from './books'

describe('formatPassage', () => {
  it('formats a single verse', () => {
    expect(formatPassage({ book: '1Kgs', from: { chapter: 16, verse: 29 } })).toBe('1 Kings 16:29')
  })

  it('formats a whole chapter', () => {
    expect(formatPassage({ book: 'Hos', from: { chapter: 1 } })).toBe('Hosea 1')
  })

  it('shortens a range within one chapter', () => {
    expect(
      formatPassage({
        book: '1Kgs',
        from: { chapter: 15, verse: 25 },
        to: { chapter: 15, verse: 31 },
      }),
    ).toBe('1 Kings 15:25–31')
  })

  it('formats a range across chapters', () => {
    expect(
      formatPassage({
        book: '1Kgs',
        from: { chapter: 16, verse: 28 },
        to: { chapter: 22, verse: 40 },
      }),
    ).toBe('1 Kings 16:28–22:40')
  })

  it('formats a range of whole chapters', () => {
    expect(formatPassage({ book: 'Hos', from: { chapter: 1 }, to: { chapter: 3 } })).toBe(
      'Hosea 1–3',
    )
  })
})

describe('bibleGatewayUrl', () => {
  it('encodes the passage with an ASCII hyphen', () => {
    expect(
      bibleGatewayUrl({
        book: '2Kgs',
        from: { chapter: 9, verse: 1 },
        to: { chapter: 10, verse: 36 },
      }),
    ).toBe('https://www.biblegateway.com/passage/?search=2%20Kings%209%3A1-10%3A36&version=ESV')
  })
})

describe('comparePassages', () => {
  it('orders by canon, then chapter, then verse', () => {
    const passages = [
      { book: 'Matt' as const, from: { chapter: 1, verse: 1 } },
      { book: '1Kgs' as const, from: { chapter: 16, verse: 29 } },
      { book: '1Kgs' as const, from: { chapter: 16 } },
      { book: '1Sam' as const, from: { chapter: 9, verse: 1 } },
    ]
    expect(passages.sort(comparePassages).map(formatPassage)).toEqual([
      '1 Samuel 9:1',
      '1 Kings 16',
      '1 Kings 16:29',
      'Matthew 1:1',
    ])
  })
})
