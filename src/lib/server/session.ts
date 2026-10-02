import type { Role } from '@prisma/client'
import type { Cookies } from '@sveltejs/kit'
import { createHash, randomBytes } from 'node:crypto'

import { dev } from '$app/environment'
import prisma from '$lib/prisma.server'

export const SESSION_COOKIE = 'session'
export const SESSION_DAYS = 30
const DAY_MS = 24 * 60 * 60 * 1000

export interface AuthUser {
  id: string
  email: string
  role: Role | null
}

/** Sessions are stored by the hash of their token, so the raw token only ever lives in the cookie */
export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export function sessionExpiry(now: Date) {
  return new Date(now.getTime() + SESSION_DAYS * DAY_MS)
}

export async function startSession(cookies: Cookies, userId: string) {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = sessionExpiry(new Date())
  await prisma.session.create({ data: { id: hashToken(token), userId, expiresAt } })
  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: !dev,
    expires: expiresAt,
  })
}

/** The logged-in user for this request's cookie, or null (clearing the cookie if it's stale) */
export async function userFromSession(cookies: Cookies): Promise<AuthUser | null> {
  const token = cookies.get(SESSION_COOKIE)
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { id: hashToken(token) },
    include: { user: true },
  })
  if (!session || session.expiresAt <= new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } })
    cookies.delete(SESSION_COOKIE, { path: '/' })
    return null
  }

  const { id, email, role } = session.user
  return { id, email, role }
}

export async function endSession(cookies: Cookies) {
  const token = cookies.get(SESSION_COOKIE)
  if (token) await prisma.session.deleteMany({ where: { id: hashToken(token) } })
  cookies.delete(SESSION_COOKIE, { path: '/' })
}
