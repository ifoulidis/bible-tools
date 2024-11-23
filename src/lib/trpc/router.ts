import { trpcContext } from './context'
import { createKing, listKings, updateKing } from './queries/kings'

export const router = trpcContext.router({
  createKing,
  updateKing,
  listKings,
})

export const createCaller = trpcContext.createCallerFactory(router)

export type Router = typeof router
