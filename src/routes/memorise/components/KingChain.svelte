<script lang="ts">
  import type { RecallResult } from '$lib/components/RecallQuiz.svelte'
  import type { Verdict } from '$lib/utility/text'

  let {
    kingdom,
    results,
    total,
  }: { kingdom: 'israel' | 'judah'; results: RecallResult[]; total: number } = $props()

  const verdictClasses: Record<Verdict, string> = {
    correct: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    typo: 'border-amber-200 bg-amber-50 text-amber-800',
    incorrect: 'border-red-200 bg-red-50 text-red-800',
  }
  // Full class names so Tailwind can see them
  const currentClasses = {
    israel: 'border-israel text-israel',
    judah: 'border-judah text-judah',
  }
</script>

<!-- The line of kings so far, coloured by how each was answered -->
<ol class="flex flex-wrap items-center gap-1.5 text-sm" aria-label="Kings so far">
  {#each results as { question, verdict } (question.id)}
    <li class="rounded-full border px-2.5 py-0.5 font-medium {verdictClasses[verdict]}">
      {question.answer}
    </li>
  {/each}
  {#if results.length < total}
    <li
      class="rounded-full border-2 border-dashed px-2.5 py-0.5 font-semibold {currentClasses[
        kingdom
      ]}"
    >
      ?
    </li>
    <li class="text-stone-400">{total - results.length - 1} to go</li>
  {/if}
</ol>
