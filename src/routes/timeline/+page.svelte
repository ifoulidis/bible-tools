<script lang="ts">
  import KingdomsBar from './KingdomsBar.svelte'
  import Legend from './Legend.svelte'
  import TimelineChart from './TimelineChart.svelte'
  import { type Filter, filterClasses, filterLabels, filterLanes } from './theme'

  let { data } = $props()

  let filter = $state<Filter>('everyone')
  let pxPerYear = $state(5)

  /**
   * "native" uses the browser's Fullscreen API. Where that isn't available (iPhones only allow it
   * for video) or is refused, "overlay" covers the window instead
   */
  type Fullscreen = 'off' | 'native' | 'overlay'
  let fullscreen = $state<Fullscreen>('off')
  let stage = $state<HTMLElement>()

  async function enterFullscreen() {
    if (!stage?.requestFullscreen) {
      fullscreen = 'overlay'
      return
    }
    try {
      await stage.requestFullscreen()
      fullscreen = 'native'
    } catch {
      fullscreen = 'overlay'
    }
  }

  function exitFullscreen() {
    // Leaving native fullscreen fires fullscreenchange, which sets the state
    if (fullscreen === 'native' && document.fullscreenElement) void document.exitFullscreen()
    else fullscreen = 'off'
  }
</script>

<svelte:document
  onfullscreenchange={() => {
    // Covers Escape and the browser's own exit controls, as well as our button
    if (fullscreen === 'native' && !document.fullscreenElement) fullscreen = 'off'
  }}
/>

<svelte:window
  onkeydown={event => {
    // The browser handles Escape itself in native fullscreen
    if (event.key === 'Escape' && fullscreen === 'overlay') fullscreen = 'off'
  }}
/>

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
    Hover over or tap a prophet to light up the kings the Bible names alongside them. Click anyone,
    or tap them twice, to see why they're dated where they are, and where they appear in Scripture.
  </p>

  <!-- Everything that goes full screen: the controls come too, so you can still filter and zoom -->
  <div
    bind:this={stage}
    class={[fullscreen !== 'off' && 'fixed inset-0 z-50 overflow-auto bg-parchment p-2 sm:p-4']}
  >
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
      <button
        class="ml-auto flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-stone-800"
        aria-pressed={fullscreen !== 'off'}
        onclick={() => (fullscreen === 'off' ? enterFullscreen() : exitFullscreen())}
      >
        <svg
          class="size-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          {#if fullscreen === 'off'}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
            />
          {:else}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"
            />
          {/if}
        </svg>
        {fullscreen === 'off' ? 'Full screen' : 'Exit full screen'}
      </button>
    </div>

    <TimelineChart people={data.people} contemporaries={data.contemporaries} {filter} {pxPerYear} />
    <Legend />
  </div>
</div>
