import { describe, expect, it } from 'vitest'

import { people } from './index'
import { kingsInOrder } from './relations'

describe('kingsInOrder', () => {
  it('follows Israel from Jeroboam I to Hoshea, leaving out Ish-bosheth', () => {
    const ids = kingsInOrder(people, 'israel').map(king => king.id)
    expect(ids[0]).toBe('jeroboam-i')
    expect(ids.at(-1)).toBe('hoshea')
    expect(ids).toHaveLength(19)
    expect(ids).not.toContain('ish-bosheth')
  })

  it('starts Judah at Rehoboam even though his predecessor is Solomon', () => {
    const ids = kingsInOrder(people, 'judah').map(king => king.id)
    expect(ids[0]).toBe('rehoboam')
    expect(ids.at(-1)).toBe('zedekiah')
    expect(ids).toHaveLength(20)
  })
})
