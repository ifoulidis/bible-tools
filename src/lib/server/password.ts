import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

// https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback
// Node's defaults (N=16384, r=8, p=1) with a 64-byte key and a random 16-byte salt per password
const KEY_LENGTH = 64
const SALT_BYTES = 16

function deriveKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password.normalize('NFKC'), salt, KEY_LENGTH, (err, key) => {
      if (err) reject(err)
      else resolve(key)
    })
  })
}

/** Returns "scrypt:<salt hex>:<key hex>", which is what's stored in User.passwordHash */
export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_BYTES)
  const key = await deriveKey(password, salt)
  return `scrypt:${salt.toString('hex')}:${key.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, saltHex, keyHex] = stored.split(':')
  if (scheme !== 'scrypt' || !saltHex || !keyHex) return false
  const expected = Buffer.from(keyHex, 'hex')
  if (expected.length !== KEY_LENGTH) return false
  const actual = await deriveKey(password, Buffer.from(saltHex, 'hex'))
  return timingSafeEqual(actual, expected)
}

/**
 * Checked against when a login email doesn't exist, so a wrong email takes as long as a wrong
 * password and response times don't reveal which emails have accounts
 */
export const DUMMY_HASH = `scrypt:${'00'.repeat(SALT_BYTES)}:${'00'.repeat(KEY_LENGTH)}`
