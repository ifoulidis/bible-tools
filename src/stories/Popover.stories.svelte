<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import Manuscript from '$lib/components/Manuscript.svelte'
  import Popover from '$lib/components/Popover.svelte'

  const { Story } = defineMeta({
    title: 'Components/Popover',
    component: Popover,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
  })
</script>

<script lang="ts">
  let bounds = $state<HTMLElement>()
  let near = $state<HTMLElement>()
  let low = $state<HTMLElement>()
</script>

<!-- The dashed box stands in for the chart. The top anchor has room below it inside the box, so
     its popover goes below; the bottom one doesn't, so its popover goes above -->
<Story name="Above or below">
  {#snippet template()}
    <div
      bind:this={bounds}
      class="relative h-64 max-w-md rounded-lg border-2 border-dashed border-stone-300"
    >
      <span bind:this={near} class="absolute top-4 left-6 rounded bg-israel px-2 text-white"
        >Room below</span
      >
      <span bind:this={low} class="absolute bottom-4 left-40 rounded bg-judah px-2 text-white"
        >No room below</span
      >
    </div>
    <Popover anchor={near} {bounds} open>
      <Manuscript title="Below" />
    </Popover>
    <Popover anchor={low} {bounds} open>
      <Manuscript title="Above" />
    </Popover>
  {/snippet}
</Story>

<!-- A box too short for either: it goes above all the same, spilling out of the box -->
<Story name="Spilling out">
  {#snippet template()}
    <div class="h-40"></div>
    <div
      bind:this={bounds}
      class="relative h-12 max-w-md rounded-lg border-2 border-dashed border-stone-300"
    >
      <span bind:this={near} class="absolute top-3 left-6 rounded bg-prophets px-2 text-white"
        >Anchor</span
      >
    </div>
    <Popover anchor={near} {bounds} open>
      <Manuscript eyebrow="Spilling out" title="Above the box">
        <p>Taller than the box it's meant to fit in.</p>
      </Manuscript>
    </Popover>
  {/snippet}
</Story>
