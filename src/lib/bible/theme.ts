/**
 * The Bible reader's colour themes. Each redefines the site's colours in app.css under
 * `:root[data-theme=…]`, and only within /bible, as the rest of the site isn't made for them.
 *
 * The choice is kept in a cookie, which an inline script in app.html reads to set the theme before
 * the page paints. The reader's pages are prerendered, so the server can't do it, and waiting for
 * the app to load would flash the default colours first.
 */
export const themes = [
  // The swatches show each theme's own colours, whichever theme is showing
  { id: 'paper', label: 'Paper', background: '#faf7f2', text: '#292524' },
  { id: 'white', label: 'White', background: '#ffffff', text: '#1c1917' },
  { id: 'sepia', label: 'Sepia', background: '#f3e9d2', text: '#4a3b2a' },
  { id: 'night', label: 'Night', background: '#1a1917', text: '#e7e2da' },
] as const

export type Theme = (typeof themes)[number]['id']

/** Also named in app.html's script */
export const themeCookie = 'bible-theme'

export function isTheme(value: string | undefined): value is Theme {
  return themes.some(theme => theme.id === value)
}

/** The theme in a `document.cookie` string, or the default */
export function readTheme(cookies: string): Theme {
  const value = new RegExp(`(?:^|;\\s*)${themeCookie}=([^;]*)`).exec(cookies)?.[1]
  return isTheme(value) ? value : 'paper'
}

/** A `document.cookie` assignment that keeps the theme for a year */
export function themeCookieString(theme: Theme) {
  return `${themeCookie}=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
}
