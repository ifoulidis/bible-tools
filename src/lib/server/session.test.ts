import { describe, expect, it, vi } from 'vitest'

import { SESSION_DAYS, hashToken, sessionExpiry } from './session'

// session.ts imports the Prisma client; these tests only cover its pure helpers
vi.mock('$lib/prisma.server', () => ({ default: {} }))

describe('hashToken', () => {
  it('is a deterministic SHA-256 hex digest that differs from the token', () => {
    const hash = hashToken('some-token')
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
    expect(hashToken('some-token')).toBe(hash)
    expect(hashToken('some-tokem')).not.toBe(hash)
  })
})

describe('sessionExpiry', () => {
  it(`is ${SESSION_DAYS} days after the given time`, () => {
    const now = new Date('2026-01-01T12:00:00Z')
    expect(sessionExpiry(now).toISOString()).toBe('2026-01-31T12:00:00.000Z')
  })
})
