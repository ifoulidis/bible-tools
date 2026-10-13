<script lang="ts">
  import Manuscript from '$lib/components/Manuscript.svelte'
  import type { LaneId } from '$lib/timeline/layout'

  interface Props {
    name: string
    lane: LaneId
    /** "874–853 BC" */
    span: string
    coregencyFrom?: number
    altNames?: string[]
    /** Finds outside the Bible that name them */
    attestedBy?: string[]
    href: string
    /** Only when tapped open: a mouse goes to the page by clicking the bar itself */
    showLink: boolean
    onnavigate?: (event: MouseEvent) => void
  }

  let {
    name,
    lane,
    span,
    coregencyFrom,
    altNames = [],
    attestedBy = [],
    href,
    showLink,
    onnavigate,
  }: Props = $props()

  const eyebrows: Record<LaneId, string> = {
    united: 'United kingdom',
    israel: 'Kingdom of Israel',
    judah: 'Kingdom of Judah',
    prophets: 'Prophet',
  }
</script>

<!-- What a bar's popover or callout says. The data attribute lets an active bar tell a tap on its
     details from a tap elsewhere, which would close them -->
<div data-bar-details>
  <Manuscript eyebrow={eyebrows[lane]} title={name}>
    <p class="italic">
      {span}{#if coregencyFrom}<span class="not-italic"
          >, sharing the throne from {coregencyFrom} BC</span
        >{/if}
    </p>
    {#if altNames.length > 0}
      <p>Also called {altNames.join(', ')}</p>
    {/if}
    {#if attestedBy.length > 0}
      <p class="my-1 text-center text-rubric" aria-hidden="true">❦</p>
      <p class="text-[0.7rem] tracking-[0.18em] text-rubric uppercase">Named outside the Bible</p>
      <ul>
        {#each attestedBy as artifact (artifact)}
          <li class="italic">{artifact}</li>
        {/each}
      </ul>
    {/if}
    {#if showLink}
      <a
        class="mt-2 block text-rubric underline decoration-rubric/40 underline-offset-4"
        {href}
        tabindex="-1"
        onclick={event => onnavigate?.(event)}>Open {name}'s page →</a
      >
    {/if}
  </Manuscript>
</div>
