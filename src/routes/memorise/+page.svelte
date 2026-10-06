<script lang="ts">
  import SegmentedControl from '$lib/components/SegmentedControl.svelte'

  import KingsQuiz from './components/KingsQuiz.svelte'

  let { data } = $props()

  type QuizKingdom = 'israel' | 'judah'

  const kingdomOptions: { value: QuizKingdom; label: string }[] = [
    { value: 'israel', label: 'Israel' },
    { value: 'judah', label: 'Judah' },
  ]

  let kingdom = $state<QuizKingdom>('israel')
</script>

<svelte:head>
  <title>Memorise the Kings</title>
</svelte:head>

<div class="mx-auto my-10 max-w-3xl px-4">
  <p class="eyebrow">Memorise</p>
  <h1 class="mt-2 text-4xl font-semibold md:text-5xl">The order of the kings</h1>
  <p class="mt-3 mb-6 max-w-[60ch] text-stone-600">
    Type each king in turn. Get one wrong and you'll see who it really was, so you can carry on from
    there.
  </p>

  <div class="mb-6">
    <SegmentedControl
      options={kingdomOptions}
      bind:value={kingdom}
      label="Kingdom"
      name="kingdom"
    />
  </div>

  <!-- Switching kingdom starts a fresh quiz -->
  {#key kingdom}
    <KingsQuiz {kingdom} kings={data.quizzes[kingdom]} />
  {/key}
</div>
