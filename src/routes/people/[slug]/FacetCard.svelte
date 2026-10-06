<script lang="ts">
  import DatingCard from '$lib/components/DatingCard.svelte'
  import type { Ministry, Reign, Source } from '$lib/data'

  import Card from './Card.svelte'

  let {
    title,
    facet,
    names,
    sources,
  }: {
    title: string
    facet: Reign | Ministry
    names: Record<string, string>
    sources: Record<string, Source>
  } = $props()
</script>

<Card {title}>
  <DatingCard dating={facet.dating} {names} {sources} />

  {#if facet.alternatives.length > 0}
    <details class="group mt-5 border-t border-stone-200 pt-3">
      <summary
        class="cursor-pointer font-semibold text-stone-700 transition-colors hover:text-stone-900"
      >
        Other views ({facet.alternatives.length})
      </summary>
      {#each facet.alternatives as alternative (alternative.label)}
        <div class="mt-4 border-l-3 border-primary-200 pl-4">
          <h3 class="mb-1.5 font-semibold">{alternative.label}</h3>
          <DatingCard dating={alternative.dating} {names} {sources} />
        </div>
      {/each}
    </details>
  {/if}
</Card>
