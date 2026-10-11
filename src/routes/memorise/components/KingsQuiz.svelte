<script lang="ts">
  import RecallQuiz, { type RecallQuestion } from '$lib/components/RecallQuiz.svelte'

  import type { QuizKingdom } from '../quiz'
  import KingChain from './KingChain.svelte'

  let { kingdom, kings }: { kingdom: QuizKingdom; kings: RecallQuestion[] } = $props()

  const kingdomNames: Record<QuizKingdom, string> = { israel: 'Israel', judah: 'Judah' }
</script>

<RecallQuiz questions={kings} placeholder="Name of the king">
  {#snippet progress(results)}
    <KingChain {results} />
  {/snippet}

  {#snippet prompt(index)}
    <h2 class="text-2xl font-semibold">
      {#if index === 0}
        Who was the first king of {kingdomNames[kingdom]}?
      {:else}
        Who reigned after {kings[index - 1].answer}?
      {/if}
    </h2>
  {/snippet}
</RecallQuiz>
