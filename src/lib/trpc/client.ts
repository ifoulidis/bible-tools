import { type TRPCClientInit, createTRPCClient } from 'trpc-sveltekit'

import type { Router } from '$lib/trpc/router'

let browserClient: ReturnType<typeof createTRPCClient<Router>>

export function trpc(init?: TRPCClientInit) {
  const isBrowser = typeof window !== 'undefined'
  // eslint-disable-next-line
  if (isBrowser && browserClient) return browserClient
  const client = createTRPCClient<Router>({ init })
  if (isBrowser) browserClient = client
  return client
}
