import { fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'

import prisma from '$lib/prisma.server'
import { DUMMY_HASH, hashPassword, verifyPassword } from '$lib/server/password'
import { startSession } from '$lib/server/session'

import type { Actions } from './$types'

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email('Enter a valid email address')),
  password: z.string().min(8, 'Password must be at least 8 characters').max(200),
})

/** A text field's value; form fields can also be files, which are treated as empty */
function field(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

function parseCredentials(formData: FormData) {
  return credentialsSchema.safeParse({
    email: field(formData, 'email'),
    password: field(formData, 'password'),
  })
}

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData()
    const email = field(formData, 'email')
    const parsed = parseCredentials(formData)
    // Same message for every failure, so it doesn't reveal which emails have accounts
    if (!parsed.success) return fail(400, { email, message: 'Incorrect email or password' })

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    // Hash against a dummy when there's no user, so timing doesn't reveal it either
    const valid = await verifyPassword(parsed.data.password, user?.passwordHash ?? DUMMY_HASH)
    if (!user || !valid) return fail(400, { email, message: 'Incorrect email or password' })

    await startSession(cookies, user.id)
    redirect(303, '/')
  },

  signup: async ({ request, cookies }) => {
    const formData = await request.formData()
    const email = field(formData, 'email')
    const parsed = parseCredentials(formData)
    if (!parsed.success) {
      return fail(400, { email, message: parsed.error.issues[0].message })
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (existing) return fail(400, { email, message: 'An account with that email already exists' })

    const user = await prisma.user.create({
      data: { email: parsed.data.email, passwordHash: await hashPassword(parsed.data.password) },
    })
    await startSession(cookies, user.id)
    redirect(303, '/')
  },
}
