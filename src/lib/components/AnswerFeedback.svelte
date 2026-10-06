<script lang="ts">
  import TextDiff from './TextDiff.svelte'

  let {
    verdict,
    given,
    answer,
    closest = answer,
  }: {
    verdict: 'typo' | 'incorrect'
    given: string
    /** The answer to show as right */
    answer: string
    /** The accepted spelling the typo was nearest, if it isn't `answer` */
    closest?: string
  } = $props()
</script>

<div
  class="rounded-xl border px-5 py-4 {verdict === 'typo'
    ? 'border-amber-200 bg-amber-50'
    : 'border-red-200 bg-red-50'}"
  role="alert"
>
  <p class="flex flex-wrap items-baseline gap-x-2">
    <span
      class="text-xs font-bold tracking-wider uppercase {verdict === 'typo'
        ? 'text-amber-700'
        : 'text-red-700'}">{verdict === 'typo' ? 'Typo' : 'Incorrect'}</span
    >
    <span class="text-stone-700"
      >The answer was <strong class="text-stone-900">{answer}</strong>.</span
    >
  </p>
  {#if verdict === 'typo'}
    <div class="mt-3">
      <TextDiff {given} expected={closest} />
    </div>
  {:else if given}
    <p class="mt-1 text-sm text-stone-500">You wrote “{given}”.</p>
  {/if}
</div>
