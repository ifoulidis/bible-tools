<script lang="ts">
  import type { Filter } from './theme'

  let { filter, class: className = '' }: { filter: Filter; class?: string } = $props()
</script>

<!-- A crown for the kings, a shepherd's staff for the prophets, and two figures for everyone -->
<svg
  class={className}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  {#if filter === 'kings'}
    <path d="M3 8.5 7.5 12 12 5l4.5 7L21 8.5 19 18H5z" />
    <path d="M5 21h14" />
  {:else if filter === 'prophets'}
    <path d="M8 22V8a5 5 0 0 1 10 0v2.5" />
  {:else}
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20.5a6.5 6.5 0 0 1 13 0" />
    <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" />
    <path d="M18.5 14.4a6.5 6.5 0 0 1 3 5.6" />
  {/if}
</svg>
