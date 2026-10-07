/**
 * Follows `getter`, but only once it has stopped changing for `delayMs`, so typing doesn't
 * re-run work on every keystroke. Create it while a component initialises.
 */
export class Debounced<T> {
  current = $state() as T
  #getter: () => T
  #timer: ReturnType<typeof setTimeout> | undefined

  constructor(getter: () => T, delayMs: number) {
    this.#getter = getter
    this.current = getter()

    $effect(() => {
      const next = getter()
      clearTimeout(this.#timer)
      this.#timer = setTimeout(() => {
        this.current = next
      }, delayMs)
      return () => {
        clearTimeout(this.#timer)
      }
    })
  }

  /** True while the latest value is still waiting out the delay */
  get pending() {
    return this.#getter() !== this.current
  }

  /** Skips the wait, e.g. when someone presses Enter */
  flush() {
    clearTimeout(this.#timer)
    this.current = this.#getter()
  }
}
