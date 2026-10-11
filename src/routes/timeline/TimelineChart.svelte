<script lang="ts">
  import BarDetails from './BarDetails.svelte'
  import TimelineBar from './TimelineBar.svelte'
  import {
    type Bar,
    type LaneId,
    type TimelinePerson,
    layoutTimeline,
    scaleFor,
    formatSpan,
    scaleWidth,
    ticks,
    yearToX,
  } from '$lib/timeline/layout'
  import { tooltipLines } from './interaction'
  import { type Filter, filterLanes, laneClasses } from './theme'

  interface Props {
    people: TimelinePerson[]
    /** Prophet id → ids of the kings the Bible names alongside them */
    contemporaries: Record<string, string[]>
    filter?: Filter
    pxPerYear?: number
    /**
     * "tooltip" floats each bar's details beside it. "inline" draws a tapped bar's details inside
     * the chart instead, so they turn with it when it's rotated sideways with CSS
     */
    details?: 'tooltip' | 'inline'
  }

  let {
    people,
    contemporaries,
    filter = 'everyone',
    pxPerYear = 5,
    details = 'tooltip',
  }: Props = $props()

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

  /** A person can have a bar in two lanes, as both king and prophet */
  const keyOf = (bar: Bar) => `${bar.role}-${bar.person.id}`

  let hoveredId = $state<string | null>(null)
  /** The bar tapped open on a touch screen; only one at a time */
  let active = $state<{ key: string; personId: string } | null>(null)

  function setActive(key: string, personId: string, isActive: boolean) {
    if (isActive) active = { key, personId }
    // Only clear it if it's still this bar; another may have been tapped open since
    else if (active?.key === key) active = null
  }

  /** Whoever's tooltip is up: a tapped bar wins over a hovered one */
  let focusId = $derived(active?.personId ?? hoveredId)
  /** Phones show each lane's label as a coloured stripe until this is opened */
  let labelsOpen = $state(false)

  const datings = $derived(
    people.flatMap(person =>
      [person.reign?.dating, person.ministry?.dating].filter(dating => dating !== undefined),
    ),
  )
  // Rounded to the decade so the chart starts just before Saul rather than at the next tick
  let scale = $derived(scaleFor(datings, pxPerYear, 10))
  let laidOut = $derived(layoutTimeline(people, scale, filterLanes[filter]))
  /** The tapped bar, for drawing its details inline */
  let activeBar = $derived(
    active === null
      ? undefined
      : laidOut.flatMap(lane => lane.bars).find(bar => keyOf(bar) === active?.key),
  )
  const roles = $derived(
    new Map(laidOut.flatMap(item => item.bars.map(bar => [bar.person.id, item.id]))),
  )
  let highlighted = $derived(
    focusId && roles.get(focusId) === 'prophets'
      ? new Set([focusId, ...(contemporaries[focusId] ?? [])])
      : null,
  )
</script>

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
            {#each lane.bars as bar (keyOf(bar))}
              {@const key = keyOf(bar)}
              <TimelineBar
                class="absolute mt-0.75"
                style="left: {bar.x}px; top: {bar.row * ROW_PX}px"
                active={active?.key === key}
                onactivechange={isActive => setActive(key, bar.person.id, isActive)}
                name={bar.person.name}
                dating={bar.dating}
                lane={lane.id}
                href="/people/{bar.person.id}"
                width={bar.width}
                coregencyWidth={bar.coregencyWidth}
                attestedBy={bar.person.attestedBy}
                raised={bar.widened}
                tooltip={details === 'tooltip'}
                dimmed={highlighted !== null && !highlighted.has(bar.person.id)}
                onhoverchange={hovering => (hoveredId = hovering ? bar.person.id : null)}
              />
            {/each}
            {#if details === 'inline' && activeBar && lane.bars.includes(activeBar)}
              <!-- Just under the bar, styled like the tooltip it stands in for -->
              <div
                class="absolute z-10 w-max max-w-64 rounded-md bg-stone-800 px-2.5 py-1 text-sm text-stone-50 shadow-lg"
                style:left="{activeBar.x}px"
                style:top="{(activeBar.row + 1) * ROW_PX + 2}px"
              >
                <BarDetails
                  name={activeBar.person.name}
                  lines={tooltipLines(
                    activeBar.person.name,
                    formatSpan(activeBar.dating),
                    activeBar.dating.coregencyFrom,
                    activeBar.person.attestedBy,
                  )}
                  href="/people/{activeBar.person.id}"
                  showLink
                />
              </div>
            {/if}
          </div>
        </section>
      {/each}
    </div>
  </div>
</div>
