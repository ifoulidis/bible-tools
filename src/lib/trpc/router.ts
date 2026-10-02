import { trpcContext } from './context'

// No procedures yet: king and prophet data is read from the JSON in $lib/data
export const router = trpcContext.router({})

export const createCaller = trpcContext.createCallerFactory(router)

export type Router = typeof router
