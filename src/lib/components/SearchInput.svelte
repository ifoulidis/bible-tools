<script lang="ts">
  let {
    value = $bindable(),
    label,
    placeholder = 'Search',
    pending = false,
    onsubmit,
  }: {
    value: string
    /** Accessible name for the field */
    label: string
    placeholder?: string
    /** Shows a quiet indicator while what's typed hasn't been searched yet */
    pending?: boolean
    /** Called on Enter, and after clearing, so the caller can search straight away */
    onsubmit?: () => void
  } = $props()

  let input = $state<HTMLInputElement>()
</script>

<form
  role="search"
  class="relative"
  onsubmit={event => {
    event.preventDefault()
    onsubmit?.()
  }}
>
  <svg
    class="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-stone-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path stroke-linecap="round" d="m20 20-3.5-3.5" />
  </svg>
  <input
    bind:this={input}
    bind:value
    type="search"
    class="field w-full py-3 pr-20 pl-12 text-lg [&::-webkit-search-cancel-button]:hidden"
    {placeholder}
    aria-label={label}
    autocomplete="off"
    spellcheck="false"
  />
  <div class="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
    {#if pending}
      <span class="flex gap-0.5 px-1" aria-hidden="true">
        {#each [0, 150, 300] as delay (delay)}
          <span class="dot size-1.5 rounded-full bg-stone-400" style:animation-delay="{delay}ms"
          ></span>
        {/each}
      </span>
    {/if}
    {#if value}
      <button
        type="button"
        class="grid size-8 place-items-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
        aria-label="Clear search"
        onclick={() => {
          value = ''
          onsubmit?.()
          input?.focus()
        }}
      >
        <svg
          class="size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
          aria-hidden="true"
        >
          <path stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    {/if}
  </div>
</form>

<style>
  @media (prefers-reduced-motion: no-preference) {
    .dot {
      animation: pulse 900ms ease-in-out infinite;
    }
  }
  @keyframes pulse {
    50% {
      opacity: 0.25;
    }
  }
</style>
