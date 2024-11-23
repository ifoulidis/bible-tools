import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { createTRPCHandle } from 'trpc-sveltekit'
import { v4 as uuidv4 } from 'uuid'

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import prisma from '$lib/prisma.server'
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

// Initial version per https://supabase.com/docs/guides/auth/server-side/sveltekit
const handleAuth: Handle = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request.
   * The Supabase client gets the Auth token from the request cookies.
   */
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      /**
       * SvelteKit's cookies API requires `path` to be explicitly set in
       * the cookie options. Setting `path` to `/` replicates previous/
       * standard behavior.
       */
      setAll: cookiesToSet => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' })
        })
      },
    },
  })
  event.locals.supabase = supabase

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  const safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    if (!session) {
      return { session: null, user: null }
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser()
    if (error) {
      // JWT validation has failed
      return { session: null, user: null }
    }

    return { session, user }
  }
  event.locals.safeGetSession = safeGetSession

  const { session, user } = await safeGetSession()
  event.locals.user = user
  event.locals.session = session

  if (user) {
    const role = await prisma.userRole.findUnique({ where: { userId: user.id } })
    if (role) event.locals.role = role.role
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
  })
}

const authGuards: Handle = async ({ event, resolve }) => {
  const { user, role } = event.locals

  // If no user then redirect to auth
  if (!user && !event.url.pathname.startsWith('/admin')) redirect(303, '/auth')

  // If there's a user but they're on an auth page then redirect to the homepage
  if (user && event.url.pathname.startsWith('/auth')) redirect(303, '/')

  // If the user isn't an admin and they're trying to access an admin path then redirect to the homepage
  if (role !== 'Admin' && event.url.pathname.startsWith('/admin')) redirect(303, '/')

  return resolve(event)
}

export const configureTrpc: Handle = createTRPCHandle({ router, createContext })

export const handle = sequence(addTraceIds, handleAuth, authGuards, configureTrpc)
