<script lang="ts">
  import type { Action } from 'svelte/action'
  import tippy from 'tippy.js'
  import KingdomsBar from './KingdomsBar.svelte'
  import Legend from './Legend.svelte'
  import {
    type LaneId,
    formatSpan,
    layoutTimeline,
    scaleFor,
    scaleWidth,
    ticks,
    yearToX,
  } from '$lib/timeline/layout'
  import { type Filter, filterClasses, filterLabels, filterLanes, laneClasses } from './theme'

  let { data } = $props()

  const laneLabels: Record<LaneId, string> = {
    united: 'United kingdom',
    israel: 'Israel',
    judah: 'Judah',
    prophets: 'Prophets',
  }

  const ROW_PX = 28
  const TICK_STEP = 50
  /** Lanes are spaced apart by this much; the labels beside the chart have to match */
  const LANE_GAP = 'mt-3'

  let filter = $state<Filter>('everyone')
  let pxPerYear = $state(5)
  let hoveredId = $state<string | null>(null)
  /** Phones show each lane's label as a coloured stripe until this is opened */
  let labelsOpen = $state(false)

  const datings = data.people.flatMap(person =>
    [person.reign?.dating, person.ministry?.dating].filter(dating => dating !== undefined),
  )
  // Rounded to the decade so the chart starts just before Saul rather than at the next tick
  let scale = $derived(scaleFor(datings, pxPerYear, 10))
  let laidOut = $derived(layoutTimeline(data.people, scale, filterLanes[filter]))
  const roles = $derived(
    new Map(laidOut.flatMap(item => item.bars.map(bar => [bar.person.id, item.id]))),
  )
  let highlighted = $derived(
    hoveredId && roles.get(hoveredId) === 'prophets'
      ? new Set([hoveredId, ...(data.contemporaries[hoveredId] ?? [])])
      : null,
  )

  const tooltip: Action<HTMLElement, string> = (node, content) => {
    const instance = tippy(node, { content, arrow: false })
    return {
      update: newContent => instance.setContent(newContent),
      destroy: () => instance.destroy(),
    }
  }
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

  <div class="card flex p-2 sm:p-4 sm:pl-5">
    <!-- Lane labels sit outside the scrolling chart, lined up with each lane -->
    <div class="mt-px pr-2 text-right md:pr-3">
      <div class="flex h-8 items-center justify-end border-b border-transparent">
        <button
          class="grid size-7 place-items-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 md:hidden"
          aria-expanded={labelsOpen}
          aria-label={labelsOpen ? 'Collapse lane names' : 'Show lane names'}
          onclick={() => (labelsOpen = !labelsOpen)}
        >
          <svg
            class="size-4 transition-transform {labelsOpen ? 'rotate-180' : ''}"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>
      {#each laidOut as lane (lane.id)}
        <div
          class="{LANE_GAP} flex justify-end text-xs leading-7 font-semibold tracking-wider whitespace-nowrap uppercase {laneClasses[
            lane.id
          ].label}"
          style:height="{lane.rowCount * ROW_PX}px"
          aria-hidden="true"
        >
          <span class={labelsOpen ? '' : 'max-md:hidden'}>{laneLabels[lane.id]}</span>
          <span
            class="my-1 w-1.5 rounded-full md:hidden {laneClasses[lane.id].stripe} {labelsOpen
              ? 'hidden'
              : ''}"
          ></span>
        </div>
      {/each}
    </div>

    <div
      class="min-w-0 flex-1 scrollbar-thin scrollbar-thumb-stone-400 scrollbar-track-stone-100 overflow-x-auto rounded-xl border border-stone-200 bg-stone-50/60"
    >
      <!-- Horizontal padding leaves room for the first axis label, which is centred on x = 0 -->
      <div
        class="relative box-content px-10 pb-4"
        style:width="{scaleWidth(scale)}px"
        style:--grid="{TICK_STEP * pxPerYear}px"
      >
        <div class="relative h-8 border-b border-stone-200">
          {#each ticks(scale, TICK_STEP) as year (year)}
            <span
              class="absolute bottom-1.5 -translate-x-1/2 text-xs font-medium whitespace-nowrap text-stone-400 tabular-nums"
              style:left="{yearToX(scale, year)}px">{year} BC</span
            >
          {/each}
        </div>

        {#each laidOut as lane (lane.id)}
          <section class={LANE_GAP} aria-label={laneLabels[lane.id]}>
            <div
              class="relative bg-[linear-gradient(to_right,var(--color-stone-200)_1px,transparent_1px)] bg-size-[var(--grid)_100%]"
              style:height="{lane.rowCount * ROW_PX}px"
            >
              {#each lane.bars as bar (`${bar.role}-${bar.person.id}`)}
                <!-- Lighter leading segment for any coregency or rival reign -->
                <a
                  href="/people/{bar.person.id}"
                  class="absolute mt-0.75 h-5.5 overflow-hidden rounded-md bg-linear-to-r from-(length:--coregency) to-(length:--coregency) text-xs leading-5.5 font-medium text-white shadow-bar transition duration-150 hover:z-1 hover:-translate-y-px hover:shadow-bar-lifted hover:outline-2 hover:outline-offset-1 hover:outline-stone-800 focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-800 {laneClasses[
                    lane.id
                  ].bar}"
                  class:z-1={bar.widened}
                  class:opacity-20={highlighted && !highlighted.has(bar.person.id)}
                  style:left="{bar.x}px"
                  style:top="{bar.row * ROW_PX}px"
                  style:width="{bar.width}px"
                  style:--coregency="{bar.coregencyWidth}px"
                  use:tooltip={`${bar.person.name}: ${formatSpan(bar.dating)}${bar.dating.coregencyFrom ? ` (from ${bar.dating.coregencyFrom} with overlap)` : ''}`}
                  aria-label="{bar.person.name}, {formatSpan(bar.dating)}"
                  onmouseenter={() => (hoveredId = bar.person.id)}
                  onmouseleave={() => (hoveredId = null)}
                  onfocus={() => (hoveredId = bar.person.id)}
                  onblur={() => (hoveredId = null)}
                  >{#if bar.width > 50}
                    <span class="block overflow-hidden px-1.5 text-clip whitespace-nowrap"
                      >{bar.person.name}</span
                    >
                  {/if}
                </a>
              {/each}
            </div>
          </section>
        {/each}
      </div>
    </div>
  </div>
  <Legend />
</div>
