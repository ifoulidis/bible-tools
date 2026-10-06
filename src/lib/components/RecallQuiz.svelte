<script lang="ts" module>
  import type { Verdict } from '$lib/utility/text'

  export type RecallQuestion = {
    id: string
    /** The answer shown when it's got wrong */
    answer: string
    /** Every spelling that counts as right, including `answer` */
    accepted: string[]
  }

  export type RecallResult = {
    question: RecallQuestion
    given: string
    verdict: Verdict
    closest: string
  }
</script>

<script lang="ts">
  import type { Snippet } from 'svelte'

  import { gradeAnswer } from '$lib/utility/text'

  import AnswerFeedback from './AnswerFeedback.svelte'
  import { showToast } from './toast/toast.svelte'

  let {
    questions,
    prompt,
    progress,
    placeholder = 'Type your answer',
  }: {
    questions: RecallQuestion[]
    /** Renders the question being asked */
    prompt: Snippet<[index: number, question: RecallQuestion]>
    /** Optional view of how far through the quiz the answers so far have got */
    progress?: Snippet<[results: RecallResult[]]>
    placeholder?: string
  } = $props()

  let results = $state<RecallResult[]>([])
  let typed = $state('')
  let input = $state<HTMLInputElement>()

  let index = $derived(results.length)
  let current = $derived(questions[index])
  // The last answer, shown above the next question when it wasn't right
  let feedback = $derived(results.at(-1)?.verdict === 'correct' ? undefined : results.at(-1))
  let tally = $derived({
    correct: results.filter(r => r.verdict === 'correct').length,
    typo: results.filter(r => r.verdict === 'typo').length,
    incorrect: results.filter(r => r.verdict === 'incorrect').length,
  })

  $effect(() => {
    input?.focus()
  })

  function submit(given: string) {
    if (!current) return
    const { verdict, closest } = given.trim()
      ? gradeAnswer(given, current.accepted)
      : { verdict: 'incorrect' as const, closest: current.answer }
    results.push({ question: current, given: given.trim(), verdict, closest })
    typed = ''
    if (verdict === 'correct') showToast('Correct', 'success')
  }

  function restart() {
    results = []
    typed = ''
  }
</script>

<div class="grid gap-5">
  {@render progress?.(results)}

  {#if feedback}
    <AnswerFeedback
      verdict={feedback.verdict === 'typo' ? 'typo' : 'incorrect'}
      given={feedback.given}
      answer={feedback.question.answer}
      closest={feedback.closest}
    />
  {/if}

  {#if current}
    <form
      class="card grid gap-5 p-6"
      onsubmit={event => {
        event.preventDefault()
        submit(typed)
      }}
    >
      <div class="flex items-baseline justify-between gap-4">
        {@render prompt(index, current)}
        <span class="shrink-0 text-sm text-stone-500 tabular-nums"
          >{index + 1} / {questions.length}</span
        >
      </div>
      <div class="flex flex-wrap gap-3">
        <input
          bind:this={input}
          bind:value={typed}
          class="field min-w-0 flex-1 text-lg"
          {placeholder}
          autocomplete="off"
          autocapitalize="words"
          spellcheck="false"
          aria-label="Your answer"
        />
        <button class="btn btn-primary" disabled={!typed.trim()}>Check</button>
        <button type="button" class="btn btn-secondary" onclick={() => submit('')}>
          I don't know
        </button>
      </div>
    </form>
  {:else}
    <div class="card grid justify-items-start gap-4 p-6">
      <h2 class="text-2xl font-semibold">Finished</h2>
      <p class="text-stone-600">
        <strong class="text-emerald-700">{tally.correct} correct</strong>,
        <strong class="text-amber-700">{tally.typo} with typos</strong> and
        <strong class="text-red-700">{tally.incorrect} incorrect</strong>
        out of {questions.length}.
      </p>
      <button class="btn btn-primary" onclick={restart}>Try again</button>
    </div>
  {/if}
</div>
