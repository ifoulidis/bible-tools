<script lang="ts">
  // Decorative: the united kingdom splitting into Israel and Judah, using the same dates as the data
  const START = 1050
  const END = 586
  const pct = (year: number) => ((START - year) / (START - END)) * 100

  // [lane colour, from, to, row, animation delay]
  const segments = [
    ['bg-united', 1050, 931, 1, 0],
    ['bg-israel', 931, 723, 0, 450],
    ['bg-judah', 931, 586, 2, 450],
  ] as const

  // Which side of its tick each label hangs, so the last two don't collide
  const align = {
    start: 'items-start',
    center: '-translate-x-1/2 items-center',
    end: '-translate-x-full items-end',
  }
  const markers = [
    { year: 1050, label: 'Saul', side: 'start' },
    { year: 931, label: 'Division', side: 'center' },
    { year: 723, label: 'Samaria falls', side: 'end' },
    { year: 586, label: 'Jerusalem falls', side: 'end' },
  ] as const
</script>

<div class="w-full max-w-sm" aria-hidden="true">
  <div class="relative h-9">
    {#each segments as [color, from, to, row, delay] (color)}
      <div
        class="grow-in absolute h-2 rounded-full shadow-sm {color}"
        style:left="{pct(from)}%"
        style:width="{pct(to) - pct(from)}%"
        style:top="{row * 14}px"
        style:animation-delay="{delay}ms"
      ></div>
    {/each}
    <!-- The fork where the kingdom divides -->
    <div class="absolute top-0 h-[36px] w-px bg-stone-300" style:left="{pct(931)}%"></div>
  </div>

  <div class="relative mt-2 h-9 border-t border-stone-300">
    {#each markers as { year, label, side } (year)}
      <div
        class="absolute top-0 flex flex-col text-[0.7rem] leading-tight whitespace-nowrap {align[
          side
        ]}"
        style:left="{pct(year)}%"
      >
        <span class="h-1.5 w-px bg-stone-400"></span>
        <span class="mt-0.5 font-semibold text-stone-700 tabular-nums">{year} BC</span>
        <span class="text-stone-500">{label}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .grow-in {
    transform-origin: left;
  }
  @media (prefers-reduced-motion: no-preference) {
    .grow-in {
      animation: grow 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
    }
  }
  @keyframes grow {
    from {
      transform: scaleX(0);
    }
  }
</style>
