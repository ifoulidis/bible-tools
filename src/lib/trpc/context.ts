import type { RequestEvent } from '@sveltejs/kit'
import { initTRPC } from '@trpc/server'

export async function createContext(event: RequestEvent) {
  const { user, role } = event.locals
  return { event, user, role }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create()

export const trpcContext = t
export const procedure = t.procedure
