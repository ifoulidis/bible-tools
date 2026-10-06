import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { createTRPCHandle } from 'trpc-sveltekit'
import { v4 as uuidv4 } from 'uuid'

import { dev } from '$app/environment'
import { authEnabled } from '$lib/auth'
import { type AuthUser, userFromSession } from '$lib/server/session'
import { createContext } from '$lib/trpc/context'
import { router } from '$lib/trpc/router'
import { context, setContextualConsole } from '$utility/api/context'

export const addTraceIds: Handle = async ({ event, resolve }) => {
  const requestId = uuidv4()

  // Redefine console.log in the callback scope below
  setContextualConsole()

  return await context.run(requestId, async () => {
    // Logs within this function (or child functions, including the API handlers) will run with a unique request ID prefixed to the message
    return await resolve(event)
  })
}

/** Stands in for a logged-in admin during `vite dev`, so auth never gets in the way locally */
const DEV_USER: AuthUser = { id: 'dev-user', email: 'dev@localhost', role: 'Admin' }

const handleAuth: Handle = async ({ event, resolve }) => {
  // `dev` is compiled to `false` in production builds, so this bypass can't run in production
  if (dev) event.locals.user = DEV_USER
  else event.locals.user = authEnabled ? await userFromSession(event.cookies) : null
  return resolve(event)
}

/** Paths anyone can view without logging in (the auth pages themselves must be here to avoid a redirect loop) */
const publicPrefixes = ['/auth', '/timeline', '/kings-timeline', '/people', '/memorise']

function isPublic(pathname: string) {
  return (
    pathname === '/' ||
    publicPrefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
  )
}

const authGuards: Handle = async ({ event, resolve }) => {
  const { user } = event.locals

  // With accounts off there's nothing to log in or out of
  const { pathname } = event.url
  if (!authEnabled && !dev && (pathname.startsWith('/auth') || pathname.startsWith('/logout')))
    redirect(303, '/')

  // If no user and the page isn't public then redirect to auth
  if (!user && !isPublic(event.url.pathname)) redirect(303, '/auth')

  // If there's a user but they're on an auth page then redirect to the homepage
  if (user && event.url.pathname.startsWith('/auth')) redirect(303, '/')

  // If the user isn't an admin and they're trying to access an admin path then redirect to the homepage
  if (user?.role !== 'Admin' && event.url.pathname.startsWith('/admin')) redirect(303, '/')

  return resolve(event)
}

export const configureTrpc: Handle = createTRPCHandle({ router, createContext })

export const handle = sequence(addTraceIds, handleAuth, authGuards, configureTrpc)
