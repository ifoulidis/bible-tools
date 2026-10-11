<script lang="ts" module>
  export type FactCard = {
    id: string
    /** The side you see first */
    prompt: string
    answer: string
    /** A sentence or two under the answer */
    detail?: string
    /** Where the answer comes from, so it can be checked */
    source?: { label: string; url?: string }
  }
</script>

<script lang="ts">
  let {
    card,
    revealed = $bindable(false),
    kicker,
  }: {
    card: FactCard
    revealed?: boolean
    /** Small heading above the prompt, such as the deck's name */
    kicker?: string
  } = $props()

  let back = $state<HTMLDivElement>()

  function reveal() {
    revealed = true
    // The front is hidden once flipped, so focus follows to the answer rather than being lost
    back?.focus()
  }
</script>

<!-- Both faces share one grid cell, so the card is as tall as the taller one -->
<div class="perspective-distant">
  <div
    class="grid transition-transform duration-500 transform-3d motion-reduce:transition-none {revealed
      ? 'rotate-y-180 motion-reduce:rotate-y-0'
      : ''}"
  >
    <button
      class="card col-start-1 row-start-1 grid min-h-56 cursor-pointer content-between gap-6 p-6 text-left transition-shadow backface-hidden hover:shadow-bar-lifted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-800 sm:p-8 {revealed
        ? 'invisible motion-safe:visible'
        : ''}"
      aria-hidden={revealed}
      tabindex={revealed ? -1 : 0}
      onclick={reveal}
    >
      <div class="grid gap-3">
        {#if kicker}
          <p class="eyebrow">{kicker}</p>
        {/if}
        <p class="font-display text-2xl font-semibold text-stone-900 sm:text-3xl">{card.prompt}</p>
      </div>
      <span class="text-sm font-medium text-stone-500">Tap or press Enter to see the answer</span>
    </button>

    <div
      bind:this={back}
      class="card col-start-1 row-start-1 grid min-h-56 rotate-y-180 content-start gap-3 bg-stone-50 p-6 outline-none backface-hidden motion-reduce:rotate-y-0 sm:p-8 {revealed
        ? ''
        : 'invisible motion-safe:visible'}"
      aria-hidden={!revealed}
      aria-live="polite"
      tabindex="-1"
    >
      {#if kicker}
        <p class="eyebrow">{kicker}</p>
      {/if}
      <p class="text-sm text-stone-500">{card.prompt}</p>
      <p class="font-display text-2xl font-semibold text-stone-900 sm:text-3xl">{card.answer}</p>
      {#if card.detail}
        <p class="max-w-[60ch] text-stone-700">{card.detail}</p>
      {/if}
      {#if card.source}
        <p class="text-sm text-stone-500">
          Source:
          {#if card.source.url}
            <a class="link" href={card.source.url} target="_blank" rel="noreferrer"
              >{card.source.label}</a
            >
          {:else}
            {card.source.label}
          {/if}
        </p>
      {/if}
    </div>
  </div>
</div>
