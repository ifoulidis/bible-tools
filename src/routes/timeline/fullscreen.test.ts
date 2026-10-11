import { describe, expect, it } from 'vitest'

import { fullscreenLayout } from './fullscreen'

describe('fullscreenLayout', () => {
  it('is the normal page whenever full screen is off', () => {
    for (const phone of [true, false]) {
      for (const portrait of [true, false]) {
        expect(fullscreenLayout('off', { phone, portrait })).toBe('page')
      }
    }
  })

  it('keeps the controls on top on a computer or tablet, whichever way it is held', () => {
    expect(fullscreenLayout('native', { phone: false, portrait: false })).toBe('wide')
    expect(fullscreenLayout('overlay', { phone: false, portrait: true })).toBe('wide')
  })

  it('uses the sideways layout on a phone already in landscape', () => {
    expect(fullscreenLayout('native', { phone: true, portrait: false })).toBe('phone')
    expect(fullscreenLayout('overlay', { phone: true, portrait: false })).toBe('phone')
  })

  it('turns the layout itself sideways on a phone still held upright', () => {
    expect(fullscreenLayout('native', { phone: true, portrait: true })).toBe('phone-rotated')
    expect(fullscreenLayout('overlay', { phone: true, portrait: true })).toBe('phone-rotated')
  })
})
