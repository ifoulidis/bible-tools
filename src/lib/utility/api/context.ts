import { AsyncLocalStorage } from 'node:async_hooks'

// From https://dev.to/air16/a-simple-way-to-keep-context-in-consolelog-4e88

export const context = new AsyncLocalStorage()

let __log = null as null | typeof console.log
export function setContextualConsole() {
  // Singleton
  if (__log) return
  __log = console.log

  console.log = function (...args: unknown[]) {
    // Retrieve a contextual prefix instead of a static prefix
    const contextualPrefix = context.getStore() as string

    if (contextualPrefix) args.unshift(`requestId=${contextualPrefix}`)

    if (__log) __log.apply(console, args)
  }
}
