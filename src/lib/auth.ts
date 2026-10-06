/**
 * Accounts are switched off in production until the site has a database to keep them in. Without
 * it nothing looks up sessions, and the log in and log out pages aren't reachable. `vite dev` still
 * stands in a logged-in admin either way (see hooks.server.ts).
 */
export const authEnabled = false as boolean
