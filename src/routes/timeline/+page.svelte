<script lang="ts">
  import type { Action } from 'svelte/action'
  import tippy from 'tippy.js'

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
  let highlighted = $derived(
    hoveredId ? new Set([hoveredId, ...(data.contemporaries[hoveredId] ?? [])]) : null,
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

<div class="page">
  <h1>Kings and Prophets</h1>
  <p class="intro">
    Hover over a prophet to light up the kings the Bible names alongside them. Click anyone to see
    why they're dated where they are, and where they appear in Scripture.
  </p>

  <div class="controls">
    <div class="filters" role="radiogroup" aria-label="Show">
      {#each Object.keys(filterLanes) as Filter[] as option (option)}
        <label class:active={filter === option}>
          <input type="radio" name="filter" value={option} bind:group={filter} />
          {filterLabels[option]}
        </label>
      {/each}
    </div>
    <label class="zoom">
      Zoom
      <input type="range" min="2" max="14" step="1" bind:value={pxPerYear} />
    </label>
  </div>

  <div class="legend">
    <span><i class="swatch united"></i>United kingdom</span>
    <span><i class="swatch israel"></i>Israel</span>
    <span><i class="swatch judah"></i>Judah</span>
    <span><i class="swatch prophets"></i>Prophet</span>
    <span><i class="swatch coregency"></i>Coregency / overlap</span>
    <span><i class="swatch approx"></i>Approximate</span>
  </div>

  <div class="scroller">
    <div
      class="canvas"
      style:width="{scaleWidth(scale)}px"
      style:--grid="{TICK_STEP * pxPerYear}px"
    >
      <div class="axis">
        {#each ticks(scale, TICK_STEP) as year (year)}
          <span class="tick" style:left="{yearToX(scale, year)}px">{year} BC</span>
        {/each}
      </div>

      {#each laidOut as lane (lane.id)}
        <section class="lane {lane.id}">
          <h2>{lane.title}</h2>
          <div class="rows" style:height="{lane.rowCount * ROW_PX}px">
            {#each lane.bars as bar (`${bar.role}-${bar.person.id}`)}
              <a
                href="/people/{bar.person.id}"
                class="bar"
                class:approx={bar.dating.span.approx}
                class:widened={bar.widened}
                class:dimmed={highlighted && !highlighted.has(bar.person.id)}
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
              >
                <span class="label">{bar.person.name}</span>
              </a>
            {/each}
          </div>
        </section>
      {/each}
    </div>
  </div>
</div>

<style>
  .page {
    --united: #7c3aed;
    --israel: #2563eb;
    --judah: #dc2626;
    --prophets: #d97706;
    --ink: #1f2937;
    --muted: #6b7280;
    --line: #e5e7eb;
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
    color: var(--ink);
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
  }

  .intro {
    color: var(--muted);
    margin: 0.5rem 0 1rem;
    max-width: 60ch;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 2rem;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .filters {
    display: flex;
    border: 1px solid var(--line);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .filters label {
    padding: 0.35rem 0.9rem;
    cursor: pointer;
  }

  .filters label.active {
    background: var(--ink);
    color: white;
  }

  .filters input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .filters label:has(input:focus-visible) {
    outline: 2px solid var(--israel);
    outline-offset: -2px;
  }

  .zoom {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--muted);
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1rem;
    font-size: 0.85rem;
    color: var(--muted);
    margin-bottom: 1rem;
  }

  .swatch {
    display: inline-block;
    width: 1.5rem;
    height: 0.75rem;
    border-radius: 0.2rem;
    margin-right: 0.35rem;
    vertical-align: middle;
  }

  .swatch.united {
    background: var(--united);
  }
  .swatch.israel {
    background: var(--israel);
  }
  .swatch.judah {
    background: var(--judah);
  }
  .swatch.prophets {
    background: var(--prophets);
  }
  .swatch.coregency {
    background: color-mix(in srgb, var(--ink) 30%, white);
  }
  .swatch.approx {
    border: 1px dashed var(--ink);
  }

  .scroller {
    overflow-x: auto;
    border: 1px solid var(--line);
    border-radius: 0.5rem;
    scrollbar-width: thin;
  }

  .canvas {
    position: relative;
    /* Room for the first axis label, which is centred on x = 0 */
    padding: 0 2.5rem 1rem;
    box-sizing: content-box;
  }

  .axis {
    position: relative;
    height: 2rem;
    border-bottom: 1px solid var(--line);
  }

  .tick {
    position: absolute;
    bottom: 0.4rem;
    transform: translateX(-50%);
    font-size: 0.75rem;
    color: var(--muted);
    white-space: nowrap;
  }

  .lane {
    --color: var(--prophets);
  }
  .lane.united {
    --color: var(--united);
  }
  .lane.israel {
    --color: var(--israel);
  }
  .lane.judah {
    --color: var(--judah);
  }

  h2 {
    position: sticky;
    left: 0;
    width: max-content;
    margin: 0.75rem 0 0.25rem;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color);
  }

  .rows {
    position: relative;
    background-image: linear-gradient(to right, var(--line) 1px, transparent 1px);
    background-size: var(--grid) 100%;
  }

  .bar {
    position: absolute;
    height: 22px;
    margin-top: 3px;
    border-radius: 0.25rem;
    /* Lighter leading segment for any coregency or rival reign */
    background: linear-gradient(
      to right,
      color-mix(in srgb, var(--color) 35%, white) var(--coregency),
      var(--color) var(--coregency)
    );
    color: white;
    font-size: 0.75rem;
    line-height: 22px;
    overflow: hidden;
    transition: opacity 120ms;
  }

  .bar:hover,
  .bar:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 1px;
    z-index: 1;
  }

  .bar.approx {
    border: 1px dashed var(--ink);
    line-height: 20px;
  }

  .bar.widened {
    z-index: 1;
  }

  .bar.dimmed {
    opacity: 0.2;
  }

  .label {
    display: block;
    padding: 0 0.3rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
    text-shadow: 0 0 2px rgb(0 0 0 / 0.4);
  }

  :global([data-tippy-root]) {
    background-color: #374151;
    color: white;
    border-radius: 0.25rem;
    padding: 0.2rem 0.6rem;
    font-size: 0.85rem;
  }
</style>
