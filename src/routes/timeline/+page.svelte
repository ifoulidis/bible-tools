<script lang="ts">
  import type { Action } from 'svelte/action'
  import tippy from 'tippy.js'
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

  let { data } = $props()

  type Filter = 'everyone' | 'kings' | 'prophets'
  const filterLanes: Record<Filter, LaneId[]> = {
    everyone: ['united', 'israel', 'judah', 'prophets'],
    kings: ['united', 'israel', 'judah'],
    prophets: ['prophets'],
  }
  const filterLabels: Record<Filter, string> = {
    everyone: 'Everyone',
    kings: 'Kings',
    prophets: 'Prophets',
  }

  // Full class names so Tailwind can see them; picked per lane instead of overriding a variable
  const laneClasses: Record<LaneId, { bar: string; dark: string }> = {
    united: {
      bar: 'from-united-light to-united shadow-united-dark',
      dark: 'united-dark',
    },
    israel: {
      bar: 'from-israel-light to-israel shadow-israel-dark',
      dark: 'israel-dark',
    },
    judah: {
      bar: 'from-judah-light to-judah shadow-judah-dark',
      dark: 'judah-dark',
    },
    prophets: {
      bar: 'from-prophets-light to-prophets shadow-prophets-dark',
      dark: 'prophets-dark',
    },
  }

  const ROW_PX = 28
  const TICK_STEP = 50

  let filter = $state<Filter>('everyone')
  let pxPerYear = $state(5)
  let hoveredId = $state<string | null>(null)

  const datings = data.people.flatMap(person =>
    [person.reign?.dating, person.ministry?.dating].filter(dating => dating !== undefined),
  )
  let scale = $derived(scaleFor(datings, pxPerYear))
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
    const instance = tippy(node, { content })
    return {
      update: newContent => instance.setContent(newContent),
      destroy: () => instance.destroy(),
    }
  }
</script>

<svelte:head>
  <title>Kings and Prophets Timeline</title>
</svelte:head>

<div class="mx-auto my-8 max-w-[1200px] px-4 text-gray-800">
  <h1 class="text-[2rem] font-bold">Kings and Prophets</h1>
  <p class="mt-2 mb-4 max-w-[60ch] text-gray-500">
    Hover over a prophet to light up the kings the Bible names alongside them. Click anyone to see
    why they're dated where they are, and where they appear in Scripture.
  </p>

  <div class="mb-3 flex flex-wrap items-center gap-x-8 gap-y-4">
    <div
      class="flex overflow-hidden rounded-lg border border-gray-200"
      role="radiogroup"
      aria-label="Show"
    >
      {#each Object.keys(filterLanes) as Filter[] as option (option)}
        <label
          class="cursor-pointer px-3.5 py-1.5 has-checked:bg-gray-800 has-checked:text-white has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-israel"
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
    <label class="flex items-center gap-2 text-gray-500">
      Zoom
      <input type="range" min="2" max="14" step="1" bind:value={pxPerYear} />
    </label>
  </div>

  <div class="scrollbar-thin overflow-x-auto rounded-lg border border-gray-200">
    <!-- Horizontal padding leaves room for the first axis label, which is centred on x = 0 -->
    <div
      class="relative box-content px-10 pb-4"
      style:width="{scaleWidth(scale)}px"
      style:--grid="{TICK_STEP * pxPerYear}px"
    >
      <div class="relative h-8 border-b border-gray-200">
        {#each ticks(scale, TICK_STEP) as year (year)}
          <span
            class="absolute bottom-1.5 -translate-x-1/2 text-xs whitespace-nowrap text-gray-500"
            style:left="{yearToX(scale, year)}px">{year} BC</span
          >
        {/each}
      </div>

      {#each laidOut as lane (lane.id)}
        <section class="mt-3">
          <div
            class="relative bg-[linear-gradient(to_right,var(--color-gray-200)_1px,transparent_1px)] bg-size-[var(--grid)_100%]"
            style:height="{lane.rowCount * ROW_PX}px"
          >
            {#each lane.bars as bar (`${bar.role}-${bar.person.id}`)}
              <!-- Lighter leading segment for any coregency or rival reign -->
              <a
                href="/people/{bar.person.id}"
                class="absolute mt-0.75 h-5.5 overflow-hidden rounded-sm bg-linear-to-r from-(length:--coregency) to-(length:--coregency) text-xs leading-5.5 text-white shadow-bar transition-opacity duration-120 hover:z-1 hover:outline-2 hover:outline-offset-1 hover:outline-gray-800 focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gray-800 {laneClasses[
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
                  <span class="block overflow-hidden px-1 text-clip whitespace-nowrap"
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
  <Legend />
</div>
