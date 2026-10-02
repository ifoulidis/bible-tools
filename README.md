# web-starter-sveltekit

See the style notes at `style_notes.md`

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# Start the server and open the app in a new browser tab
npm run dev -- --open
```

Get a quick database GUI in dev by running `npm run db:gui`, which uses [Prisma Studio](https://www.prisma.io/studio)

## Auth

Email and password accounts are stored in the `User` table (passwords hashed with scrypt) with sessions in `Session`. Sign up or log in at `/auth`.

- In `npm run dev` auth is bypassed: every request acts as a logged-in admin. Production builds always require a real login.
- To make someone an admin, set their `role` to `Admin` in the `User` table.

## Migrate

Prisma reads `DATABASE_URL` from `.env` via `prisma.config.ts`.

`npx prisma migrate dev --name name_here`, then `npm run db:generate` (Prisma 7 no longer generates the client after migrating).

Use `npm run db:generate` rather than `npx prisma generate`: the Zod generator crashes on newer Node versions when its output folder already exists, so the script deletes it first. If the client still seems out of date, stop the dev server and run it again (the dev server can lock the generated files).

`npx prisma db seed` loads the king and prophet data.

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
