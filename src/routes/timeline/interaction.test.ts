import { describe, expect, it } from 'vitest'

import { barClick, parsePointerType } from './interaction'

describe('barClick', () => {
  it('navigates straight away for a mouse or keyboard', () => {
    expect(barClick('mouse', false)).toBe('navigate')
    expect(barClick(null, false)).toBe('navigate')
  })

  it('activates on the first tap or pen press', () => {
    expect(barClick('touch', false)).toBe('activate')
    expect(barClick('pen', false)).toBe('activate')
  })

  it('navigates once the bar is already active, however it is pressed', () => {
    expect(barClick('touch', true)).toBe('navigate')
    expect(barClick('pen', true)).toBe('navigate')
    expect(barClick('mouse', true)).toBe('navigate')
    expect(barClick(null, true)).toBe('navigate')
  })
})

describe('parsePointerType', () => {
  it('keeps the pointer types it knows', () => {
    expect(parsePointerType('mouse')).toBe('mouse')
    expect(parsePointerType('pen')).toBe('pen')
    expect(parsePointerType('touch')).toBe('touch')
  })

  it('treats an empty or unknown type as no pointer', () => {
    expect(parsePointerType('')).toBeNull()
    expect(parsePointerType('eye-tracker')).toBeNull()
  })
})
