<script lang="ts">
  import Carousel from '$lib/components/Carousel.svelte'

  import MemoriseSlide from './components/MemoriseSlide.svelte'
  import TimelineSlide from './components/TimelineSlide.svelte'

  const slides = [
    { label: 'Timeline', content: timeline },
    { label: 'Memorise', content: memorise },
  ]

  const features = [
    [
      'Contemporaries',
      'Hover over a prophet to light up the kings the Bible names alongside them.',
    ],
    ['Evidence', 'Every date shows why it sits where it does, with the sources behind it.'],
    ['Scripture', 'Each person links to every passage they appear in.'],
  ]
</script>

{#snippet timeline()}
  <TimelineSlide />
{/snippet}

{#snippet memorise()}
  <MemoriseSlide />
{/snippet}

<svelte:head>
  <title>Bible Tools</title>
</svelte:head>

<div class="mx-auto max-w-300 px-4">
  <div class="pt-12 pb-10 md:pt-20 md:pb-14">
    <Carousel {slides} label="What you can do here" />
  </div>

  <section class="grid gap-8 border-t border-stone-200/70 pt-12 sm:grid-cols-3 sm:gap-4">
    {#each features as [title, body] (title)}
      <div>
        <h2 class="text-xl font-semibold">{title}</h2>
        <p class="mt-2 text-stone-600">{body}</p>
      </div>
    {/each}
  </section>
</div>
