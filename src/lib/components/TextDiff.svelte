<script lang="ts">
  import { alignCharacters } from '$lib/utility/text'

  let {
    given,
    expected,
    givenLabel = 'You wrote',
    expectedLabel = 'Correct',
  }: { given: string; expected: string; givenLabel?: string; expectedLabel?: string } = $props()

  // Both rows share one alignment, so each column holds the two characters being compared
  let pairs = $derived(alignCharacters(given, expected))
</script>

<dl class="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1">
  <dt class="text-xs font-semibold tracking-wider text-stone-500 uppercase">{givenLabel}</dt>
  <dd class="font-mono text-lg tracking-wide">
    {#each pairs as pair, i (i)}<span
        class={pair.same
          ? 'text-stone-800'
          : pair.a === null
            ? 'text-transparent'
            : 'rounded-sm bg-red-100 text-red-700 line-through decoration-2'}>{pair.a ?? '·'}</span
      >{/each}
  </dd>
  <dt class="text-xs font-semibold tracking-wider text-stone-500 uppercase">{expectedLabel}</dt>
  <dd class="font-mono text-lg tracking-wide">
    {#each pairs as pair, i (i)}<span
        class={pair.same
          ? 'text-stone-800'
          : pair.b === null
            ? 'text-transparent'
            : 'rounded-sm bg-emerald-100 font-semibold text-emerald-700'}>{pair.b ?? '·'}</span
      >{/each}
  </dd>
</dl>
