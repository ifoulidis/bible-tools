<script lang="ts">
  import RecallQuiz, { type RecallQuestion } from '$lib/components/RecallQuiz.svelte'

  import KingChain from './KingChain.svelte'

  let { kingdom, kings }: { kingdom: 'israel' | 'judah'; kings: RecallQuestion[] } = $props()

  const kingdomNames = { israel: 'Israel', judah: 'Judah' }
  // Full class names so Tailwind can see them
  const kingdomText = { israel: 'text-israel', judah: 'text-judah' }
</script>

<RecallQuiz questions={kings} placeholder="Name of the king">
  {#snippet progress(results)}
    <KingChain {kingdom} {results} total={kings.length} />
  {/snippet}

  {#snippet prompt(index)}
    <h2 class="text-2xl font-semibold">
      {#if index === 0}
        Who was the first king of {kingdomNames[kingdom]}?
      {:else}
        Who reigned after <span class={kingdomText[kingdom]}>{kings[index - 1].answer}</span>?
      {/if}
    </h2>
  {/snippet}
</RecallQuiz>
