<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity'
  import { type EventKind, eventKinds, events } from '$lib/data/events'

  import EventIcon from './EventIcon.svelte'
  import FilterIcon from './FilterIcon.svelte'
  import KingdomsBar from './KingdomsBar.svelte'
  import Legend from './Legend.svelte'
  import TimelineChart from './TimelineChart.svelte'
  import {
    type Fullscreen,
    type FullscreenLayout,
    PHONE_QUERY,
    fullscreenLayout,
  } from './fullscreen'
  import { type Filter, filterClasses, filterLabels, filterLanes } from './theme'

  let { data } = $props()

  let filter = $state<Filter>('everyone')
  let pxPerYear = $state(5)
  const filters = Object.keys(filterLanes) as Filter[]

  /** The world's events give some perspective from the start; the Bible's are there to turn on */
  let shownEvents = $state<Record<EventKind, boolean>>({ bible: false, world: true })
  let visibleEvents = $derived(events.filter(event => shownEvents[event.kind]))
  const eventToggleLabels: Record<EventKind, string> = {
    bible: 'Bible events',
    world: 'World events',
  }

  let fullscreen = $state<Fullscreen>('off')
  let stage = $state<HTMLElement>()

  const phone = new MediaQuery(PHONE_QUERY, false)
  const portrait = new MediaQuery('(orientation: portrait)', false)
  let layout = $derived(
    fullscreenLayout(fullscreen, { phone: phone.current, portrait: portrait.current }),
  )

  // The phone layouts fill the screen with a rail of controls beside the chart. "phone-rotated"
  // turns it a quarter turn clockwise about its top-left corner, then slides it back on screen
  const layoutClasses: Record<FullscreenLayout, string> = {
    page: '',
    wide: 'h-full overflow-auto p-2 sm:p-4',
    phone: 'flex h-full gap-2 p-2',
    'phone-rotated':
      'absolute top-0 left-0 flex h-[100dvw] w-[100dvh] origin-top-left translate-x-[100dvw] rotate-90 gap-2 p-2',
  }

  /** `lock` is missing from TypeScript's DOM types, and from most browsers but Android's */
  type LockableOrientation = ScreenOrientation & {
    lock?: (orientation: 'landscape') => Promise<void>
  }

  async function lockLandscape() {
    const orientation: LockableOrientation = screen.orientation
    try {
      await orientation.lock?.('landscape')
    } catch {
      // Refused or unsupported; the layout turns itself sideways instead
    }
  }

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
      return
    }
    if (phone.current) await lockLandscape()
  }

  function exitFullscreen() {
    // Leaving native fullscreen fires fullscreenchange, which sets the state. The browser drops
    // any orientation lock along with it
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

{#snippet fullscreenIcon(entering: boolean)}
  <svg
    class="size-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      d={entering
        ? 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'
        : 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5'}
    />
  </svg>
{/snippet}

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
    class={[layout !== 'page' && 'fixed inset-0 z-50 overflow-hidden bg-parchment']}
  >
    <div class={layoutClasses[layout]}>
      {#if layout === 'phone' || layout === 'phone-rotated'}
        <!-- A rail of controls down one side: icons rather than words, and the slider upright -->
        <div
          class="flex shrink-0 flex-col items-center gap-3 overflow-y-auto rounded-2xl border border-stone-200 bg-white p-1.5 shadow-sm"
        >
          <button
            class="grid size-10 cursor-pointer place-items-center rounded-full text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-stone-800"
            aria-label="Exit full screen"
            onclick={exitFullscreen}
          >
            {@render fullscreenIcon(false)}
          </button>
          <div class="flex flex-col gap-1" role="radiogroup" aria-label="Show">
            {#each filters as option (option)}
              <label
                class="grid size-10 cursor-pointer place-items-center rounded-full text-stone-600 transition-colors not-has-checked:hover:bg-stone-100 has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-israel {filterClasses[
                  option
                ]}"
                title={filterLabels[option]}
              >
                <input
                  class="pointer-events-none absolute opacity-0"
                  type="radio"
                  name="filter"
                  value={option}
                  aria-label={filterLabels[option]}
                  bind:group={filter}
                />
                <FilterIcon filter={option} class="size-5" />
              </label>
            {/each}
          </div>
          <div class="flex flex-col gap-1" role="group" aria-label="Events">
            {#each eventKinds as kind (kind)}
              <label
                class="grid size-10 cursor-pointer place-items-center rounded-full text-stone-600 transition-colors not-has-checked:hover:bg-stone-100 has-checked:bg-stone-200 has-checked:text-stone-900 has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-israel"
                title={eventToggleLabels[kind]}
              >
                <input
                  class="pointer-events-none absolute opacity-0"
                  type="checkbox"
                  aria-label={eventToggleLabels[kind]}
                  bind:checked={shownEvents[kind]}
                />
                <EventIcon {kind} class="size-5" />
              </label>
            {/each}
          </div>
          <!-- Upright, with zooming in at the top -->
          <input
            class="slider my-2 min-h-12 w-1.5 flex-1 [direction:rtl] [writing-mode:vertical-lr]"
            type="range"
            min="2"
            max="14"
            step="1"
            aria-label="Zoom"
            bind:value={pxPerYear}
          />
        </div>
        <div class="min-w-0 flex-1 overflow-auto">
          <TimelineChart
            people={data.people}
            contemporaries={data.contemporaries}
            {filter}
            events={visibleEvents}
            {pxPerYear}
            details="inline"
          />
        </div>
      {:else}
        <div class="mb-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <div
            class="flex gap-1 rounded-full border border-stone-200 bg-white p-1 shadow-sm"
            role="radiogroup"
            aria-label="Show"
          >
            {#each filters as option (option)}
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
          <div
            class="flex gap-1 rounded-full border border-stone-200 bg-white p-1 shadow-sm"
            role="group"
            aria-label="Events"
          >
            {#each eventKinds as kind (kind)}
              <label
                class="flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium text-stone-600 transition-colors not-has-checked:hover:bg-stone-100 has-checked:bg-stone-200 has-checked:text-stone-900 has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-israel"
              >
                <input
                  class="pointer-events-none absolute opacity-0"
                  type="checkbox"
                  bind:checked={shownEvents[kind]}
                />
                <EventIcon {kind} class="size-4" />
                {eventToggleLabels[kind]}
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
            {@render fullscreenIcon(fullscreen === 'off')}
            {fullscreen === 'off' ? 'Full screen' : 'Exit full screen'}
          </button>
        </div>

        <TimelineChart
          people={data.people}
          contemporaries={data.contemporaries}
          {filter}
          events={visibleEvents}
          {pxPerYear}
        />
        <Legend />
      {/if}
    </div>
  </div>
</div>
