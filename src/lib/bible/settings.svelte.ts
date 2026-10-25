export type Layout = 'paragraphs' | 'verses'
export type Typeface = 'serif' | 'sans'

/** The reading sizes to step between, in pixels */
export const textSizes = [15, 16, 17, 18, 20, 22, 24, 27]

const defaults = {
  layout: 'paragraphs' as Layout,
  typeface: 'serif' as Typeface,
  /** An index into `textSizes` */
  size: 3,
  headings: true,
  notes: true,
  verseNumbers: true,
}

export type ReaderSettings = typeof defaults

const storageKey = 'bible:settings'

/** How the reader lays out the text, kept in the browser so it's the same next visit */
export const settings = $state<ReaderSettings>({ ...defaults })

/** Call once in the browser, before saving anything */
export function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Partial<ReaderSettings>
    for (const key of Object.keys(defaults) as (keyof ReaderSettings)[]) {
      // Only take what still has the right type, in case the settings have changed since
      if (typeof saved[key] === typeof defaults[key]) Object.assign(settings, { [key]: saved[key] })
    }
    settings.size = Math.min(Math.max(settings.size, 0), textSizes.length - 1)
  } catch {
    // Storage can be blocked, as in some private windows; the defaults do
  }
}

export function saveSettings() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(settings))
  } catch {
    // As above
  }
}
