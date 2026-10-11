<script lang="ts">
  import KingdomsBar from './KingdomsBar.svelte'
  import Legend from './Legend.svelte'
  import TimelineChart from './TimelineChart.svelte'
  import { type Filter, filterClasses, filterLabels, filterLanes } from './theme'

  let { data } = $props()

  let filter = $state<Filter>('everyone')
  let pxPerYear = $state(5)
</script>

<svelte:head>
  <title>Kings and Prophets Timeline</title>
</svelte:head>

<div class="mx-auto my-10 max-w-300 px-4">
  <div class="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
    <div>
      <p class="eyebrow">Timeline</p>
      <h1 class="mt-2 text-4xl font-semibold md:text-5xl">Kings and Prophets</h1>
    </div>
    <KingdomsBar />
  </div>
  <p class="mt-3 mb-6 max-w-[60ch] text-stone-600">
    Hover over a prophet to light up the kings the Bible names alongside them. Click anyone to see
    why they're dated where they are, and where they appear in Scripture.
  </p>

  <div class="mb-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
    <div
      class="flex gap-1 rounded-full border border-stone-200 bg-white p-1 shadow-sm"
      role="radiogroup"
      aria-label="Show"
    >
      {#each Object.keys(filterLanes) as Filter[] as option (option)}
        <label
          class="cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium text-stone-600 transition-colors not-has-checked:hover:bg-stone-100 has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-israel {filterClasses[
            option
          ]}"
        >
          <input
            class="pointer-events-none absolute opacity-0"
            type="radio"
            name="filter"
            value={option}
            bind:group={filter}
          />
          {filterLabels[option]}
        </label>
      {/each}
    </div>
    <label class="flex items-center gap-3 text-sm font-medium text-stone-600">
      Zoom
      <input class="slider" type="range" min="2" max="14" step="1" bind:value={pxPerYear} />
    </label>
  </div>

  <TimelineChart people={data.people} contemporaries={data.contemporaries} {filter} {pxPerYear} />
  <Legend />
</div>
