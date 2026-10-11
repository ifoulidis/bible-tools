import { describe, expect, it } from 'vitest'

import { tooltipLines } from './interaction'

describe('tooltipLines', () => {
  it('is just the name and dates for most people', () => {
    expect(tooltipLines('Asa', '911–870 BC', undefined, [])).toEqual(['Asa: 911–870 BC'])
  })

  it('notes a coregency', () => {
    expect(tooltipLines('Azariah', '767–740 BC', 792, [])).toEqual([
      'Azariah: 767–740 BC (from 792 with overlap)',
    ])
  })

  it('lists every find that names them', () => {
    expect(
      tooltipLines('Hezekiah', '715–686 BC', 729, ["Sennacherib's annals", 'A bulla']),
    ).toEqual([
      'Hezekiah: 715–686 BC (from 729 with overlap)',
      "Named outside the Bible: Sennacherib's annals; A bulla",
    ])
  })
})
