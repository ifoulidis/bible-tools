<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Carousel from '$lib/components/Carousel.svelte'
  import MemoriseSlide from '../routes/components/MemoriseSlide.svelte'
  import TimelineSlide from '../routes/components/TimelineSlide.svelte'

  const { Story } = defineMeta({
    title: 'Home/Carousel',
    component: Carousel,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
  })
</script>

{#snippet timeline()}
  <TimelineSlide />
{/snippet}

{#snippet memorise()}
  <MemoriseSlide />
{/snippet}

<!-- The home page's carousel -->
<Story name="Home page">
  {#snippet template()}
    <Carousel
      label="What you can do here"
      slides={[
        { label: 'Timeline', content: timeline },
        { label: 'Memorise', content: memorise },
      ]}
    />
  {/snippet}
</Story>

<!-- Autoplay quickly, to watch it move on by itself -->
<Story name="Fast autoplay">
  {#snippet template()}
    <Carousel
      label="What you can do here"
      intervalMs={2000}
      slides={[
        { label: 'Timeline', content: timeline },
        { label: 'Memorise', content: memorise },
      ]}
    />
  {/snippet}
</Story>
