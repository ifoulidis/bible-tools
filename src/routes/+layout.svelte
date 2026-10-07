<script lang="ts">
  import '../app.css'
  import { page } from '$app/stores'
  import Toaster from '$lib/components/toast/Toaster.svelte'

  let { children } = $props()

  const links = [
    { href: '/timeline', label: 'Timeline' },
    { href: '/memorise', label: 'Memorise' },
    { href: '/people', label: 'People' },
  ]

  let menuOpen = $state(false)

  const linkClass = (href: string) =>
    $page.url.pathname === href
      ? 'text-stone-900 underline decoration-primary-400 decoration-2 underline-offset-8'
      : 'text-stone-600 hover:text-stone-900'
</script>

<div class="flex min-h-screen flex-col">
  <header class="sticky top-0 z-30 border-b border-stone-200/70 bg-parchment/80 backdrop-blur-md">
    <nav class="mx-auto flex max-w-300 flex-wrap items-center justify-between px-4 py-3">
      <a href="/" class="flex items-center gap-2.5">
        <!-- The favicon (static/favicon.svg): three staggered reigns, like the timeline's lanes -->
        <svg class="size-7" viewBox="0 0 32 32" aria-hidden="true">
          <rect
            x="0.75"
            y="0.75"
            width="30.5"
            height="30.5"
            rx="7"
            class="fill-parchment stroke-stone-300"
            stroke-width="1.5"
          />
          <rect x="5.5" y="6.5" width="12.5" height="5.5" rx="2.75" class="fill-united" />
          <rect x="13" y="13.25" width="13.5" height="5.5" rx="2.75" class="fill-israel" />
          <rect x="8.5" y="20" width="15.5" height="5.5" rx="2.75" class="fill-judah" />
        </svg>
        <span class="font-display text-xl font-semibold whitespace-nowrap text-stone-900"
          >Bible Tools</span
        >
      </a>

      <button
        class="rounded-lg p-1.5 text-stone-700 hover:bg-stone-100 md:hidden"
        aria-label="Menu"
        aria-expanded={menuOpen}
        onclick={() => (menuOpen = !menuOpen)}
      >
        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Always shown from md up; below that the button toggles it -->
      <ul
        class="w-full flex-col gap-1 pt-3 font-medium md:flex md:w-auto md:flex-row md:gap-7 md:pt-0 {menuOpen
          ? 'flex'
          : 'hidden'}"
      >
        {#each links as { href, label } (href)}
          <li>
            <a
              {href}
              class="block py-2 transition-colors md:py-0 {linkClass(href)}"
              aria-current={$page.url.pathname === href ? 'page' : undefined}
              onclick={() => (menuOpen = false)}>{label}</a
            >
          </li>
        {/each}
        <!-- <li>
          {#if data.user}
            <form method="POST" action="/logout">
              <button
                class="py-2 font-medium text-stone-600 transition-colors hover:text-stone-900 md:py-0"
                title={data.user.email}>Log out</button
              >
            </form>
          {:else}
            <a href="/auth" class="block py-2 transition-colors md:py-0 {linkClass('/auth')}"
              >Log in</a
            >
          {/if}
        </li> -->
      </ul>
    </nav>
  </header>

  <main class="flex-1">
    {@render children?.()}
  </main>

  <footer class="mt-16 border-t border-stone-200/70 py-6 text-center text-sm text-stone-500">
    Dates follow the sources cited on each person's page. Passages open on Bible Gateway.
  </footer>

  <Toaster />
</div>
