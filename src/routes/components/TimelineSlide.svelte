<script lang="ts">
  // A few stand-in bars echoing the timeline: [lane colour, left %, width %, row]
  const previewBars = [
    ['bg-united', 4, 30, 0],
    ['bg-israel', 36, 38, 1],
    ['bg-judah', 38, 52, 2],
    ['bg-prophets', 48, 10, 3],
    ['bg-prophets', 62, 14, 3],
    ['bg-prophets', 80, 12, 3],
  ] as const
</script>

<div class="grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-12">
  <div>
    <p class="eyebrow">Kings &amp; prophets</p>
    <h1 class="mt-3 text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl md:text-6xl">
      When did the kings of <span class="text-israel-dark">Israel</span> and
      <span class="text-judah-dark">Judah</span> reign?
    </h1>
    <p class="mt-6 max-w-[48ch] text-lg text-stone-600">
      A timeline of the kings of Israel and Judah and the prophets who spoke to them, with the
      evidence and sources behind every date.
    </p>
    <div class="mt-8">
      <a href="/timeline" class="btn btn-primary">
        Open the timeline
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>

  <div class="card relative p-6" aria-hidden="true">
    <div
      class="relative h-44 bg-[linear-gradient(to_right,var(--color-stone-200)_1px,transparent_1px)] bg-size-[12.5%_100%]"
    >
      {#each previewBars as [color, left, width, row], i (i)}
        <div
          class="absolute h-6 rounded-md shadow-bar {color}"
          style:left="{left}%"
          style:width="{width}%"
          style:top="{row * 40 + 8}px"
        ></div>
      {/each}
    </div>
    <div class="mt-3 flex justify-between text-xs text-stone-400">
      <span>1050 BC</span><span>850 BC</span><span>650 BC</span><span>450 BC</span>
    </div>
  </div>
</div>
