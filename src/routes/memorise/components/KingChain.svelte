<script lang="ts">
  import type { RecallResult } from '$lib/components/RecallQuiz.svelte'
  import { type Verdict, plural, tallyVerdicts } from '$lib/utility/text'

  let { results }: { results: RecallResult[] } = $props()

  const verdictClasses: Record<Verdict, string> = {
    correct: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    typo: 'border-amber-200 bg-amber-50 text-amber-800',
    incorrect: 'border-red-200 bg-red-50 text-red-800',
  }

  let tally = $derived(tallyVerdicts(results.map(result => result.verdict)))
</script>

<!-- The line of kings so far, coloured by how each was answered -->
{#if results.length > 0}
  <div class="grid gap-2">
    <ol class="flex flex-wrap items-center gap-1.5 text-sm" aria-label="Kings so far">
      {#each results as { question, verdict } (question.id)}
        <li class="rounded-full border px-2.5 py-0.5 font-medium {verdictClasses[verdict]}">
          {question.answer}
        </li>
      {/each}
    </ol>
    <p class="text-sm text-stone-500 tabular-nums">
      <span class="text-emerald-700">{tally.correct} correct</span> ·
      <span class="text-amber-700">{plural(tally.typo, 'typo')}</span> ·
      <span class="text-red-700">{tally.incorrect} wrong</span>
    </p>
  </div>
{/if}
