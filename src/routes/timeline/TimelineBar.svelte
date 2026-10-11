<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements'
  import tippy from 'tippy.js'
  import { type LaneId, type TimelineDating, formatSpan } from '$lib/timeline/layout'
  import SteleIcon from './SteleIcon.svelte'
  import { tooltipLines } from './interaction'
  import { laneClasses } from './theme'

  /** Bars narrower than this drop their name rather than show a sliver of it */
  const MIN_LABEL_PX = 50
  /** Bars narrower than this drop the badge too; the tooltip still names the find */
  const MIN_BADGE_PX = 20

  interface Props {
    name: string
    dating: TimelineDating
    lane: LaneId
    href: string
    /** Drawn width in px; a coregency gets a lighter leading segment of `coregencyWidth` */
    width: number
    coregencyWidth?: number
    /** Finds outside the Bible that name them, which earn the bar a badge */
    attestedBy?: string[]
    /** Faded back while another bar is highlighted */
    dimmed?: boolean
    /** Drawn wider than its true length, so it sits above the neighbour it may overlap */
    raised?: boolean
    onhoverchange?: (hovering: boolean) => void
    onclick?: MouseEventHandler<HTMLAnchorElement>
    class?: string
    style?: string
  }

  let {
    name,
    dating,
    lane,
    href,
    width,
    coregencyWidth = 0,
    attestedBy = [],
    dimmed = false,
    raised = false,
    onhoverchange,
    onclick,
    class: className = '',
    style,
  }: Props = $props()

  const span = $derived(formatSpan(dating))
  const lines = $derived(tooltipLines(name, span, dating.coregencyFrom, attestedBy))

  let bar = $state<HTMLAnchorElement>()
  /** Rendered here, then handed to tippy, which moves it into the tooltip */
  let tooltipContent = $state<HTMLDivElement>()

  $effect(() => {
    if (!bar || !tooltipContent) return
    const instance = tippy(bar, { content: tooltipContent, arrow: false })
    return () => instance.destroy()
  })
</script>

<a
  bind:this={bar}
  {href}
  {style}
  class={[
    'flex h-5.5 items-center overflow-hidden rounded-md bg-linear-to-r from-(length:--coregency) to-(length:--coregency) text-xs leading-5.5 font-medium text-white shadow-bar transition duration-150 hover:z-1 hover:-translate-y-px hover:shadow-bar-lifted hover:outline-2 hover:outline-offset-1 hover:outline-stone-800 focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stone-800',
    laneClasses[lane].bar,
    raised && 'z-1',
    dimmed && 'opacity-20',
    className,
  ]}
  style:width="{width}px"
  style:--coregency="{coregencyWidth}px"
  aria-label="{name}, {span}{attestedBy.length > 0 ? ', named outside the Bible' : ''}"
  {onclick}
  onmouseenter={() => onhoverchange?.(true)}
  onmouseleave={() => onhoverchange?.(false)}
  onfocus={() => onhoverchange?.(true)}
  onblur={() => onhoverchange?.(false)}
>
  {#if width > MIN_LABEL_PX}
    <span class="min-w-0 flex-1 overflow-hidden px-1.5 text-clip whitespace-nowrap">{name}</span>
  {/if}
  {#if attestedBy.length > 0 && width > MIN_BADGE_PX}
    <SteleIcon class="mx-auto size-3.5 shrink-0 {width > MIN_LABEL_PX ? 'mr-1' : ''}" />
  {/if}
</a>

<div class="hidden">
  <div bind:this={tooltipContent}>
    {#each lines as line (line)}
      <p>{line}</p>
    {/each}
  </div>
</div>
