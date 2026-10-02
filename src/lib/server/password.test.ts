import { describe, expect, it } from 'vitest'

import { DUMMY_HASH, hashPassword, verifyPassword } from './password'

describe('password hashing', () => {
  it('verifies the right password and rejects a wrong one', async () => {
    const stored = await hashPassword('correct horse battery')
    expect(stored).toMatch(/^scrypt:[0-9a-f]{32}:[0-9a-f]{128}$/)
    expect(stored).not.toContain('correct horse battery')
    expect(await verifyPassword('correct horse battery', stored)).toBe(true)
    expect(await verifyPassword('correct horse batterz', stored)).toBe(false)
  })

  it('salts each hash, so the same password hashes differently', async () => {
    const [a, b] = await Promise.all([hashPassword('same password'), hashPassword('same password')])
    expect(a).not.toBe(b)
    expect(await verifyPassword('same password', b)).toBe(true)
  })

  it('treats differently composed Unicode as the same password', async () => {
    const stored = await hashPassword('café au lait')
    expect(await verifyPassword('café au lait', stored)).toBe(true)
  })

  it('rejects malformed stored hashes instead of throwing', async () => {
    for (const stored of ['', 'plaintext', 'bcrypt:aa:bb', 'scrypt:aa', 'scrypt:aa:bb']) {
      expect(await verifyPassword('anything', stored)).toBe(false)
    }
  })

  it('never verifies against the dummy hash', async () => {
    expect(await verifyPassword('', DUMMY_HASH)).toBe(false)
    expect(await verifyPassword('password', DUMMY_HASH)).toBe(false)
  })
})
