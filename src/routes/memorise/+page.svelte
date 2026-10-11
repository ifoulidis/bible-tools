<script lang="ts">
  import { page } from '$app/stores'
  import { untrack } from 'svelte'

  import { replaceState } from '$app/navigation'
  import SegmentedControl from '$lib/components/SegmentedControl.svelte'

  import KingsQuiz from './components/KingsQuiz.svelte'
  import { type QuizKingdom, parseKingdom } from './quiz'

  let { data } = $props()

  const kingdomOptions: { value: QuizKingdom; label: string }[] = [
    { value: 'israel', label: 'Israel' },
    { value: 'judah', label: 'Judah' },
  ]

  // Starts from the URL, so a link can open straight onto Judah
  let kingdom = $state(parseKingdom($page.url.searchParams.get('kingdom')))

  // Keeps the URL in step, as on the people page. Israel is the default, so it leaves the URL bare
  $effect(() => {
    const query = kingdom === 'israel' ? '' : `?kingdom=${kingdom}`
    if (query !== location.search) {
      replaceState(
        location.pathname + query,
        untrack(() => $page.state),
      )
    }
  })
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
