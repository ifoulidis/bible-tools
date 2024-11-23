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

## Migrate

`npx prisma migrate dev --name name_here`

If you need to force a model to sync again, stop the dev server and run `npx prisma generate` (if dev server isn't stopped then there's a locked file so it doesn't work).

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
