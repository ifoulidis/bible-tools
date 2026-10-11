<script lang="ts">
  import { untrack } from 'svelte'

  import { deckSummary, reviewCard, startDeck } from '$lib/utility/deck'
  import { plural } from '$lib/utility/text'

  import Flashcard, { type FactCard } from './Flashcard.svelte'

  let { cards, kicker }: { cards: FactCard[]; kicker?: string } = $props()

  const byId = $derived(new Map(cards.map(card => [card.id, card])))

  // Starts from the cards it's first given; wrap it in {#key} to start a new deck with new cards
  let deck = $state(untrack(() => startDeck(cards.map(card => card.id))))
  let revealed = $state(false)

  let current = $derived(byId.get(deck.queue[0]))
  let summary = $derived(deckSummary(deck))
  let known = $derived(summary.firstTime + summary.afterMisses)

  function review(knew: boolean) {
    deck = reviewCard(deck, knew)
    revealed = false
  }

  function restart() {
    deck = startDeck(cards.map(card => card.id))
    revealed = false
  }
</script>

<div class="grid gap-5">
  {#if known > 0 || summary.missed > 0}
    <p class="text-sm text-stone-500 tabular-nums">
      <span class="text-emerald-700">{known} known</span> ·
      <span class="text-red-700">{summary.missed} missed</span>
    </p>
  {/if}

  {#if current}
    <!-- Keyed so a new card starts face down rather than flipping back over -->
    {#key current.id}
      <Flashcard card={current} bind:revealed {kicker} />
    {/key}

    {#if revealed}
      <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button class="btn btn-secondary justify-center" onclick={() => review(false)}>
          Didn't know it
        </button>
        <button class="btn btn-primary justify-center" onclick={() => review(true)}>Knew it</button>
      </div>
    {/if}

    {#if known > 0 || summary.missed > 0}
      <button
        class="cursor-pointer justify-self-end rounded-full px-3 py-1 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
        onclick={restart}>Start over</button
      >
    {/if}
  {:else}
    <div class="card grid justify-items-start gap-4 p-5 sm:p-6">
      <h2 class="text-2xl font-semibold">Finished</h2>
      <p class="text-stone-600">
        All {plural(cards.length, 'card')} known:
        <strong class="text-emerald-700">{summary.firstTime} first time</strong> and
        <strong class="text-amber-700">{summary.afterMisses} after another look</strong>.
      </p>
      <button class="btn btn-primary" onclick={restart}>Go again</button>
    </div>
  {/if}
</div>
