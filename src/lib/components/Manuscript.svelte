<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    /** A small rubricated line above the title, such as "King of Judah" */
    eyebrow?: string
    title: string
    children?: Snippet
    class?: string
  }

  let { eyebrow, title, children, class: className = '' }: Props = $props()
</script>

<!-- A scrap of old vellum: aged paper inside a double ink rule, the title's first letter picked out
     in red as a scribe would -->
<div class={['manuscript px-4 pt-3 pb-3.5', className]}>
  {#if eyebrow}
    <p class="text-[0.7rem] tracking-[0.18em] text-rubric uppercase">{eyebrow}</p>
  {/if}
  <h3 class="manuscript-title text-xl leading-tight">{title}</h3>
  {#if children}
    <div class="mt-1 text-[0.95rem] leading-snug">
      {@render children()}
    </div>
  {/if}
</div>
