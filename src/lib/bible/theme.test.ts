import { describe, expect, it } from 'vitest'

import { readTheme, themeCookieString } from './theme'

describe('readTheme', () => {
  it('finds the theme among other cookies', () => {
    expect(readTheme('session=abc; bible-theme=night; other=1')).toBe('night')
    expect(readTheme('bible-theme=sepia')).toBe('sepia')
  })

  it('falls back to paper when there is none, or it is unknown', () => {
    expect(readTheme('')).toBe('paper')
    expect(readTheme('bible-theme=neon')).toBe('paper')
    expect(readTheme('not-bible-theme=night')).toBe('paper')
  })

  it('reads back what it writes', () => {
    expect(readTheme(themeCookieString('white').split(';')[0])).toBe('white')
  })
})
